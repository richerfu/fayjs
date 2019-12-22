import * as Koa from "koa";
import { Request } from "koa";
import { Files } from "formidable";
import { Server } from "socket.io";

export interface Options {
  baseDir: string;
}

export interface Config {
  baseDir: string;
  [propName: string]: any;
}

export interface SoRequest extends Request {
  body?: any;
  files?: Files;
}

export interface SoContext extends Koa.Context {
  request: SoRequest;
}

export const RequestBodySymbol = Symbol("RequestBody");
export const RequestContextSymbol = Symbol("RequestContext");
