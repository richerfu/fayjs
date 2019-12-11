import "reflect-metadata";
import * as Koa from "koa";
import * as KoaRouter from "koa-router";
import logger from "../utils/Logger";
import { iocContainer } from "../decorator/Inject";
import { RESTFUL, CONTROL, MIDDLEWARE } from "../decorator/Constants";
import { Loader } from "../loader";
import { Options } from "../types/interface";
import { getLocalIPAddress } from "./../utils/Common";

export * from "./../decorator/Decorator";
export * from "./../decorator/Context";
export * from "./../utils/Logger";

const router: KoaRouter = new KoaRouter();

export default class SoServer {
  static _Controller: Set<Function | any> = new Set<Function | any>();
  static _Service: Set<Function | any> = new Set<Function | any>();
  static _Middleware: Set<Function | any> = new Set<Function | any>();
  static _Config: Set<Function | any> = new Set<Function | any>();

  static __Instance: Koa = new Koa();

  private __router: KoaRouter;
  private __app: Koa;
  private options: Options;
  private env: string;
  public baseDir: string;

  constructor(options?: Options) {
    this.options = options;
    this.__app = SoServer.__Instance;
    this.env = process.env.NODE_ENV || "dev";
    this.baseDir = options
      ? options.baseDir
        ? options.baseDir
        : process.cwd()
      : process.cwd();
    this.__router = router;
    this.__app.on("error", (err: any) => {
      logger.error(err);
    });

    console.log(this.baseDir)
    const loader: Loader = new Loader(this.baseDir);

    const config = loader.InjectConfig(SoServer._Config, this.env);

    loader.InjectMiddleware(SoServer._Middleware, this.__app, config);

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
            controlInstance.config = config;
            // catch promise error
            try {
              await method.apply(
                controlInstance,
                parametersVals.concat([ctx, next])
              );
            } catch (error) {
              logger.error(error);
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
          logger.info(
            `SoRouter Registered: Path: ${routePath}\t Method: ${methodType}`
          );
        });
    }
    this.__app.use(this.__router.routes()).use(this.__router.allowedMethods());
  }

  public Listen(
    port: number = 12280,
    host: string = "0.0.0.0",
    callback: () => void = () => {
      logger.warn(
        `SoServer Started Successful...\n  NetWork: \thttp://${getLocalIPAddress()}:${port}\n  Local: \thttp://127.0.0.1:${port}\n`
      );
    }
  ): void {
    this.__app.listen(port, host, callback);
  }
}
