import "reflect-metadata";
import {
  CONTROL,
  RestfulMethodType,
  RESTFUL,
  AUTOWIRED,
  MIDDLEWARE,
  CONFIG,
  PLUGIN,
  ORDER,
  Plugins,
} from "./constants";
import {
  Inject,
  _Config,
  _Controller,
  _Middleware,
  _Service,
  _Plugin,
} from "./inject";
import {
  getRestfulMap,
  getRestfulParameterMap,
  getFunctionParameterName,
} from "../utils";
import { LoadError } from "../utils/error";

/**
 * register Service
 * @param target Function | any
 */
export const Service = (target: Function | any) => {
  if (!_Service.has(target)) {
    Inject(target);
    _Service.add(target);
  }
};

/**
 * register controller
 * default path is "/"
 * @param path string
 */
export function Controller(path?: string) {
  return (target: Function | any) => {
    Reflect.defineMetadata(CONTROL, path ? path : "/", target);
    if (!_Controller.has(target)) {
      Inject(target);
      _Controller.add(target);
    }
  };
}

/**
 * register config
 * app default env is "dev"
 * @param env string
 */
export function Config(env: string) {
  return (target: Function | any) => {
    if (env) {
      Reflect.defineMetadata(CONFIG, env, target);
      if (!_Config.has(target)) {
        Inject(target);
        _Config.add(target);
      }
    } else {
      throw new Error(
        `Config must has 'env' field to distinguish the environment`
      );
    }
  };
}

/**
 * register plugin
 * plugin default name is plugin instance name
 * @param pluginKey string
 */
export function Plugin(pluginKey?: string) {
  return (target: Function | any) => {
    const pluginName = pluginKey ? pluginKey : target.name;
    if (Plugins.indexOf(pluginName) !== -1) {
      throw new LoadError(
        `Load Plugin Error: ${pluginName} is existed.please change key name`
      );
    }
    Reflect.defineMetadata(PLUGIN, pluginName, target);
    Inject(target);
    _Plugin.add(target);
  };
}

/**
 * auto inject
 * @param target
 * @param propKey
 */
export function Autowired(target: any, propKey: string) {
  const _constructor = Reflect.getMetadata("design:type", target, propKey);
  Reflect.defineMetadata(
    `${AUTOWIRED}@@${propKey}`,
    _constructor,
    target.constructor
  );
}

/**
 * register moddleware
 * middleware default order is 1
 * @param order number
 */
export function Middleware(order?: number) {
  return (target: Function | any) => {
    const middlewareInstance = new target();
    if (middlewareInstance.resolve) {
      const initMethod = middlewareInstance.resolve;
      Reflect.defineMetadata(MIDDLEWARE, initMethod, target);
      Reflect.defineMetadata(ORDER, order ? order : 1, target);
      if (!_Middleware.has(target)) {
        Inject(target);
        _Middleware.add(target);
      }
    } else {
      throw new Error(
        `${target.name} middleware must has a 'resolve' method! please check it`
      );
    }
  };
}

/**
 * get restful method
 * @param path string
 */
export function Get(path?: string) {
  return handleRequest("get", path);
}

/**
 * post restful method
 * @param path string
 */
export function Post(path?: string) {
  return handleRequest("post", path);
}

/**
 * put restful method
 * @param path string
 */
export function Put(path?: string) {
  return handleRequest("put", path);
}

/**
 * delete restful method
 * @param path string
 */
export function Delete(path?: string) {
  return handleRequest("delete", path);
}

/**
 * patch restful method
 * @param path string
 */
export function Patch(path?: string) {
  return handleRequest("patch", path);
}

/**
 * all method
 * @param path string
 */
export function All(path?: string) {
  return handleRequest("all", path);
}

/**
 * options method
 * @param path string
 */
export function Options(path?: string) {
  return handleRequest("options", path);
}

function handleRequest(reqType: RestfulMethodType, path: string) {
  return function(
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    const restfulMap = getRestfulMap(`${RESTFUL}`, target);
    const method = target[propertyKey];
    const methodMap = getRestfulParameterMap(method, restfulMap);
    methodMap.set("path", path ? path : "/");
    methodMap.set("methodType", reqType);
    methodMap.set("args", getFunctionParameterName(method));
    if (!restfulMap.has(method)) {
      restfulMap.set(method, methodMap);
    }
    Reflect.defineMetadata(RESTFUL, restfulMap, target);
  };
}
