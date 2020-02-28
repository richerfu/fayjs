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
import { LoadError } from "../utils/error";

export const filePath: Map<string, any> = new Map<string, any>();

export class Loader {
  private _baseDir: string;
  private _app: any;
  private _router: any;
  private _config: any;
  private _env: string;
  private fileloader: FileLoader;

  public constructor(BaseDir: string, env: string, app: any, router: any) {
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
    this._config = this.LoadConfig(_Config, this._env);
    // 加载plugin
    this.LoadPlugin(this._config, this._app);
    // 加载内置middleware
    this.UseInnerMiddleware(this._app, this._config);
    // 加载中间件
    this.TypeMiddlewareOrder(_Middleware);
    this.LoadMiddleware(_UserDefineMiddleware, this._app, this._config);
    // 加载router
    this.LoadController(_Controller, this._app, this._router, this._config);
  }

  /**
   * 获取config配置文件
   * @param {Set<Function| any>} _Config all config instance
   * @param {string} env runtime env
   * @since 0.0.7
   */
  private LoadConfig(_Config: Set<Function | any>, env: string): Config {
    let flag = false;
    for (const config of _Config) {
      const configInstance: Config = iocContainer.get(config);
      const envInstance = Reflect.getMetadata(CONFIG, config);
      if (envInstance === env) {
        flag = false;
        return configInstance;
      } else {
        flag = true;
      }
    }
    if (flag) {
      throw new LoadError(
        `${env} config is not exist or NODE_ENV and ${env} are not equal.please check it`
      );
    }
  }

  /**
   * 挂载koa-router相应方法
   * @param _Controller
   * @since 0.0.7
   */
  private LoadController(
    _Controller: Set<Function | any>,
    _App: Koa,
    _KoaRouter: KoaRouter,
    config: any
  ): void {
    for (const controller of _Controller) {
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
          const paramsSet = parameterMap.get("params") as Set<string | any>;
          const bodySet = parameterMap.get("body") as Set<string | any>;
          const requestBodySet = parameterMap.get("RequestBody") as Set<
            string | any
          >;
          const contextSet = parameterMap.get("RequestContext") as Set<
            string | any
          >;
          const headersSet = parameterMap.get("headers") as Set<string | any>;
          const methodType = parameterMap.get("methodType");
          const args = parameterMap.get("args");
          const middleWareSet = parameterMap.get(MIDDLEWARE);

          const handleRequest = async (ctx: Koa.Context, next: Koa.Next) => {
            const parametersVals = args.map((arg: string) => {
              if (headersSet && headersSet.has(arg)) {
                return ctx.header[arg];
              }
              if (paramsSet && paramsSet.has(arg)) {
                return ctx.params[arg];
              }
              if (querySet && querySet.has(arg)) {
                return ctx.query[arg];
              }
              if (requestBodySet && requestBodySet.has(arg)) {
                return ctx.request.body[arg];
              }
              if (bodySet && bodySet.has(RequestBodySymbol)) {
                return ctx.request.body;
              }
              if (contextSet && contextSet.has(RequestContextSymbol)) {
                return ctx;
              }
            });
            controlInstance.ctx = ctx;
            controlInstance.next = next;
            controlInstance.config = config;
            try {
              await method.apply(controlInstance, parametersVals);
            } catch (error) {
              Logger.error(error);
            }
          };

          const routePath = (controlPath + methodPath).replace("//", "/");
          if (middleWareSet) {
            _KoaRouter[methodType](
              routePath,
              Array.from(middleWareSet),
              handleRequest
            );
          } else {
            _KoaRouter[methodType](routePath, handleRequest);
          }
          Logger.info(
            `[SoRouter Registered::] Path: ${routePath}\t Method: ${methodType}`
          );
        });
    }
    _App.use(_KoaRouter.routes()).use(_KoaRouter.allowedMethods());
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
    _App.use(RequestLog);
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
