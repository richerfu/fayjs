import * as Koa from "koa";

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
  start:() => void;
}


/**
 * app start base options
 */
export interface Options {
  baseDir: string
}