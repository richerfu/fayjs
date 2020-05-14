import { OutgoingHttpHeaders } from "http";

export class HttpError extends Error {
  public code: number;
  public headers: OutgoingHttpHeaders;
  public errors: any[];

  public constructor(
    code = 500,
    message = "Internal Server Error",
    headers = {},
    errors: any[] = []
  ) {
    super(message);
    this.code = code;
    this.headers = headers;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * NotFoundError
 */
export class NotFoundError extends HttpError {
  public code: number;
  public headers: OutgoingHttpHeaders;
  public errors: any[];

  public constructor(
    code = 404,
    message = "Not Found",
    headers = {},
    errors: any[] = []
  ) {
    super(code, message);
    this.code = code;
    this.headers = headers;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends HttpError {
  public code: number;
  public headers: OutgoingHttpHeaders;
  public errors: any[];

  public constructor(
    code = 400,
    message = "Bad Request",
    headers = {},
    errors: any[] = []
  ) {
    super(code, message);
    this.code = code;
    this.headers = headers;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class AuthorizationError extends HttpError {
  public code: number;
  public headers: OutgoingHttpHeaders;
  public errors: any[];

  public constructor(
    code = 401,
    message = "Authorization Error",
    headers = {},
    errors: any[] = []
  ) {
    super(code, message);
    this.code = code;
    this.headers = headers;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}
