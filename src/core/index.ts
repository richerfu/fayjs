/* eslint-disable @typescript-eslint/prefer-optional-chain */
import "reflect-metadata";
import * as Koa from "koa";
import * as KoaRouter from "koa-router";
import logger from "../utils/Logger";
import { Loader } from "../loader/FileLoad";
import { Options } from "../utils/interface";
import { getLocalIPAddress } from "./../utils/Common";
import {
  _Config,
  _Controller,
  _Middleware,
  _Service,
} from "../decorator/Inject";

const router: KoaRouter = new KoaRouter();

export default class SoServer extends Koa {
  private options = {
    baseDir: process.cwd(),
  };
  private baseDir: string;
  private __router: KoaRouter;
  private __app:SoServer;

  public constructor(options?: Options) {
    super();
    this.options = options;
    this.env = process.env.NODE_ENV || "dev";
    this.__router = router;
    this.__app = this;
    this.baseDir = options
      ? options.baseDir
        ? options.baseDir
        : process.cwd()
      : process.cwd();
    const loader: Loader = new Loader(this.baseDir);
    const config = loader.InjectConfig(_Config, this.env);
    loader.UseMiddleware(this.__app, config);
    loader.InjectMiddleware(_Middleware, this.__app, config);
    loader.InjectService(_Service, config);
    loader.InjectController(_Controller, this.__app, this.__router, config);
    loader.LoadPlugin(config, this.__app);
  }

  public Listen(
    port = 12280,
    host = "0.0.0.0",
    backlog?: number,
    callback: () => void = () => {
      logger.warn(
        `SoServer Started Successful...\n  NetWork: \thttp://${getLocalIPAddress()}:${port}\n  Local: \thttp://127.0.0.1:${port}\n`
      );
    }
  ) {
    this.__app.listen(port, host, backlog ? backlog : null, callback);
  }
}
