import "reflect-metadata";
import {
  CONTROL,
  RestfulMethodType,
  RESTFUL,
  AUTOWIRED,
  MIDDLEWARE,
  CONFIG,
  PLUGIN,
} from "./Constants";
import {
  Inject,
  _Config,
  _Controller,
  _Middleware,
  _Service,
  _Plugin,
} from "./Inject";
import {
  getRestfulMap,
  getRestfulParameterMap,
  getFunctionParams,
} from "../utils/Common";

export const Service = (target: Function | any) => {
  if (!_Service.has(target)) {
    Inject(target);
    _Service.add(target);
  }
};

export function Controller(path?: string) {
  return (target: Function | any) => {
    Reflect.defineMetadata(CONTROL, path ? path : "", target);
    if (!_Controller.has(target)) {
      Inject(target);
      _Controller.add(target);
    }
  };
}

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

export function Plugin(pluginKey?: string) {
  return (target: Function | any) => {   
    Reflect.defineMetadata(PLUGIN, pluginKey ? pluginKey : target.name, target);
    _Plugin.add(target);
  };
}

export function Autowired(target: any, propKey: string) {
  const _constructor = Reflect.getMetadata("design:type", target, propKey);
  Reflect.defineMetadata(
    `${AUTOWIRED}@@${propKey}`,
    _constructor,
    target.constructor
  );
}

export function Middleware() {
  return (target: Function | any) => {
    const middlewareInstance = new target();
    if (middlewareInstance.run) {
      const initMethod = middlewareInstance.run;
      Reflect.defineMetadata(MIDDLEWARE, initMethod, target);
      if (!_Middleware.has(target)) {
        Inject(target);
        _Middleware.add(target);
      }
    } else {
      throw new Error(
        `${target.name} middleware must has a 'run' method! please check it`
      );
    }
  };
}

export function Get(path: string) {
  return handleRequest("get", path);
}
export function Post(path: string) {
  return handleRequest("post", path);
}

export function Put(path: string) {
  return handleRequest("put", path);
}

export function Delete(path: string) {
  return handleRequest("delete", path);
}

export function Patch(path: string) {
  return handleRequest("patch", path);
}

export function All(path: string) {
  return handleRequest("all", path);
}

export function Options(path: string) {
  return handleRequest("options", path);
}

function handleRequest(reqType: RestfulMethodType, path: string) {
  return function(
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    /**
     * bind RESTFUL to instance
     * key    --> method
     * value  --> Map
     *                key   --> path
     *                value --> string
     */

    const restfulMap = getRestfulMap(`${RESTFUL}`, target);
    const method = target[propertyKey];

    const methodMap = getRestfulParameterMap(method, restfulMap);

    methodMap.set("path", path);
    methodMap.set("methodType", reqType);
    methodMap.set("args", getFunctionParams(method));

    if (!restfulMap.has(method)) {
      restfulMap.set(method, methodMap);
    }
    Reflect.defineMetadata(RESTFUL, restfulMap, target);
  };
}
