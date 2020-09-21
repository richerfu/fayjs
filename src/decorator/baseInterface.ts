import * as Koa from "koa";
import { Request } from "koa";
import { Files } from "formidable";
import Fay from "../core";

interface FayRequest extends Request {
  body?: any;
  files?: Files;
}

export interface FContext extends Koa.Context {
  request: FayRequest;
}

/**
 * middleware interface
 * use middleware must implements interface
 */
export interface FMiddleware {
  ctx: FContext;
  next: Koa.Next;
  resolve(): Promise<void> | void;
}

/**
 * plugin interface
 * use plugin must implements interface
 */
export interface FPlugin {
  app: Fay;
  start: () => void;
}

/**
 * app start base options
 */
export interface Options {
  baseDir: string;
}
