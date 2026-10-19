import toast from "react-hot-toast";

const genericErrorPattern =
  /^(failed to|unable to|could not|cannot|request failed|internal server error)|\b(stack trace|mongodb|mongoose|cast to|e11000|validationerror|undefined is not|cannot read propert(y|ies))\b/i;

const humanizeGenericError = (message, fallback) => {
  const operation = message.match(/^(?:failed to|unable to)\s+(\w+)\s+(.+?)[.!]?$/i);
  if (!operation) return fallback;

  const [, rawVerb, rawSubject] = operation;
  const verbs = {
    fetch: "load",
    get: "load",
    create: "add",
    toggle: "update",
    unarchive: "restore",
  };
  const verb = verbs[rawVerb.toLowerCase()] || rawVerb.toLowerCase();
  const subjects = {
    todo: "task",
    todos: "tasks",
  };
  const subject = rawSubject
    .replace(/\b(todos?)\b/gi, (word) => subjects[word.toLowerCase()])
    .replace(/\buser\b/gi, "account details");

  return `We couldn’t ${verb} your ${subject}. Please try again.`;
};

/** Show actionable errors without leaking implementation details into toasts. */
export const toastError = (error, fallback = "We couldn’t complete that action. Please try again.") => {
  const message = typeof error === "string" ? error : error?.message;
  const cleanMessage = message?.trim();

  if (!cleanMessage) {
    toast.error(fallback);
    return;
  }

  if (/not authenticated|no token provided|session expired/i.test(cleanMessage)) {
    toast.error("Please sign in again to continue.");
    return;
  }

  toast.error(
    genericErrorPattern.test(cleanMessage)
      ? humanizeGenericError(cleanMessage, fallback)
      : cleanMessage,
  );
};
