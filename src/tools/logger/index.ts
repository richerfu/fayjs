class Log {
  public log(msg: string): void {
    console.log(`[${new Date()}] [LOG] - ${msg}`);
  }
  public info(msg: string): void {
    console.log("\x1b[32m%s\x1b[0m", `[${new Date()}] [INFO] - ${msg}`);
  }
  public warn(msg: string): void {
    console.log("\x1b[33m%s\x1b[0m", `[${new Date()}] [WARN] - ${msg}`);
  }
  public debug(msg: string): void {
    console.log("\x1b[34m%s\x1b[0m", `[${new Date()}] [DEBUG] - ${msg}`);
  }
  public error(msg: string): void {
    console.log("\x1b[31m%s\x1b[0m", `[${new Date()}] [ERROR] - ${msg}`);
  }
}

export const Logger = new Log();
