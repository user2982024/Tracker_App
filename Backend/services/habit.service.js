
const mongoose = require("mongoose");
const Habit = require("../models/Habit");
const HabitCompletion = require("../models/HabitCompletion");

// Helpers

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const normalizeDate = (date) => {
  if (!date) return null;

  const value = String(date);

  // Accept date-only strings to avoid timezone shifting.
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const parsed = new Date(`${value}T00:00:00.000Z`);

    if (
      Number.isNaN(parsed.getTime()) ||
      parsed.toISOString().slice(0, 10) !== value
    ) {
      return null;
    }

    return parsed;
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return new Date(
    Date.UTC(
      parsed.getUTCFullYear(),
      parsed.getUTCMonth(),
      parsed.getUTCDate()
    )
  );
};

const dateKey = (date) => {
  return date.toISOString().slice(0, 10);
};

const getTodayUTC = () => {
  const now = new Date();

  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );
};

const addDaysUTC = (date, days) => {
  const result = new Date(date);

  result.setUTCDate(result.getUTCDate() + days);

  return result;
};

const escapeRegex = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const validateUser = (userId) => {
  if (!userId) {
    throw new Error("User not authenticated");
  }

  if (!isValidObjectId(userId)) {
    throw new Error("Invalid user ID");
  }
};

const validateHabitId = (habitId) => {
  if (!habitId || !isValidObjectId(habitId)) {
    throw new Error("Invalid habit ID");
  }
};

const validateFrequency = (frequency, daysOfWeek) => {
  if (!["daily", "specific_days"].includes(frequency)) {
    throw new Error("Frequency must be daily or specific_days");
  }

  if (!Array.isArray(daysOfWeek)) {
    throw new Error("Days of week must be an array");
  }

  if (daysOfWeek.some(
    (day) => !Number.isInteger(day) || day < 0 || day > 6
  )) {
    throw new Error(
      "Each weekday must be an integer from 0 (Sunday) to 6 (Saturday)"
    );
  }

  if (new Set(daysOfWeek).size !== daysOfWeek.length) {
    throw new Error("Weekdays cannot contain duplicates");
  }

  if (frequency === "daily" && daysOfWeek.length !== 0) {
    throw new Error("Daily habits cannot have selected weekdays");
  }

  if (frequency === "specific_days" && daysOfWeek.length === 0) {
    throw new Error("Select at least one weekday");
  }
};

const isScheduledOnDate = (habit, date) => {
  if (date < normalizeDate(habit.startDate)) {
    return false;
  }

  if (habit.frequency === "daily") {
    return true;
  }

  return (
    habit.frequency === "specific_days" &&
    habit.daysOfWeek.includes(date.getUTCDay())
  );
};

const validateTarget = (targetValue, unit) => {
  if (
    targetValue !== undefined &&
    targetValue !== null &&
    (!Number.isFinite(Number(targetValue)) || Number(targetValue) <= 0)
  ) {
    throw new Error("Target value must be greater than zero");
  }

  if (
    targetValue !== undefined &&
    targetValue !== null &&
    (!unit || typeof unit !== "string" || !unit.trim())
  ) {
    throw new Error("Unit is required when a target value is provided");
  }
};

// Create Habit Service

const createHabitService = async ({
  userId,
  title,
  description,
  frequency = "daily",
  daysOfWeek = [],
  targetValue,
  unit = "",
  category = "personal",
  priority = "medium",
  isPinned = false,
  startDate,
}) => {
  validateUser(userId);

  if (typeof title !== "string" || !title.trim()) {
    throw new Error("Habit title is required");
  }

  if (title.trim().length < 3 || title.trim().length > 200) {
    throw new Error("Habit title must be between 3 and 200 characters");
  }

  if (
    description !== undefined &&
    (typeof description !== "string" || description.length > 1000)
  ) {
    throw new Error("Description cannot exceed 1000 characters");
  }

  validateFrequency(frequency, daysOfWeek);
  validateTarget(targetValue, unit);

  if (!["health", "career", "learning", "finance", "personal"].includes(category)) {
    throw new Error("Invalid habit category");
  }

  if (!["low", "medium", "high"].includes(priority)) {
    throw new Error("Priority must be low, medium, or high");
  }

  if (typeof isPinned !== "boolean") {
    throw new Error("isPinned must be a boolean");
  }

  const normalizedStartDate = startDate
    ? normalizeDate(startDate)
    : getTodayUTC();

  if (!normalizedStartDate) {
    throw new Error("Start date must be a valid date");
  }

  if (normalizedStartDate > getTodayUTC()) {
    throw new Error("Start date cannot be in the future");
  }

  const habitData = {
    user: userId,
    title: title.trim(),
    frequency,
    daysOfWeek,
    category,
    priority,
    isPinned,
    startDate: normalizedStartDate,
  };

  if (description !== undefined) {
    habitData.description = description.trim();
  }

  if (targetValue !== undefined && targetValue !== null) {
    habitData.targetValue = Number(targetValue);
    habitData.unit = unit.trim();
  } else {
    habitData.targetValue = null;
    habitData.unit = unit ? unit.trim() : "";
  }

  return await Habit.create(habitData);
};

// Get All Habits Service

const getAllHabitsService = async ({
  userId,
  page = 1,
  limit = 10,
  category = "all",
  search = "",
  archived = false,
  sortBy = "default",
} = {}) => {
  validateUser(userId);

  page = Number(page);
  limit = Number(limit);

  if (!Number.isInteger(page) || page < 1) page = 1;
  if (!Number.isInteger(limit) || limit < 1) limit = 10;

  // Avoid excessively large queries.
  limit = Math.min(limit, 100);

  if (typeof archived === "string") {
    archived = archived === "true";
  }

  const query = {
    user: userId,
    isArchived: archived,
  };

  if (category && category !== "all") {
    if (!["health", "career", "learning", "finance", "personal"].includes(category)) {
      throw new Error("Invalid habit category");
    }

    query.category = category;
  }

  if (search && String(search).trim()) {
    const escapedSearch = escapeRegex(String(search).trim());

    query.$or = [
      { title: { $regex: escapedSearch, $options: "i" } },
      { description: { $regex: escapedSearch, $options: "i" } },
    ];
  }

  let sortOption = {
    isPinned: -1,
    updatedAt: -1,
    _id: 1,
  };

  if (sortBy === "title") {
    sortOption = { title: 1, _id: 1 };
  } else if (sortBy === "createdAt") {
    sortOption = { createdAt: -1, _id: 1 };
  } else if (sortBy !== "default") {
    throw new Error("Invalid habit sort option");
  }

  const skip = (page - 1) * limit;

  const [habits, totalHabits] = await Promise.all([
    Habit.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean(),

    Habit.countDocuments(query),
  ]);

  const today = getTodayUTC();
  const todayKey = dateKey(today);

  // Today's statistics use all active habits, not just this page.
  const activeHabits = await Habit.find({
    user: userId,
    isArchived: false,
  }).lean();

  const scheduledToday = activeHabits.filter((habit) =>
    isScheduledOnDate(habit, today)
  );

  const scheduledHabitIds = scheduledToday.map((habit) => habit._id);

  const todayCompletionRecords = scheduledHabitIds.length
    ? await HabitCompletion.find({
        user: userId,
        habit: { $in: scheduledHabitIds },
        date: today,
      }).lean()
    : [];
  const todayCompletions = Object.fromEntries(
    todayCompletionRecords.map((completion) => [
      String(completion.habit),
      completion,
    ]),
  );
  const completedToday = Object.keys(todayCompletions).length;

  const totalPages = Math.ceil(totalHabits / limit);

  return {
    habits,
    todayCompletions,
    pagination: {
      totalHabits,
      currentPage: page,
      totalPages,
      pageSize: limit,
    },
    stats: {
      totalActiveHabits: activeHabits.length,
      scheduledToday: scheduledToday.length,
      completedToday,
      remainingToday: Math.max(
        scheduledToday.length - completedToday,
        0
      ),
      completionPercentage: scheduledToday.length
        ? Math.round((completedToday / scheduledToday.length) * 100)
        : 0,
      date: todayKey,
    },
  };
};

// Get Single Habit Service

const getHabitService = async ({ habitId, userId }) => {
  validateUser(userId);
  validateHabitId(habitId);

  const habit = await Habit.findOne({
    _id: habitId,
    user: userId,
  }).lean();

  if (!habit) {
    throw new Error("Habit not found");
  }

  return habit;
};

// Edit Habit Service

const editHabitService = async ({
  habitId,
  userId,
  title,
  description,
  frequency,
  daysOfWeek,
  targetValue,
  unit,
  category,
  priority,
  isPinned,
  startDate,
}) => {
  validateUser(userId);
  validateHabitId(habitId);

  const habit = await Habit.findOne({
    _id: habitId,
    user: userId,
  });

  if (!habit) {
    throw new Error("Habit not found");
  }

  const updates = {};

  if (title !== undefined) {
    if (typeof title !== "string" || !title.trim()) {
      throw new Error("Habit title cannot be empty");
    }

    if (title.trim().length < 3 || title.trim().length > 200) {
      throw new Error("Habit title must be between 3 and 200 characters");
    }

    updates.title = title.trim();
  }

  if (description !== undefined) {
    if (typeof description !== "string" || description.length > 1000) {
      throw new Error("Description cannot exceed 1000 characters");
    }

    updates.description = description.trim();
  }

  if (category !== undefined) {
    if (!["health", "career", "learning", "finance", "personal"].includes(category)) {
      throw new Error("Invalid habit category");
    }

    updates.category = category;
  }

  if (priority !== undefined) {
    if (!["low", "medium", "high"].includes(priority)) {
      throw new Error("Priority must be low, medium, or high");
    }

    updates.priority = priority;
  }

  if (isPinned !== undefined) {
    if (typeof isPinned !== "boolean") {
      throw new Error("isPinned must be a boolean");
    }

    updates.isPinned = isPinned;
  }

  if (startDate !== undefined) {
    const normalizedStartDate = normalizeDate(startDate);

    if (!normalizedStartDate) {
      throw new Error("Start date must be a valid date");
    }

    if (normalizedStartDate > getTodayUTC()) {
      throw new Error("Start date cannot be in the future");
    }

    updates.startDate = normalizedStartDate;
  }

  // Validate the resulting schedule, not only fields sent by the client.
  const nextFrequency = frequency !== undefined
    ? frequency
    : habit.frequency;

  const nextDaysOfWeek = daysOfWeek !== undefined
    ? daysOfWeek
    : habit.daysOfWeek;

  if (frequency !== undefined || daysOfWeek !== undefined) {
    validateFrequency(nextFrequency, nextDaysOfWeek);

    updates.frequency = nextFrequency;
    updates.daysOfWeek = nextDaysOfWeek;
  }

  const nextTargetValue = targetValue !== undefined
    ? targetValue
    : habit.targetValue;

  const nextUnit = unit !== undefined ? unit : habit.unit;

  if (targetValue !== undefined || unit !== undefined) {
    validateTarget(nextTargetValue, nextUnit);

    if (
      nextUnit !== undefined &&
      (typeof nextUnit !== "string" || nextUnit.length > 50)
    ) {
      throw new Error("Unit cannot exceed 50 characters");
    }

    updates.targetValue =
      nextTargetValue === null || nextTargetValue === ""
        ? null
        : Number(nextTargetValue);

    updates.unit = nextTargetValue === null || nextTargetValue === ""
      ? ""
      : String(nextUnit || "").trim();
  }

  if (Object.keys(updates).length === 0) {
    throw new Error("No valid fields provided for update");
  }

  Object.assign(habit, updates);

  await habit.save();

  return habit;
};

// Archive / Unarchive Habit Service

const archiveHabitService = async ({ habitId, userId, isArchived = true }) => {
  validateUser(userId);
  validateHabitId(habitId);

  if (typeof isArchived !== "boolean") {
    throw new Error("isArchived must be a boolean");
  }

  const habit = await Habit.findOne({
    _id: habitId,
    user: userId,
  });

  if (!habit) {
    throw new Error("Habit not found");
  }

  habit.isArchived = isArchived;

  await habit.save();

  return habit;
};

// Permanently Delete Habit Service

const deleteHabitService = async ({ habitId, userId }) => {
  validateUser(userId);
  validateHabitId(habitId);

  const session = await mongoose.startSession();

  try {
    let deletedHabit = null;

    await session.withTransaction(async () => {
      deletedHabit = await Habit.findOneAndDelete({
        _id: habitId,
        user: userId,
      }).session(session);

      if (!deletedHabit) {
        throw new Error("Habit not found");
      }

      await HabitCompletion.deleteMany(
        {
          habit: deletedHabit._id,
          user: userId,
        },
        { session }
      );
    });

    return {
      message: "Habit and its completion history deleted successfully",
      habit: deletedHabit,
    };
  } finally {
    await session.endSession();
  }
};

// Add Habit Completion Service

const addHabitCompletionService = async ({
  habitId,
  userId,
  date,
  value,
  note,
}) => {
  validateUser(userId);
  validateHabitId(habitId);

  const completionDate = normalizeDate(date);

  if (!completionDate) {
    throw new Error("Completion date must be a valid date");
  }

  const today = getTodayUTC();

  if (completionDate > today) {
    throw new Error("Cannot complete a habit for a future date");
  }

  const habit = await Habit.findOne({
    _id: habitId,
    user: userId,
  });

  if (!habit) {
    throw new Error("Habit not found");
  }

  if (habit.isArchived) {
    throw new Error("Cannot complete an archived habit");
  }

  if (!isScheduledOnDate(habit, completionDate)) {
    throw new Error("This habit is not scheduled for the selected date");
  }

  if (value !== undefined && value !== null) {
    if (!Number.isFinite(Number(value)) || Number(value) <= 0) {
      throw new Error("Completion value must be greater than zero");
    }
  }

  if (note !== undefined && (typeof note !== "string" || note.length > 500)) {
    throw new Error("Completion note cannot exceed 500 characters");
  }

  // If the habit has a target, a supplied value cannot exceed it.
  if (
    value !== undefined &&
    value !== null &&
    habit.targetValue !== null &&
    habit.targetValue !== undefined &&
    Number(value) > habit.targetValue
  ) {
    throw new Error("Completion value cannot exceed the habit target");
  }

  const completionQuery = {
    habit: habit._id,
    user: userId,
    date: completionDate,
  };

  // Treat repeat clicks/retries as success. The unique index below still
  // protects against two requests arriving at the same time.
  const existingCompletion = await HabitCompletion.findOne(completionQuery);
  if (existingCompletion) {
    return { completion: existingCompletion, alreadyCompleted: true };
  }

  try {
    const [completion] = await HabitCompletion.create([{
      habit: habit._id,
      user: userId,
      date: completionDate,
      ...(value !== undefined && value !== null
        ? { value: Number(value) }
        : {}),
      ...(note !== undefined ? { note: note.trim() } : {}),
    }]);
    return { completion, alreadyCompleted: false };
  } catch (error) {
    // Another request may have created this day's record after our lookup.
    if (error?.code === 11000) {
      const racedCompletion = await HabitCompletion.findOne(completionQuery);
      if (racedCompletion) {
        return { completion: racedCompletion, alreadyCompleted: true };
      }
    }
    throw error;
  }
};

// Undo Habit Completion Service

const undoHabitCompletionService = async ({
  completionId,
  userId,
}) => {
  validateUser(userId);

  if (!completionId || !isValidObjectId(completionId)) {
    throw new Error("Invalid habit completion ID");
  }

  const completion = await HabitCompletion.findOneAndDelete({
    _id: completionId,
    user: userId,
  });

  if (!completion) {
    throw new Error("Habit completion not found");
  }

  return {
    message: "Habit completion removed successfully",
    completion,
  };
};

// Get Habit History Service

const getHabitHistoryService = async ({
  habitId,
  userId,
  startDate,
  endDate,
  page = 1,
  limit = 30,
}) => {
  validateUser(userId);
  validateHabitId(habitId);

  const habit = await Habit.findOne({
    _id: habitId,
    user: userId,
  }).select("_id title startDate frequency daysOfWeek");

  if (!habit) {
    throw new Error("Habit not found");
  }

  page = Number(page);
  limit = Number(limit);

  if (!Number.isInteger(page) || page < 1) page = 1;
  if (!Number.isInteger(limit) || limit < 1) limit = 30;

  limit = Math.min(limit, 100);

  const query = {
    habit: habitId,
    user: userId,
  };

  if (startDate) {
    const normalizedStart = normalizeDate(startDate);

    if (!normalizedStart) {
      throw new Error("Start date must be a valid date");
    }

    query.date = { ...query.date, $gte: normalizedStart };
  }

  if (endDate) {
    const normalizedEnd = normalizeDate(endDate);

    if (!normalizedEnd) {
      throw new Error("End date must be a valid date");
    }

    query.date = { ...query.date, $lte: normalizedEnd };
  }

  if (
    query.date?.$gte &&
    query.date?.$lte &&
    query.date.$gte > query.date.$lte
  ) {
    throw new Error("Start date cannot be after end date");
  }

  const skip = (page - 1) * limit;

  const [completions, totalCompletions] = await Promise.all([
    HabitCompletion.find(query)
      .sort({ date: -1, _id: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    HabitCompletion.countDocuments(query),
  ]);

  return {
    habit,
    completions,
    pagination: {
      totalCompletions,
      currentPage: page,
      totalPages: Math.ceil(totalCompletions / limit),
      pageSize: limit,
    },
  };
};

// Calculate Current Streak Service

const getHabitStreakService = async ({ habitId, userId }) => {
  validateUser(userId);
  validateHabitId(habitId);

  const habit = await Habit.findOne({
    _id: habitId,
    user: userId,
  }).lean();

  if (!habit) {
    throw new Error("Habit not found");
  }

  const today = getTodayUTC();
  const startDate = normalizeDate(habit.startDate);

  const completions = await HabitCompletion.find({
    habit: habitId,
    user: userId,
    date: { $lte: today },
  })
    .select("date")
    .lean();

  const completedDates = new Set(
    completions.map((completion) => dateKey(normalizeDate(completion.date)))
  );

  let currentStreak = 0;
  let cursor = today;

  // If the habit is scheduled today and not completed yet,
  // yesterday's streak can still be current.
  if (
    isScheduledOnDate(habit, today) &&
    !completedDates.has(dateKey(today))
  ) {
    cursor = addDaysUTC(today, -1);
  }

  while (cursor >= startDate) {
    if (!isScheduledOnDate(habit, cursor)) {
      cursor = addDaysUTC(cursor, -1);
      continue;
    }

    if (!completedDates.has(dateKey(cursor))) {
      break;
    }

    currentStreak++;
    cursor = addDaysUTC(cursor, -1);
  }

  return {
    habitId: habit._id,
    currentStreak,
  };
};

// Exports

module.exports = {
  createHabitService,
  getAllHabitsService,
  getHabitService,
  editHabitService,
  archiveHabitService,
  deleteHabitService,
  addHabitCompletionService,
  undoHabitCompletionService,
  getHabitHistoryService,
  getHabitStreakService,
};
