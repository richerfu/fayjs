/* eslint-disable @typescript-eslint/prefer-optional-chain */
import "reflect-metadata";
import * as Koa from "koa";
import * as KoaRouter from "koa-router";
import { Logger } from "../tools/logger";
import { Loader } from "../loader/loader";
import { Options } from "../utils/interface";
import { getLocalIPAddress } from "../utils";
import {
  _Config,
  _Controller,
  _Middleware,
  _Service,
} from "../decorator/inject";

const router: KoaRouter = new KoaRouter();

export default class Fay extends Koa {
  private options = {
    baseDir: process.cwd(),
  };
  private baseDir: string;
  private _router: KoaRouter;
  private _app: Fay;

  public constructor(options?: Options) {
    super();
    this.options = options;
    this.env = process.env.NODE_ENV || "dev";
    this._router = router;
    this._app = this;
    this.baseDir = options
      ? options.baseDir
        ? options.baseDir
        : process.cwd()
      : process.cwd();
    try {
      const loader: Loader = new Loader(
        this.baseDir,
        this.env,
        this._app,
        this._router
      );
      loader.init();
    } catch (e) {
      Logger.error(e);
      process.exit(0);
    }
  }

  public Listen(
    port = 12280,
    host = "0.0.0.0",
    backlog?: number,
    callback: () => void = () => {
      Logger.success(
        `SoServer Started Successful...\n  NetWork: \thttp://${getLocalIPAddress()}:${port}\n  Local: \thttp://127.0.0.1:${port}\n`
      );
    }
  ) {
    this._app.listen(port, host, backlog ? backlog : null, callback);
  }

  public close() {
    Logger.success("SoServer Closed Successful...");
    process.exit(0);
  }
}
