import "reflect-metadata";
import { autowired_reg, CONTROL, RESTFUL, MIDDLEWARE } from "./Constants";

export const iocContainer: WeakMap<Function, any> = new WeakMap<
  Function,
  any
>();

export const _Controller: Set<Function | any> = new Set<Function | any>();
export const _Service: Set<Function | any> = new Set<Function | any>();
export const _Middleware: Set<Function | any> = new Set<Function | any>();
export const _Config: Set<Function | any> = new Set<Function | any>();

/**
 * IOC Core
 * @param target class
 */
export function Inject(target: any) {
  if (!target) {
    return;
  }

  // instantiate target
  const targetInstance = new target();

  const depends = Reflect.getOwnMetadataKeys(target).filter(
    (meta: string) => "design:paramtypes" !== meta
  );

  depends.forEach((depClass: string) => {
    // autowired depend to instance
    if (depClass.match(autowired_reg)) {
      // get constructor of dependance
      const _constructor = Reflect.getMetadata(depClass, target);

      const dependName = depClass.replace(autowired_reg, "");
      // check if has been instantiated in iocContainer
      let depInstance = iocContainer.get(_constructor);
      if (!iocContainer.has(_constructor)) {
        // has not been instantiated , new dependance via recurring
        depInstance = Inject(_constructor);
      }

      // add dependance's instance to target
      targetInstance[dependName] = depInstance;
    }
  });

  // inject instance to container
  iocContainer.set(target, targetInstance);

  return targetInstance;
}
