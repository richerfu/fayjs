import "reflect-metadata";
import * as Koa from "koa";
import * as KoaRouter from "koa-router";
import { Middleware } from "koa";
import logger from "../utils/Logger";
import { iocContainer } from "../decorator/Inject";
import { RESTFUL, CONTROL, MIDDLEWARE } from "../decorator/Constants";
import { Loader } from "../loader";
import { Options } from "../types/interface";

export * from './../decorator/Decorator'
export * from './../decorator/Context'

const router: KoaRouter = new KoaRouter();

export class SoServer {
  static _Controller: Set<Function | any> = new Set<Function | any>();
  static _Service: Set<Function | any> = new Set<Function | any>();
  static _Middleware: Set<Function | any> = new Set<Function | any>();

  static __Instance: Koa = new Koa();

  private __router: KoaRouter;
  private __app: Koa;
  private options: Options;

  constructor(options?: Options) {
    this.options = options;
    this.__app = SoServer.__Instance;
    this.__router = router;
    this.__app.on("error", (err: Error) => {
      console.error(err);
    });

    const loader: Loader = new Loader(this.options.baseDir);

    for (const middleware of SoServer._Middleware) {
      const middlewareInstance = iocContainer.get(middleware);
      const run = Reflect.getMetadata(MIDDLEWARE, middleware);
      this.__app.use(async (ctx: Koa.Context, next: Koa.Next) => {
        middlewareInstance.ctx = ctx;
        middlewareInstance.next = next;
        try {
          await run.apply(middlewareInstance, [ctx, next]);
        } catch (e) {
          console.error(e);
          ctx.send(e && e.message);
        }
      });
    }

    for (const controller of SoServer._Controller) {
      // get control instance
      const controlInstance = iocContainer.get(controller);
      // get instance's metas
      const metas = Reflect.getMetadataKeys(controlInstance);

      const restfulMap = Reflect.getMetadata(RESTFUL, controlInstance);
      const controlPath = Reflect.getMetadata(CONTROL, controller);

      Object.getOwnPropertyNames(controlInstance.__proto__)
        .filter(name => name !== "constructor")
        .forEach(methodName => {
          const method = controlInstance[methodName];
          const parameterMap = restfulMap.get(method);
          const methodPath = parameterMap.get("path");
          const querySet = parameterMap.get("query");
          const paramsSet = parameterMap.get("params") as Set<string>;
          const bodySet = parameterMap.get("body") as Set<string>;
          const requestBodySet = parameterMap.get("RequestBody") as Set<string>;
          const methodType = parameterMap.get("methodType");
          const args = parameterMap.get("args");
          const middleWareSet = parameterMap.get(MIDDLEWARE);

          const handleRequest = async (ctx: Koa.Context, next: Koa.Next) => {
            const parametersVals = args.map((arg: string) => {
              if (paramsSet && paramsSet.has(arg)) {
                return ctx.params[arg];
              }
              if (querySet && querySet.has(arg)) {
                return ctx.query[arg];
              }
              if (bodySet && bodySet.has(arg)) {
                return ctx.body[arg];
              }

              if (requestBodySet && requestBodySet.has(arg)) {
                return ctx.body;
              }
            });
            controlInstance.ctx = ctx;
            controlInstance.next = next;
            // catch promise error
            try {
              await method.apply(
                controlInstance,
                parametersVals.concat([ctx, next])
              );
            } catch (error) {
              console.error(error);
              ctx.send(error && error.message);
            }
          };

          const routePath = (controlPath + methodPath).replace("//", "/");
          if (middleWareSet) {
            this.__router[methodType](
              routePath,
              Array.from(middleWareSet),
              handleRequest
            );
          } else {
            this.__router[methodType](routePath, handleRequest);
          }
          logger.log(
            `SoRouter Registed: Path: ${routePath}\t Method: ${methodType}`
          );
        });
    }
    this.__app.use(this.__router.routes()).use(this.__router.allowedMethods());
  }

  public Use(middleware: Middleware, next: any): void {
    this.__app.use(middleware);
  }

  public Listen(
    port: number = 12280,
    callback: () => void = () => {
      console.log(`SoServer Listen at http://localhost:${port}`);
    }
  ): void {
    this.__app.listen(port, callback);
  }
}

// export default SoServer;
