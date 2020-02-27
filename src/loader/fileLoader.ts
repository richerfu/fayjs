/* eslint-disable @typescript-eslint/prefer-optional-chain */
import "reflect-metadata";
import { statSync, readdirSync } from "fs";
import { join } from "path";
import {
  _Config,
  _Controller,
  _Middleware,
  _Service,
} from "../decorator/inject";

export const filePath: Map<string, any> = new Map<string, any>();

export class FileLoader {
  private _baseDir: string;

  public constructor(BaseDir: string) {
    this._baseDir = BaseDir;
    this.LoadInnerPlugin();
    this.LoadPluginFile(this._baseDir);
    this.LoadControllerFile(this._baseDir);
    this.LoadMiddlewareFile(this._baseDir);
    this.LoadServiceFile(this._baseDir);
    this.LoadConfigFile(this._baseDir);
  }

  /**
   * load controller file eg: user.controller.ts
   * @param path file path
   * @since 0.0.1
   */
  private LoadControllerFile(path: string): void {
    const Reg = /.*[^\.]+\b\.controller\.(t|j)s\b$/;
    this.LoadFile(path, Reg);
  }

  /**
   * load Service file rg: user.service.ts
   * @param path file path
   * @since 0.0.1
   */
  private LoadServiceFile(path: string): void {
    const Reg = /.*[^\.]+\b\.service\.(t|j)s\b$/;
    this.LoadFile(path, Reg);
  }

  /**
   * load middleware file rg: user.middleware.ts
   * @param path file path
   * @since 0.0.1
   */
  private LoadMiddlewareFile(path: string): void {
    const Reg = /.*[^\.]+\b\.middleware\.(t|j)s\b$/;
    this.LoadFile(path, Reg);
  }

  /**
   * load config file eg:test.config.ts
   * @param path file path
   * @since 0.0.7
   */
  private LoadConfigFile(path: string): void {
    const Reg = /.*[^\.]+\b\.config\.(t|j)s\b$/;
    this.LoadFile(path, Reg);
  }

  private LoadPluginFile(path: string): void {
    const Reg = /.*[^\.]+\b\.plugin\.(t|j)s\b$/;
    this.LoadFile(path, Reg);
  }

  /**
   * 加载内置插件
   */
  private LoadInnerPlugin() {
    const Reg = /.*[^\.]+\b\.js\b$/;
    const files = readdirSync(join(__dirname, "../plugins"));
    for (const file of files) {
      if (file.match(Reg)) {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require(join(__dirname, "../plugins", file));
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
