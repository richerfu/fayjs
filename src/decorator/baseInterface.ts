import * as Koa from "koa";
import { Request } from "koa";
import { Files } from "formidable";
import { Curl } from "../plugins/curl";

class BaseFayContext {
  curl: Curl;
}

interface FayRequest extends Request {
  body?: any;
  files?: Files;
}

interface FayContext extends Koa.Context {
  request: FayRequest;
}

/**
 * middleware interface
 * use middleware must implements interface
 */
export interface BaseMiddleware {
  ctx: Koa.Context;
  next: Koa.Next;
  config: any;
  resolve(): Promise<void> | void;
}

/**
 * plugin interface
 * use plugin must implements interface
 */
export interface BasePlugin {
  app: any;
  config: any;
  start: () => void;
}

/**
 * app start base options
 */
export interface Options {
  baseDir: string;
}

/**
 * base controller can be extends
 */
export class BaseController extends BaseFayContext {
  ctx: FayContext;
  next: Koa.Next;
}

/**
 * base service can be extends
 */
export class BaseService extends BaseFayContext {}
