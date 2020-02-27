import "reflect-metadata";
import { RESTFUL, MIDDLEWARE } from "./constants";
import {
  getRestfulMap,
  getRestfulParameterMap,
  getRestfulParameterSet,
} from "../utils";
import { RequestBodySymbol, RequestContextSymbol } from "../utils/interface";

function CheckAndSetParameters(
  paramterName: string | Symbol,
  parameterType: string
) {
  return (
    target: any,
    propertyKey: string | symbol,
    parameterIndex: number
  ) => {
    /**
     * bind RESTFUL to instance
     * key    --> method
     * value  --> Map
     *                key   --> parameters
     *                value --> set
     */
    const restfulMap = getRestfulMap(`${RESTFUL}`, target);
    // 获取当前方法名
    const method = target[propertyKey];

    const methodMap = getRestfulParameterMap(method, restfulMap);

    const parametersSet = getRestfulParameterSet(methodMap, parameterType);

    parametersSet.add(paramterName);

    methodMap.set(parameterType, parametersSet);

    if (!restfulMap.has(method)) {
      restfulMap.set(method, methodMap);
    }
    Reflect.defineMetadata(RESTFUL, restfulMap, target);
  };
}

/**
 * set router middleware
 * @param middleware middleware function
 */
export function RouteMiddleware(middleware: Function | Function[]) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const restfulMap = getRestfulMap(`${RESTFUL}`, target);
    const method = target[propertyKey];
    const methodMap = getRestfulParameterMap(method, restfulMap);
    let middleWareSet = methodMap.get(MIDDLEWARE) as Set<any>;
    if (!middleWareSet) {
      middleWareSet = new Set();
    }
    Array.isArray(middleware)
      ? middleware.forEach(item => {
          middleWareSet.add(item);
        })
      : middleWareSet.add(middleware);
    methodMap.set(MIDDLEWARE, middleWareSet);

    if (!restfulMap.has(method)) {
      restfulMap.set(method, methodMap);
    }
    Reflect.defineMetadata(RESTFUL, restfulMap, target);
  };
}

/**
 * get ctx.request.query
 * @param paramterName string
 */
export function RequestQuery(paramterName: string) {
  return CheckAndSetParameters(paramterName, "query");
}

/**
 * get ctx.request.params
 * @param paramterName string
 */
export function RequestParams(paramterName: string) {
  return CheckAndSetParameters(paramterName, "params");
}

/**
 * get ctx.request.body
 */
export function Body() {
  return CheckAndSetParameters(RequestBodySymbol, "body");
}

/**
 * get ctx.request.body[paramterName]
 * @param paramterName string
 */
export function RequestBody(paramterName: string) {
  return CheckAndSetParameters(paramterName, "RequestBody");
}

/**
 * get ctx
 */
export function RequestContext() {
  return CheckAndSetParameters(RequestContextSymbol, "RequestContext");
}

/**
 * get headers[paramterName]
 * @param paramterName string
 */
export function RequestHeader(paramterName: string) {
  return CheckAndSetParameters(paramterName, "headers");
}
