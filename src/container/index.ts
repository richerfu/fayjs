import { Container } from "inversify";
import getDecorators from "inversify-inject-decorators";

const fayContainer = new Container({});

let {
  /** @internal */
  lazyInject,
} = getDecorators(fayContainer);

export { lazyInject, fayContainer };
