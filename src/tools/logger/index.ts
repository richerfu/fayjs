class Log {
  public log(msg: string): void {
    console.log(`[${new Date().toISOString()}] [LOG] - ${msg}`);
  }
  public info(msg: string): void {
    console.log(
      "\x1b[32m%s\x1b[0m",
      `[${new Date().toISOString()}] [INFO] - ${msg}`
    );
  }
  public warn(msg: string): void {
    console.log(
      "\x1b[33m%s\x1b[0m",
      `[${new Date().toISOString()}] [WARN] - ${msg}`
    );
  }
  public debug(msg: string): void {
    console.log(
      "\x1b[34m%s\x1b[0m",
      `[${new Date().toISOString()}] [DEBUG] - ${msg}`
    );
  }
  public error(msg: string): void {
    console.log(
      "\x1b[31m%s\x1b[0m",
      `[${new Date().toISOString()}] [ERROR] - ${msg}`
    );
  }
}

export const Logger = new Log();
