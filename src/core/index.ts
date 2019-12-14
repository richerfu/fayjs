/* eslint-disable @typescript-eslint/prefer-optional-chain */
import "reflect-metadata";
import * as Koa from "koa";
import * as KoaRouter from "koa-router";
import logger from "../utils/Logger";
import { Loader } from "../loader";
import { Options } from "../types/interface";
import { getLocalIPAddress } from "./../utils/Common";

const router: KoaRouter = new KoaRouter();

export default class SoServer {
  public static _Controller: Set<Function | any> = new Set<Function | any>();
  public static _Service: Set<Function | any> = new Set<Function | any>();
  public static _Middleware: Set<Function | any> = new Set<Function | any>();
  public static _Config: Set<Function | any> = new Set<Function | any>();

  private static __Instance: Koa = new Koa();
  public baseDir: string;

  private __router: KoaRouter;
  private __app: Koa;
  private options: Options;
  private env: string;

  public constructor(options?: Options) {
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

    const loader: Loader = new Loader(this.baseDir);

    const config = loader.InjectConfig(SoServer._Config, this.env);

    loader.InjectMiddleware(SoServer._Middleware, this.__app, config);

    loader.InjectService(SoServer._Service, config);

    loader.InjectController(
      SoServer._Controller,
      this.__app,
      this.__router,
      config
    );
  }

  public Listen(
    port = 12280,
    host = "0.0.0.0",
    callback: () => void = () => {
      logger.warn(
        `SoServer Started Successful...\n  NetWork: \thttp://${getLocalIPAddress()}:${port}\n  Local: \thttp://127.0.0.1:${port}\n`
      );
    }
  ): void {
    this.__app.listen(port, host, callback);
  }
}
