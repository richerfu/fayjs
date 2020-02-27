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

export function RouteMiddleware(middleware: Function) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const restfulMap = getRestfulMap(`${RESTFUL}`, target);
    const method = target[propertyKey];
    const methodMap = getRestfulParameterMap(method, restfulMap);
    let middleWareSet = methodMap.get(MIDDLEWARE) as Set<any>;
    if (!middleWareSet) {
      middleWareSet = new Set();
    }
    middleWareSet.add(middleware);
    methodMap.set(MIDDLEWARE, middleWareSet);

    if (!restfulMap.has(method)) {
      restfulMap.set(method, methodMap);
    }
    Reflect.defineMetadata(RESTFUL, restfulMap, target);
  };
}

export function RequestQuery(paramterName: string) {
  return CheckAndSetParameters(paramterName, "query");
}

export function RequestParams(paramterName: string) {
  return CheckAndSetParameters(paramterName, "params");
}

export function Body() {
  return CheckAndSetParameters(RequestBodySymbol, "body");
}

export function RequestBody(paramterName: string) {
  return CheckAndSetParameters(paramterName, "RequestBody");
}

export function RequestContext() {
  return CheckAndSetParameters(RequestContextSymbol, "RequestContext");
}

export function RequestHeader(paramterName: string) {
  return CheckAndSetParameters(paramterName, "headers");
}
