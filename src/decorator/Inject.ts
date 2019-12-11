import "reflect-metadata";
import { autowired_reg, CONTROL, RESTFUL, MIDDLEWARE } from "./Constants";

export const iocContainer: WeakMap<Function, any> = new WeakMap<Function, any>();

export function inject(target: any) {
  if (!target) {
    return;
  }

  // instantiate target
  const targetInstance = new target();

  // get the dependance of target
  const depends = Reflect.getOwnMetadataKeys(target).filter(
    (meta: string) => "design:paramtypes" !== meta
  );

  // iterator dependance
  depends.forEach((depClass: string) => {
    // get @@AUTOWIRED

    if (depClass.match(autowired_reg)) {
      // get constructor of dependance
      const _constructor = Reflect.getMetadata(depClass, target);

      // get depenance's name
      const prop = depClass.replace(autowired_reg, "");
      // check if has been instantiated in iocContainer
      let depInstance = iocContainer.get(_constructor);
      if (!iocContainer.has(_constructor)) {
        // has not been instantiated , new dependance via recurring
        depInstance = inject(_constructor);
      }

      // add dependance's instance to target
      targetInstance[prop] = depInstance;
    }
  });

  // inject instance to container
  iocContainer.set(target, targetInstance);

  return targetInstance;
}
