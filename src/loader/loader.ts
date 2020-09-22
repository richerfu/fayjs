/* eslint-disable @typescript-eslint/prefer-optional-chain */
import "reflect-metadata";
import * as Koa from "koa";
import * as KoaRouter from "koa-router";
import * as KoaBodyParser from "koa-body";
import { iocContainer } from "../decorator/inject";
import {
  MIDDLEWARE,
  CONFIG,
  RESTFUL,
  CONTROL,
  ORDER,
} from "../decorator/constants";
import { RequestLog } from "../middlewares/requestLog";
import { Logger } from "../tools/logger";
import {
  RequestBodySymbol,
  RequestContextSymbol,
  Config,
} from "../decorator/constants";
import { PluginLoader } from "./pluginLoader";
import { FileLoader } from "./fileLoader";
import {
  _Config,
  _Controller,
  _Middleware,
  _Service,
  _UserDefineMiddleware,
} from "../decorator/inject";
import { FileLoaderError } from "../error/fay_error";
import { fayContainer } from "../container";
import { TYPES } from "../container/type";
import { TireRouter } from "../router";
import Fay from "../";

export const filePath: Map<string, any> = new Map<string, any>();

export class Loader {
  private _baseDir!: string;
  private _app!: Fay;
  private _router!: TireRouter;
  private _config!: any;
  private _env!: string;
  private fileloader!: FileLoader;

  public constructor(
    BaseDir: string,
    env: string,
    app: Fay,
    router: TireRouter
  ) {
    this._baseDir = BaseDir;
    this._app = app;
    this._router = router;
    this._env = env;
    this.fileloader = new FileLoader(this._baseDir);
  }

  /**
   * 初始化挂载
   */
  public async init() {
    // app实例化加载config到loader中
    await this.fileloader.init();
    this._config = Object.assign(
      {},
      {
        UseRequestLog: true,
        PatchPluginConfig: {
          controller: true,
          service: true,
          middleware: false,
        },
      },
      this.LoadConfig(this._env)
    );
    // 加载plugin
    // this.LoadPlugin(this._config, this._app);
    // 加载内置middleware
    // this.UseInnerMiddleware(this._app, this._config);
    // 加载中间件
    // this.TypeMiddlewareOrder(_Middleware);
    // this.LoadMiddleware(_UserDefineMiddleware, this._app, this._config);
    // 加载router
    this.LoadController(this._app, this._router, this._config);
  }

  private LoadConfig(env: string) {
    const configInstances: any[] = fayContainer.getAll(TYPES.ConfigType);
    const injectConfigInstance: any = configInstances.find(item => {
      const __env = Reflect.getMetadata(TYPES.ConfigType, item);
      if (env === __env) {
        return item;
      }
    });
    if (!injectConfigInstance) {
      throw new FileLoaderError(
        `${env} config is not exist or NODE_ENV and ${env} are not equal. Please check it`
      );
    }
    return fayContainer.resolve(injectConfigInstance);
  }

  /**
   * 挂载koa-router相应方法
   * @param _Controller
   * @since 0.0.7
   */
  private LoadController(_App: Fay, _KoaRouter: TireRouter, config: any): void {
    const injectControllerInstance = fayContainer
      .getAllNamed(TYPES.ControllerType, TYPES.ControllerType)
      .forEach((item: any) => {
        const consParams = Reflect.getMetadata(
          TYPES.ConstuctorParamsType,
          item
        );
        const instance = fayContainer.resolve(item);
        console.log(instance);
      });
    // for (const controller of _Controller) {
    //   // get control instance
    //   const controlInstance = iocContainer.get(controller);
    //   // get instance's metas
    //   const metas = Reflect.getMetadataKeys(controlInstance);

    //   const restfulMap = Reflect.getMetadata(RESTFUL, controlInstance);
    //   const controlPath = Reflect.getMetadata(CONTROL, controller);

    //   Object.getOwnPropertyNames(controlInstance.__proto__)
    //     .filter(name => name !== "constructor")
    //     .forEach(methodName => {
    //       const method = controlInstance[methodName];
    //       const parameterMap = restfulMap.get(method);
    //       const methodPath = parameterMap.get("path");
    //       const querySet = parameterMap.get("query");
    //       const paramsSet = parameterMap.get("params") as Set<string | any>;
    //       const bodySet = parameterMap.get("body") as Set<string | any>;
    //       const requestBodySet = parameterMap.get("RequestBody") as Set<
    //         string | any
    //       >;
    //       const contextSet = parameterMap.get("RequestContext") as Set<
    //         string | any
    //       >;
    //       const headersSet = parameterMap.get("headers") as Set<string | any>;
    //       const methodType = parameterMap.get("methodType");
    //       const args = parameterMap.get("args");
    //       const middleWareSet = parameterMap.get(MIDDLEWARE);

    //       const handleRequest = async (ctx: Koa.Context, next: Koa.Next) => {
    //         const parametersVals = args.map((arg: string) => {
    //           if (headersSet && headersSet.has(arg)) {
    //             return ctx.header[arg];
    //           }
    //           if (paramsSet && paramsSet.has(arg)) {
    //             return ctx.params[arg];
    //           }
    //           if (querySet && querySet.has(arg)) {
    //             return ctx.query[arg];
    //           }
    //           if (requestBodySet && requestBodySet.has(arg)) {
    //             return ctx.request.body[arg];
    //           }
    //           if (bodySet && bodySet.has(RequestBodySymbol)) {
    //             return ctx.request.body;
    //           }
    //           if (contextSet && contextSet.has(RequestContextSymbol)) {
    //             return ctx;
    //           }
    //         });
    //         controlInstance.ctx = ctx;
    //         controlInstance.next = next;
    //         controlInstance.config = config;
    //         try {
    //           await method.apply(controlInstance, parametersVals);
    //         } catch (error) {
    //           Logger.error(error);
    //         }
    //       };

    //       const routePath = (controlPath + methodPath).replace("//", "/");
    //       if (middleWareSet) {
    //         _KoaRouter[methodType](
    //           routePath,
    //           Array.from(middleWareSet),
    //           handleRequest
    //         );
    //       } else {
    //         _KoaRouter[methodType](routePath, handleRequest);
    //       }
    //       Logger.info(
    //         `[SoRouter Registered::] Path: ${routePath}\t Method: ${methodType}`
    //       );
    //     });
    // }
    // _App.use(_KoaRouter.routes()).use(_KoaRouter.allowedMethods());
  }

  /**
   * 挂载middleware到koa实例
   * @param _Middleware
   * @since 0.0.7
   */
  private LoadMiddleware(
    _UserDefineMiddleware: Map<number, any[]>,
    _App: Koa,
    config: Config
  ): void {
    Array.from(_UserDefineMiddleware)
      .sort((a, b) => {
        return b[0] - a[0];
      })
      .reduce((allMid, item) => {
        allMid.push(item[1]);
        return allMid;
      }, [])
      .forEach(item => {
        _App.use(async (ctx: Koa.Context, next: Koa.Next) => {
          const resolve = Reflect.getMetadata(MIDDLEWARE, item[0]);
          item[1].ctx = ctx;
          item[1].next = next;
          item[1].config = config;
          try {
            await resolve.apply(item[1]);
          } catch (e) {
            Logger.error(e);
          }
        });
      });
  }

  /**
   * 使用内置中间件
   * @param _App
   * @param config
   */
  private UseInnerMiddleware(_App: Koa, config: Config): void {
    /**
     * use request-log to console request info
     */
    if (config && config.UseRequestLog) {
      _App.use(RequestLog);
    }
    /**
     * use koa-body to get request body
     */
    const KoaBodyParserConfig = Object.assign(
      {},
      {
        patchKoa: true,
        patchNode: true,
        jsonLimit: "1mb",
        formLimit: "56kb",
        textLimit: "56kb",
        encoding: "utf-8",
        multipart: true,
        text: true,
        json: true,
        jsonStrict: false,
        includeUnparsed: false,
        formidable: {},
        onError: (e: any, ctx: any) => {
          console.log(e, ctx);
        },
        parseMethods: ["POST", "PUT", "PATCH"],
      },
      config ? config.KoaBodyConfig : {}
    );
    _App.use(KoaBodyParser(KoaBodyParserConfig));
  }

  /**
   * 对中间件进行分类排序
   * @param _Middleware
   */
  private TypeMiddlewareOrder(_Middleware: Set<Function | any>) {
    for (const middleware of _Middleware) {
      const middlewareInstance = iocContainer.get(middleware);
      const order = Reflect.getMetadata(ORDER, middleware);
      if (_UserDefineMiddleware.has(order)) {
        const mid = _UserDefineMiddleware.get(order);
        _UserDefineMiddleware.set(
          order,
          mid.concat([middleware, middlewareInstance])
        );
      } else {
        _UserDefineMiddleware.set(order, [middleware, middlewareInstance]);
      }
    }
  }

  /**
   * patch plugin to instance
   * @param config
   * @param _App
   */
  private LoadPlugin(config: Config, _App: Koa): void {
    (async () => {
      const pluginLoader: PluginLoader = new PluginLoader(
        this._baseDir,
        config,
        _App
      );
      await pluginLoader.autoLoadPlugin("controller", _Controller);
      await pluginLoader.autoLoadPlugin("service", _Service);
      await pluginLoader.autoLoadPlugin("middleware", _Middleware);
    })();
  }
}
