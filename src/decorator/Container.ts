import "reflect-metadata";
import { autowired_reg } from "./Constants";
export class BaseContainer {
  protected container: WeakMap<Function, any> = new WeakMap<Function, any>();

  public register(target: any): any {
    const targetInstance = new target();
    const depends = Reflect.getOwnMetadataKeys(target).filter(
      (meta: string) => "design:paramtypes" !== meta
    );

    depends.forEach((depClass: string) => {
      if (depClass.match(autowired_reg)) {
        const _constructor = Reflect.getMetadata(depClass, target);
        const dependName = depClass.replace(autowired_reg, "");
        let depInstance = this.container.get(_constructor);
        if (!this.container.has(_constructor)) {
          depInstance = this.register(_constructor);
        }
        targetInstance[dependName] = depInstance;
      }
    });

    this.container.set(target, targetInstance);
    return targetInstance;
  }

  public getContainerInstance(target: any): any {
    return this.container.get(target);
  }

  public getContainer(): WeakMap<Function, any> {
    return this.container;
  }
}
