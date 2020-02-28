import "reflect-metadata";
import { autowired_reg, ContextSymbol, NextSymbol } from "./constants";

// ioc core container
export const iocContainer: WeakMap<Function, any> = new WeakMap<
  Function,
  any
>();

/**
 * user define middleware map
 * key: number -> order
 * value: any[] -> current order middleware array
 */
export const _UserDefineMiddleware: Map<number, any[]> = new Map<
  number,
  any[]
>();

/**
 * ioc instance set
 */
export const _Controller: Set<Function | any> = new Set<Function | any>();
export const _Service: Set<Function | any> = new Set<Function | any>();
export const _Middleware: Set<Function | any> = new Set<Function | any>();
export const _Config: Set<Function | any> = new Set<Function | any>();
export const _Plugin: Set<Function | any> = new Set<Function | any>();

/**
 * IOC Core container inject
 * @param target class
 */
export const Inject = (target: any) => {
  if (!target) {
    return;
  }
  const targetInstance = new target();

  const classDepends = Reflect.getOwnMetadataKeys(target).filter(
    (meta: string) => "design:paramtypes" !== meta
  );

  classDepends.forEach((dependsClassItem: string) => {
    if (dependsClassItem.match(autowired_reg)) {
      const _constructor = Reflect.getMetadata(dependsClassItem, target);
      const dependName = dependsClassItem.replace(autowired_reg, "");
      let depInstance = iocContainer.get(_constructor);
      if (!iocContainer.has(_constructor)) {
        depInstance = Inject(_constructor);
      }
      targetInstance[dependName] = depInstance;
    }
  });
  iocContainer.set(target, targetInstance);
  return targetInstance;
};
