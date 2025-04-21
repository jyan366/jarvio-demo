
export function isAwaitingUserConfirmation(messages: { isUser: boolean; text: string }[]) {
  const last = messages[messages.length - 1];
  if (!last || last.isUser) return false;
  const txt = last.text.toLowerCase();
  return (
    txt.includes("please confirm") ||
    txt.includes("confirm") ||
    txt.includes("let me know") ||
    txt.includes("user work log") ||
    txt.includes("your confirmation") ||
    txt.includes("once you confirm") ||
    txt.includes("did you") ||
    txt.includes("tell me") ||
    txt.includes("waiting") ||
    txt.includes("waiting for your confirmation")
  );
}

export function isUserConfirmationMessage(text: string) {
  const lower = text.toLowerCase().trim();
  return (
    ["confirmed", "done", "completed", "yes", "ok", "approved", "i did", "finished", "accepted"].some(keyword =>
      lower.startsWith(keyword)
    ) ||
    lower === "y"
  );
}
