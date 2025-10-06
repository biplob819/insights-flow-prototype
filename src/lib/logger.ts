type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
  error?: Error;
}

class Logger {
  private logLevel: LogLevel;
  private isDevelopment: boolean;

  constructor() {
    this.logLevel = (process.env.LOG_LEVEL as LogLevel) || 'info';
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
    };
    return levels[level] >= levels[this.logLevel];
  }

  private formatLog(entry: LogEntry): string {
    const { level, message, timestamp, context, error } = entry;
    
    if (this.isDevelopment) {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}${
        context ? ` ${JSON.stringify(context)}` : ''
      }${error ? `\n${error.stack}` : ''}`;
    }

    return JSON.stringify({
      level,
      message,
      timestamp,
      context,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } : undefined,
    });
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error): void {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error,
    };

    const formattedLog = this.formatLog(entry);

    switch (level) {
      case 'debug':
        console.debug(formattedLog);
        break;
      case 'info':
        console.info(formattedLog);
        break;
      case 'warn':
        console.warn(formattedLog);
        break;
      case 'error':
        console.error(formattedLog);
        break;
    }
  }

  debug(message: string, context?: Record<string, any>): void {
    this.log('debug', message, context);
  }

  info(message: string, context?: Record<string, any>): void {
    this.log('info', message, context);
  }

  warn(message: string, context?: Record<string, any>): void {
    this.log('warn', message, context);
  }

  error(message: string, error?: Error, context?: Record<string, any>): void {
    this.log('error', message, context, error);
  }
}

export const logger = new Logger();

// Error boundary helper
export function logError(error: Error, context?: Record<string, any>): void {
  logger.error('Application error occurred', error, context);
}

// Performance monitoring helper
export function logPerformance(operation: string, duration: number, context?: Record<string, any>): void {
  logger.info(`Performance: ${operation} took ${duration}ms`, context);
}

// API request helper
export function logApiRequest(method: string, url: string, status?: number, duration?: number): void {
  const context = {
    method,
    url,
    status,
    duration,
  };
  
  if (status && status >= 400) {
    logger.error(`API request failed: ${method} ${url}`, undefined, context);
  } else {
    logger.info(`API request: ${method} ${url}`, context);
  }
}
