export const CONTROL = "@@CONTROL";
export const control_reg = new RegExp(`^${CONTROL}`);
export const SERVICE = "@@SERVICE";
export const AUTOWIRED = "@@AUTOWIRED";
export const autowired_reg = new RegExp(`^${AUTOWIRED}@@`);
export const Provide = "@@PROVIDED";
export const provide_reg = new RegExp(`^${Provide}@@`);
export const Injects = "@@INJECTED";
export const injects_reg = new RegExp(`^${Injects}@@`);
export const RESTFUL = "@@RESTFUL";
export const restful_reg = new RegExp(`^${RESTFUL}`);
export const MIDDLEWARE = "@@MIDDLEWARE";
export const middleWare_reg = new RegExp(`^${MIDDLEWARE}`);
export const WEBSOCKET = "@@WEBSOCKET";
export const websocket_reg = new RegExp(`^${WEBSOCKET}`);
export const ERROR = "@@ERROR";
export const error_reg = new RegExp(`^${ERROR}`);
export const CONFIG = "@@CONFIG";
export const config_reg = new RegExp(`^${CONFIG}`);
export const PLUGIN = "@@PLUGIN";
export const plugin_reg = new RegExp(`^${PLUGIN}`);

export type RestfulMethodType =
  | "options"
  | "get"
  | "post"
  | "put"
  | "patch"
  | "delete"
  | "all";

export const Name = {
  controller: "SoController",
  service: "SoService",
  middleware: "SoMiddleware",
};

export const Plugins = ["curl", "db"];
