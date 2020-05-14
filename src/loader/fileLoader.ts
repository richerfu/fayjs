/* eslint-disable @typescript-eslint/prefer-optional-chain */
import "reflect-metadata";
import * as globby from "globby";
import { statSync, readdirSync } from "fs";
import { join, posix } from "path";
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
  }

  public async init() {
    const pathPatterns = [
      posix.join(this._baseDir, "**/*.(t|j)s"),
      "!node_modules",
      "!**/node_modules",
    ];
    const filePaths = await globby(pathPatterns);
    for (const itemPath of filePaths) {
      await import(itemPath);
    }
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
}
