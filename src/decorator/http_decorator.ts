import "reflect-metadata";
import { RestfulMethodType, RESTFUL } from "./constants";
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
