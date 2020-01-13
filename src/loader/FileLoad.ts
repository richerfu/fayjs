/* eslint-disable @typescript-eslint/prefer-optional-chain */
import "reflect-metadata";
import { statSync, readdirSync } from "fs";
import { join } from "path";
import * as Koa from "koa";
import * as KoaRouter from "koa-router";
import * as KoaBodyParser from "koa-body";
import { iocContainer } from "../decorator/Inject";
import { MIDDLEWARE, CONFIG, RESTFUL, CONTROL } from "../decorator/Constants";
import { Config } from "../utils/interface";
import { RequestLog } from "../plugin/RequestLog";
import logger from "../utils/Logger";
import { RequestBodySymbol, RequestContextSymbol } from "../utils/interface";
import { Curl } from "../plugin/Curl";
import { PluginLoader } from "./PluginLoad";
import {
  _Config,
  _Controller,
  _Middleware,
  _Service,
} from "../decorator/Inject";

const curl: Curl = new Curl();

export const filePath: Map<string, any> = new Map<string, any>();

export class Loader {
  private _baseDir: string;

  public constructor(BaseDir: string) {
    this._baseDir = BaseDir;
    this.LoadPluginFile(this._baseDir);
    this.LoadControllerFile(this._baseDir);
    this.LoadMiddlewareFile(this._baseDir);
    this.LoadServiceFile(this._baseDir);
    this.LoadConfigFile(this._baseDir);
    this.LoadInnerPlugin();
  }

  /**
   * get current runtime config
   * @param {Set<Function| any>} _Config all config instance
   * @param {string} env runtime env
   * @since 0.0.7
   */
  public InjectConfig(_Config: Set<Function | any>, env: string): Config {
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
      throw new Error(
        `${env} config is not exist or NODE_ENV and ${env} are not equal.please check it`
      );
    }
  }

  /**
   * load controller to router
   * @param _Controller
   * @since 0.0.7
   */
  public InjectController(
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
            // catch promise error
            try {
              await method.apply(controlInstance, parametersVals);
            } catch (error) {
              ctx.status = 500;
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
          logger.info(
            `SoRouter Registered: Path: ${routePath}\t Method: ${methodType}`
          );
        });
    }
    _App.use(_KoaRouter.routes()).use(_KoaRouter.allowedMethods());
  }

  /**
   * load middleware to koa instance
   * @param _Middleware
   * @since 0.0.7
   */
  public InjectMiddleware(
    _Middleware: Set<Function | any>,
    _App: Koa,
    config: Config
  ): void {
    for (const middleware of _Middleware) {
      const middlewareInstance = iocContainer.get(middleware);
      const run = Reflect.getMetadata(MIDDLEWARE, middleware);
      _App.use(async (ctx: Koa.Context, next: Koa.Next) => {
        middlewareInstance.ctx = ctx;
        middlewareInstance.next = next;
        middlewareInstance.config = config;
        try {
          await run.apply(middlewareInstance, [ctx, next]);
        } catch (e) {
          console.error(e);
          ctx.status = 500;
        }
      });
    }
  }

  public UseMiddleware(_App: Koa, config: Config): void {
    /**
     * use request-log to console request info
     */
    _App.use(RequestLog);
    /**
     * use koa-body to get request body
     */
    _App.use(
      KoaBodyParser({
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
        onError: (e, ctx) => {
          console.log(e, ctx);
        },
        strict: false,
        parsedMethods: ["POST", "PUT", "PATCH"],
      })
    );
  }

  /**
   * load something to service
   * @param _Service service instance
   * @param config app config
   */
  public InjectService(_Service: Set<Function | any>, config: Config): void {}

  public LoadPlugin(config: Config, _App: Koa): void {
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

  /**
   * load controller file eg: user.controller.ts
   * @param path file path
   * @since 0.0.1
   */
  public LoadControllerFile(path: string): void {
    const Reg = /.*[^\.]+\b\.controller\.ts\b$/;
    this.LoadFile(path, Reg);
  }

  /**
   * load Service file rg: user.service.ts
   * @param path file path
   * @since 0.0.1
   */
  public LoadServiceFile(path: string): void {
    const Reg = /.*[^\.]+\b\.service\.ts\b$/;
    this.LoadFile(path, Reg);
  }

  /**
   * load middleware file rg: user.middleware.ts
   * @param path file path
   * @since 0.0.1
   */
  public LoadMiddlewareFile(path: string): void {
    const Reg = /.*[^\.]+\b\.middleware\.ts\b$/;
    this.LoadFile(path, Reg);
  }

  /**
   * load config file eg:test.config.ts
   * @param path file path
   * @since 0.0.7
   */
  public LoadConfigFile(path: string): void {
    const Reg = /.*[^\.]+\b\.config\.ts\b$/;
    this.LoadFile(path, Reg);
  }

  public LoadPluginFile(path: string): void {
    const Reg = /.*[^\.]+\b\.plugin\.ts\b$/;
    this.LoadFile(path, Reg);
  }

  public LoadInnerPlugin() {
    const Reg = /.*[^\.]+\b\.js\b$/;
    const stats = statSync(join(__dirname, "../plugin"));
    const files = readdirSync(join(__dirname, "../plugin"));
    for (const file of files) {
      if (file.match(Reg)) {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require(join(__dirname, "../plugin", file));
      }
    }
  }

  /**
   * load file by path and regexp
   * @param path String
   * @param reg RegExp
   * @since 0.0.7
   */
  private LoadFile(path: string, reg: RegExp) {
    const stats = statSync(path);
    if (stats.isDirectory()) {
      const files = readdirSync(path);
      for (const file of files) {
        if (file !== "node_modules") {
          this.LoadFile(join(path, file), reg);
        }
      }
    } else {
      if (path.match(reg)) {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const modules = require(path);
        filePath.set(path, Object.keys(modules));
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require(path);
      }
    }
  }
}
