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
  public success(msg: string): void {
    console.log(
      "\x1B[1m\x1B[36m%s\x1B[39m\x1B[22m",
      `[${new Date().toISOString()}] [SUCCESS] - ${msg}`
    );
  }
}

export const Logger = new Log();
