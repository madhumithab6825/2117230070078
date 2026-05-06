// Logging Middleware — all logs must go through this module
const LEVELS = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 };
const CURRENT_LEVEL = LEVELS.DEBUG;

const format = (level, context, message, meta) => ({
  level,
  context,
  message,
  meta: meta ?? null,
  timestamp: new Date().toISOString(),
});

const shouldLog = (level) => LEVELS[level] >= CURRENT_LEVEL;

const log = (level, context, message, meta) => {
  if (!shouldLog(level)) return;
  const entry = format(level, context, message, meta);
  const output = `[${entry.timestamp}] [${level}] [${context}] ${message}`;
  if (level === "ERROR") console.error(output, meta ?? "");
  else if (level === "WARN") console.warn(output, meta ?? "");
  else console.info(output, meta ?? "");
};

const Logger = {
  debug: (ctx, msg, meta) => log("DEBUG", ctx, msg, meta),
  info: (ctx, msg, meta) => log("INFO", ctx, msg, meta),
  warn: (ctx, msg, meta) => log("WARN", ctx, msg, meta),
  error: (ctx, msg, meta) => log("ERROR", ctx, msg, meta),
};

export default Logger;
