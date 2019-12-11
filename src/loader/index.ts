import "reflect-metadata";
import { statSync, readdirSync } from "fs";
import { join } from "path";
import * as Koa from "koa";
import { iocContainer } from "./../decorator/Inject";
import { MIDDLEWARE, CONFIG } from "./../decorator/Constants";
import { Config } from "interface";

export class Loader {
  private _baseDir: string;

  constructor(BaseDir: string) {
    this._baseDir = BaseDir;
    this.LoadControllerFile(this._baseDir);
    this.LoadMiddlewareFile(this._baseDir);
    this.LoadServiceFile(this._baseDir);
    this.LoadConfigFile(this._baseDir);
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
        this.LoadFile(join(path, file), reg);
      }
    } else {
      if (path.match(reg)) {
        require(path);
      }
    }
  }

  /**
   * get current runtime config
   * @param {Set<Function| any>} _Config all config instance
   * @param {string} env runtime env
   * @since 0.0.7
   */
  public InjectConfig(_Config: Set<Function | any>, env: string): Config {
    for (const config of _Config) {
      const configInstance: Config = iocContainer.get(config);
      const envInstance = Reflect.getMetadata(CONFIG, config);
      if (envInstance === env) {
        return configInstance;
      }
    }
  }

  /**
   * load controller to router
   * @param _Controller
   * @since 0.0.7
   */
  public InjectController(_Controller: Set<Function | any>): void {}

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
          ctx.send(e && e.message);
        }
      });
    }
  }

  /**
   * load controller file eg: user.controller.ts
   * @param path file path
   * @since 0.0.1
   */
  public LoadControllerFile(path: string): void {
    const Reg: RegExp = /.*[^\.]+\b\.controller\.(t|j)s\b$/;
    this.LoadFile(path, Reg);
  }

  /**
   * load Service file rg: user.service.ts
   * @param path file path
   * @since 0.0.1
   */
  public LoadServiceFile(path: string): void {
    const Reg: RegExp = /.*[^\.]+\b\.service\.(t|j)s\b$/;
    this.LoadFile(path, Reg);
  }

  /**
   * load middleware file rg: user.middleware.ts
   * @param path file path
   * @since 0.0.1
   */
  public LoadMiddlewareFile(path: string): void {
    const Reg: RegExp = /.*[^\.]+\b\.middleware\.(t|j)s\b$/;
    this.LoadFile(path, Reg);
  }

  /**
   * load config file eg:test.config.ts
   * @param path file path
   * @since 0.0.7
   */
  public LoadConfigFile(path: string): void {
    const Reg: RegExp = /.*[^\.]+\b\.config\.(t|j)s\b$/;
    this.LoadFile(path, Reg);
  }
}
