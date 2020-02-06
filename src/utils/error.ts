export class LoadError extends Error {
  constructor(message: string | any) {
    super();
    this.message = message;
    this.name = "LoadError";
  }
}
