/**
 * controller
 */
export const CONTROL = "@@CONTROL";
export const control_reg = new RegExp(`^${CONTROL}`);

/**
 * service
 */
export const SERVICE = "@@SERVICE";

/**
 * autowired
 */
export const AUTOWIRED = "@@AUTOWIRED";
export const autowired_reg = new RegExp(`^${AUTOWIRED}@@`);

/**
 * restful
 */
export const RESTFUL = "@@RESTFUL";
export const restful_reg = new RegExp(`^${RESTFUL}`);

/**
 * middleware
 */
export const MIDDLEWARE = "@@MIDDLEWARE";
export const middleWare_reg = new RegExp(`^${MIDDLEWARE}`);

/**
 * config
 */
export const CONFIG = "@@CONFIG";
export const config_reg = new RegExp(`^${CONFIG}`);

/**
 * plugin
 */
export const PLUGIN = "@@PLUGIN";
export const plugin_reg = new RegExp(`^${PLUGIN}`);

/**
 * order
 */
export const ORDER = "@@ORDER";
export const order_reg = new RegExp(`^${ORDER}`);

/**
 * REST METHOD TYPE
 */
export type RestfulMethodType =
  | "options"
  | "get"
  | "post"
  | "put"
  | "patch"
  | "delete"
  | "all";

/**
 * RequestBody Symbol
 */
export const RequestBodySymbol = Symbol("RequestBody");

/**
 * RequestContext Symbol
 */
export const RequestContextSymbol = Symbol("RequestContext");

/**
 * Context Symbol
 */
export const ContextSymbol = Symbol("context");

/**
 * Next Symbol
 */
export const NextSymbol = Symbol("next");

export const Name = {
  controller: "BaseController",
  service: "BaseService",
  middleware: "BaseMiddleware",
};

export const Plugins = ["curl", "db"];

export interface Config {
  baseDir: string;
  [propName: string]: any;
}

export interface Options {
  baseDir: string
}