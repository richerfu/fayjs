export class FayError extends Error {
  public errors: any[];

  public constructor(message = "Catch Framework Error", errors: any[] = []) {
    super(message);
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class FileLoaderError extends FayError {
  public errors: any[];
  public message: string;

  public constructor(message = "File Loader Error", errors: any[] = []) {
    super(message);
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}
