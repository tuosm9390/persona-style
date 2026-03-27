import * as Sentry from "@sentry/nextjs";

export type LogLevel = "info" | "warn" | "error" | "debug";

export const logger = {
  info: (message: string, context?: any) => {
    console.log(`[INFO] ${message}`, context || "");
  },
  
  warn: (message: string, context?: any) => {
    console.warn(`[WARN] ${message}`, context || "");
    Sentry.captureMessage(message, {
      level: "warning",
      extra: context,
    });
  },
  
  error: (message: string, error?: any, context?: any) => {
    console.error(`[ERROR] ${message}`, error || "");
    Sentry.captureException(error || new Error(message), {
      extra: { message, ...context },
    });
  },
  
  debug: (message: string, context?: any) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`[DEBUG] ${message}`, context || "");
    }
  },
};
