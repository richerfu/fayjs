import "reflect-metadata";
import { statSync, readdirSync } from "fs";
import { join } from "path";
import * as Koa from 'koa'
import {iocContainer} from './../decorator/Inject'
import {MIDDLEWARE} from './../decorator/Constants'

export class Loader {
  private _baseDir: string;

  constructor(BaseDir: string) {
    this._baseDir = BaseDir;
    this.LoadControllerFile(this._baseDir);
    this.LoadMiddlewareFile(this._baseDir);
    this.LoadServiceFile(this._baseDir);
  }

  /**
   * load controller to router
   * @param _Controller 
   * @since 0.0.7
   */
  public InjectController(_Controller: Set<Function | any>):void{

  }

  /**
   * load middleware to koa instance
   * @param _Middleware 
   * @since 0.0.7
   */
  public InjectMiddleware(_Middleware: Set<Function | any>,_App: Koa):void{
    for (const middleware of _Middleware) {
      const middlewareInstance = iocContainer.get(middleware);
      const run = Reflect.getMetadata(MIDDLEWARE, middleware);
      _App.use(async (ctx: Koa.Context, next: Koa.Next) => {
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

  }

  /**
   * load controller file eg: user.controller.ts
   * @param path file path
   * @since 0.0.1
   */
  public LoadControllerFile(path: string): void {
    const stats = statSync(path);
    if (stats.isDirectory()) {
      const files = readdirSync(path);
      for (const file of files) {
        this.LoadControllerFile(join(path, file));
      }
    } else {
      if (path.match(/.*[^\.]+\b\.controller\.(t|j)s\b$/)) {
        console.log(`loader controller file ${path}`);
        require(path);
      }
    }
  }

  /**
   * load Service file rg: user.service.ts
   * @param path file path
   * @since 0.0.1
   */
  public LoadServiceFile(path: string): void {
    const stats = statSync(path);
    if (stats.isDirectory()) {
      const files = readdirSync(path);
      for (const file of files) {
        this.LoadServiceFile(join(path, file));
      }
    } else {
      if (path.match(/.*[^\.]+\b\.service\.(t|j)s\b$/)) {
        console.log(`loader middleware file ${path}`);
        require(path);
      }
    }
  }

  /**
   * load middleware file rg: user.middleware.ts
   * @param path file path
   * @since 0.0.1
   */
  public LoadMiddlewareFile(path: string): void {
    const stats = statSync(path);
    if (stats.isDirectory()) {
      const files = readdirSync(path);
      for (const file of files) {
        this.LoadMiddlewareFile(join(path, file));
      }
    } else {
      if (path.match(/.*[^\.]+\b\.middleware\.(t|j)s\b$/)) {
        console.log(`loader middleware file ${path}`);
        require(path);
      }
    }
  }
}
