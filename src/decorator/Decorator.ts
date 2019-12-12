import "reflect-metadata";
import SoServer from "../core";
import {
  CONTROL,
  RestfulMethodType,
  RESTFUL,
  AUTOWIRED,
  MIDDLEWARE,
  CONFIG
} from "./Constants";
import { inject } from "./Inject";
import {
  getRestfulMap,
  getRestfulParameterMap,
  getFunctionParams
} from "../utils/Common";

export const Service = (target: Function | any) => {
  if (!SoServer._Service.has(target)) {
    inject(target);
    SoServer._Service.add(target);
  }
};

export function Controller(path: string) {
  return (target: Function | any) => {
    // const targetName = target.name;
    if (path) {
      Reflect.defineMetadata(CONTROL, path, target);

      if (!SoServer._Controller.has(target)) {
        inject(target);
        SoServer._Controller.add(target);
      }
    } else {
      throw new Error(`Controller can't omit the path field.`);
    }
  };
}

export function Config(env: string) {
  return (target: Function | any) => {
    if (env) {
      Reflect.defineMetadata(CONFIG, env, target);
      if (!SoServer._Config.has(target)) {
        inject(target);
        SoServer._Config.add(target);
      }
    } else {
      throw new Error(
        `Config must has 'env' field to distinguish the environment`
      );
    }
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
      if (!SoServer._Middleware.has(target)) {
        inject(target);
        SoServer._Middleware.add(target);
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
    methodMap.set(
      "args",
      getFunctionParams(method).filter(arg => !["ctx", "next"].includes(arg))
    );

    if (!restfulMap.has(method)) {
      restfulMap.set(method, methodMap);
    }
    // define or overwrite RESTFUL map
    Reflect.defineMetadata(RESTFUL, restfulMap, target);
  };
}
