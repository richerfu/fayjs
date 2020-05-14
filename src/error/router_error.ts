import { HttpError } from "./http_error";

/**
 * 路由加载Error
 */
export class RouterLoaderError extends Error {
  public constructor(msg: string) {
    super();
    this.message = msg;
    this.name = "RouterLoaderError";
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 路由匹配错误
 */
export class RouterNotMatch extends HttpError {
  public constructor(msg: string) {
    super(404, msg);
    this.name = "RouterNotMatch";
    Error.captureStackTrace(this, this.constructor);
  }
}
