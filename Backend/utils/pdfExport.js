const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const LEFT = 54;
const RIGHT = PAGE_WIDTH - LEFT;
const BOTTOM = 52;

const cleanText = (value) => String(value ?? "")
  .normalize("NFKD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/[^\x20-\x7E]/g, "?");

const escapePdfText = (value) => cleanText(value)
  .replace(/\\/g, "\\\\")
  .replace(/\(/g, "\\(")
  .replace(/\)/g, "\\)");

const wrapText = (value, maxLength = 88) => {
  const words = cleanText(value).split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";
  for (const word of words) {
    if (word.length > maxLength) {
      if (line) lines.push(line);
      line = "";
      for (let offset = 0; offset < word.length; offset += maxLength) {
        const part = word.slice(offset, offset + maxLength);
        if (offset + maxLength >= word.length) line = part;
        else lines.push(part);
      }
    } else if (!line) {
      line = word;
    } else if (`${line} ${word}`.length <= maxLength) {
      line += ` ${word}`;
    } else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines.length ? lines : [""];
};

const formatDate = (value, format = "MM/DD/YYYY") => {
  if (!value) return "Not set";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not set";
  const year = String(date.getUTCFullYear());
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  if (format === "DD/MM/YYYY") return `${day}/${month}/${year}`;
  if (format === "YYYY-MM-DD") return `${year}-${month}-${day}`;
  return `${month}/${day}/${year}`;
};

const idOf = (value) => value?.toString?.() || String(value ?? "");
const valueOr = (value, fallback = "Not set") => value === undefined || value === null || value === "" ? fallback : value;

const createReportLines = (backup) => {
  const { account = {}, data = {}, exportedAt } = backup;
  const dateFormat = account.preferences?.dateFormat || "MM/DD/YYYY";
  const todos = data.todos || [];
  const notes = data.notes || [];
  const goals = data.goals || [];
  const progress = data.goalProgress || [];
  const habits = data.habits || [];
  const completions = data.habitCompletions || [];
  const goalNames = new Map(goals.map((goal) => [idOf(goal._id), goal.title]));
  const habitNames = new Map(habits.map((habit) => [idOf(habit._id), habit.title]));
  const lines = [];
  const heading = (text) => lines.push({ text, size: 15, bold: true, gap: 8 });
  const paragraph = (text, options = {}) => {
    for (const wrapped of wrapText(text, options.maxLength || 88)) {
      lines.push({ text: wrapped, size: options.size || 9, bold: options.bold || false, gap: 3 });
    }
  };
  const recordHeading = (text) => paragraph(text, { size: 10, bold: true });
  const empty = (items) => items.length ? items : null;

  lines.push({ text: "TaskFlow Data Report", size: 23, bold: true, gap: 10 });
  paragraph(`Prepared for ${valueOr(account.name, "TaskFlow user")}`);
  paragraph(`Generated ${formatDate(exportedAt, dateFormat)} | Account ${valueOr(account.email)}`);
  lines.push({ text: "", size: 7, gap: 6 });

  heading("At a glance");
  paragraph(`To-dos: ${todos.length} | Notes: ${notes.length} | Goals: ${goals.length} | Habits: ${habits.length}`);
  paragraph(`Goal progress entries: ${progress.length} | Habit completion records: ${completions.length}`);
  paragraph(`Account created: ${formatDate(account.createdAt, dateFormat)} | Theme: ${valueOr(account.preferences?.theme)}`);
  paragraph(`Default page: ${valueOr(account.preferences?.defaultPage)} | Date format: ${dateFormat} | Week starts: ${account.preferences?.weekStartsOn === 1 ? "Monday" : "Sunday"}`);

  heading("To-dos");
  if (!empty(todos)) paragraph("No to-dos in this account.");
  todos.forEach((todo, index) => {
    recordHeading(`${index + 1}. ${valueOr(todo.title, "Untitled to-do")} [${todo.completed ? "Completed" : "Open"}]`);
    paragraph(`Due: ${formatDate(todo.dueDate, dateFormat)} | Priority: ${valueOr(todo.priority)}${todo.pinned ? " | Pinned" : ""}`);
    if (todo.description) paragraph(todo.description);
  });

  heading("Notes");
  if (!empty(notes)) paragraph("No notes in this account.");
  notes.forEach((note, index) => {
    const flags = [note.isPinned ? "Pinned" : "", note.isArchived ? "Archived" : ""].filter(Boolean);
    recordHeading(`${index + 1}. ${valueOr(note.title, "Untitled note")}`);
    paragraph(`Created: ${formatDate(note.createdAt, dateFormat)}${flags.length ? ` | ${flags.join(" | ")}` : ""}`);
    if (note.content) paragraph(note.content);
  });

  heading("Goals");
  if (!empty(goals)) paragraph("No goals in this account.");
  goals.forEach((goal, index) => {
    recordHeading(`${index + 1}. ${valueOr(goal.title, "Untitled goal")} [${valueOr(goal.status)}]`);
    const progressSummary = goal.targetValue == null
      ? "Qualitative goal"
      : `Progress: ${valueOr(goal.currentValue, 0)} / ${valueOr(goal.targetValue, 0)}${goal.unit ? ` ${goal.unit}` : ""}`;
    paragraph(`${progressSummary} | Target date: ${formatDate(goal.targetDate, dateFormat)} | Priority: ${valueOr(goal.priority)}`);
    if (goal.description) paragraph(goal.description);
  });

  heading("Goal progress history");
  if (!empty(progress)) paragraph("No goal progress entries in this account.");
  progress.forEach((entry, index) => {
    recordHeading(`${index + 1}. ${valueOr(goalNames.get(idOf(entry.goal)), "Goal")} | +${valueOr(entry.value, 0)} | ${formatDate(entry.createdAt, dateFormat)}`);
    if (entry.note) paragraph(entry.note);
  });

  heading("Habits");
  if (!empty(habits)) paragraph("No habits in this account.");
  habits.forEach((habit, index) => {
    const schedule = habit.frequency === "specific_days" && habit.daysOfWeek?.length
      ? `Weekdays ${habit.daysOfWeek.join(", ")}`
      : valueOr(habit.frequency, "Daily");
    recordHeading(`${index + 1}. ${valueOr(habit.title, "Untitled habit")}${habit.isArchived ? " [Archived]" : ""}`);
    paragraph(`Schedule: ${schedule} | Category: ${valueOr(habit.category)} | Started: ${formatDate(habit.startDate, dateFormat)}`);
    if (habit.description) paragraph(habit.description);
  });

  heading("Habit completion history");
  if (!empty(completions)) paragraph("No habit completion records in this account.");
  completions.forEach((entry, index) => {
    const habit = habitNames.get(idOf(entry.habit));
    const amount = entry.value === undefined || entry.value === null ? "" : ` | Value: ${entry.value}`;
    recordHeading(`${index + 1}. ${valueOr(habit, "Habit")} | ${formatDate(entry.date, dateFormat)}${amount}`);
    if (entry.note) paragraph(entry.note);
  });

  return lines;
};

const renderPages = (lines) => {
  const pages = [];
  let commands = [];
  let y = 728;
  const startPage = () => {
    commands = [];
    y = 728;
  };
  const commitPage = () => pages.push(commands.join("\n"));

  for (const line of lines) {
    const font = line.bold ? "F2" : "F1";
    const leading = line.size + (line.gap ?? 3);
    if (y - leading < BOTTOM) {
      commitPage();
      startPage();
    }
    commands.push(`BT /${font} ${line.size} Tf 0.12 0.16 0.23 rg ${LEFT} ${y} Td (${escapePdfText(line.text)}) Tj ET`);
    y -= leading;
  }
  commitPage();

  return pages.map((body, index) => [
    "BT /F2 9 Tf 0.10 0.34 0.66 rg 54 758 Td (TASKFLOW) Tj ET",
    "0.75 w 54 748 m 558 748 l S",
    body,
    "0.75 w 54 40 m 558 40 l S",
    `BT /F1 8 Tf 0.35 0.39 0.46 rg 54 25 Td (Personal data report) Tj ET`,
    `BT /F1 8 Tf 0.35 0.39 0.46 rg 520 25 Td (${index + 1} / ${pages.length}) Tj ET`,
  ].join("\n"));
};

const buildPdf = (pageStreams) => {
  const objects = [];
  const addObject = (value) => {
    objects.push(Buffer.isBuffer(value) ? value : Buffer.from(value, "ascii"));
    return objects.length;
  };

  const catalogId = addObject("");
  const pagesId = addObject("");
  const regularFontId = addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>");
  const boldFontId = addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>");
  const pageIds = [];

  for (const stream of pageStreams) {
    const streamBuffer = Buffer.from(stream, "ascii");
    const contentId = addObject(Buffer.concat([
      Buffer.from(`<< /Length ${streamBuffer.length} >>\nstream\n`, "ascii"),
      streamBuffer,
      Buffer.from("\nendstream", "ascii"),
    ]));
    const pageId = addObject("");
    pageIds.push(pageId);
    objects[pageId - 1] = Buffer.from(
      `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /Font << /F1 ${regularFontId} 0 R /F2 ${boldFontId} 0 R >> >> /Contents ${contentId} 0 R >>`,
      "ascii",
    );
  }

  objects[catalogId - 1] = Buffer.from(`<< /Type /Catalog /Pages ${pagesId} 0 R >>`, "ascii");
  objects[pagesId - 1] = Buffer.from(
    `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`,
    "ascii",
  );

  const chunks = [Buffer.from("%PDF-1.4\n%TaskFlow\n", "ascii")];
  const offsets = [0];
  let length = chunks[0].length;
  objects.forEach((object, index) => {
    offsets.push(length);
    const chunk = Buffer.concat([
      Buffer.from(`${index + 1} 0 obj\n`, "ascii"),
      object,
      Buffer.from("\nendobj\n", "ascii"),
    ]);
    chunks.push(chunk);
    length += chunk.length;
  });

  const xrefOffset = length;
  const xref = ["xref", `0 ${objects.length + 1}`, "0000000000 65535 f "];
  for (let index = 1; index < offsets.length; index += 1) {
    xref.push(`${String(offsets[index]).padStart(10, "0")} 00000 n `);
  }
  xref.push(
    "trailer",
    `<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>`,
    "startxref",
    String(xrefOffset),
    "%%EOF",
  );
  chunks.push(Buffer.from(xref.join("\n"), "ascii"));
  return Buffer.concat(chunks);
};

exports.createDataReportPdf = (backup) => buildPdf(renderPages(createReportLines(backup)));
