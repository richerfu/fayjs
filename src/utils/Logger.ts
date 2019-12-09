class Logger {
  public log(msg: string): void {
    console.log(`${msg}`)
  }
}

export default new Logger()