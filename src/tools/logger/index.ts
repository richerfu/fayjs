class Log {
  public log(msg: string): void {
    console.log(`${msg}`);
  }
  public info(msg: string): void {
    console.log("\x1b[32m%s\x1b[0m", msg);
  }
  public warn(msg: string): void {
    console.log("\x1b[33m%s\x1b[0m", msg);
  }
  public debug(msg: string): void {
    console.log("\x1b[34m%s\x1b[0m", msg);
  }
  public error(msg: string): void {
    console.log("\x1b[31m%s\x1b[0m", msg);
  }
}

export const Logger = new Log();

