import { Constructor } from "../typings";
import { fayContainer } from "../container";
import { TYPES } from "../container/type";
import { injectable } from "inversify";
import { AUTOWIRED } from "./constants";

/**
 * register Service
 * @param target Service Class
 */
export const Service = (target: Constructor) => {
  injectable()(target);
  fayContainer
    .bind<Constructor>(TYPES.ServiceType)
    .toConstructor(target)
    .whenTargetNamed(TYPES.ServiceType);
};

/**
 * register controller
 * default path is "/"
 * @param path string
 */
export function Controller(path = "/") {
  return (target: Constructor) => {
    Reflect.defineMetadata(TYPES.ControllerType, path, target);
    injectable()(target);
    fayContainer
      .bind<Constructor>(TYPES.ControllerType)
      .toConstructor(target)
      .whenTargetNamed(TYPES.ControllerType);
  };
}

/**
 * register config
 * app default env is "dev"
 * @param env string
 */
export function Config(env: "dev" | "test" | "prod" | string) {
  return (target: Constructor) => {
    Reflect.defineMetadata(TYPES.ConfigType, env, target);
    injectable()(target);
    fayContainer
      .bind(TYPES.ConfigType)
      .toConstructor(target)
      .whenTargetNamed(TYPES.ConfigType);
  };
}

/**
 * register plugin
 * plugin default name is plugin instance name
 * @param pluginKey string
 */
export function Plugin(pluginKey?: string) {
  return (target: Constructor) => {
    const pluginName = pluginKey ? pluginKey : target.name;
    Reflect.defineMetadata(TYPES.PluginType, pluginName, target);
    injectable()(target);
    fayContainer
      .bind<Constructor>(TYPES.PluginType)
      .toConstructor(target)
      .whenTargetNamed(TYPES.PluginType);
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
  return (target: Constructor) => {
    const middlewareInstance = new target();
    if (middlewareInstance.resolve) {
      const initMethod = middlewareInstance.resolve;
      Reflect.defineMetadata(TYPES.MiddlewareType, initMethod, target);
      Reflect.defineMetadata(TYPES.OrderType, order ? order : 1, target);
      injectable()(target);
      fayContainer
        .bind<Constructor>(TYPES.MiddlewareType)
        .toConstructor(target)
        .whenTargetNamed(TYPES.MiddlewareType);
    } else {
      throw new Error(
        `${target.name} middleware must has a 'resolve' method! please check it`
      );
    }
  };
}
