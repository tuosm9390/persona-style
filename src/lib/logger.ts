import * as Sentry from "@sentry/nextjs";

export type LogLevel = "info" | "warn" | "error" | "debug";

export interface LogContext {
  [key: string]: unknown;
}

/**
 * 프로젝트 전반에서 사용되는 표준 로거입니다.
 * Sentry 연동 및 환경별 로그 출력을 관리합니다.
 */
export const logger = {
  info: (message: string, context?: LogContext) => {
    console.log(`[INFO] ${message}`, context || "");
  },
  
  warn: (message: string, context?: LogContext) => {
    console.warn(`[WARN] ${message}`, context || "");
    Sentry.captureMessage(message, {
      level: "warning",
      extra: context,
    });
  },
  
  error: (message: string, error?: unknown, context?: LogContext) => {
    const errorInstance = error instanceof Error ? error : new Error(String(error || message));
    console.error(`[ERROR] ${message}`, errorInstance, context || "");
    Sentry.captureException(errorInstance, {
      extra: { message, ...context },
    });
  },
  
  debug: (message: string, context?: LogContext) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`[DEBUG] ${message}`, context || "");
    }
  },
};
