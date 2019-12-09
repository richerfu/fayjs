import { statSync, readdirSync } from "fs";
import { join } from "path";

export class Loader {
  private _baseDir: string;

  constructor(BaseDir: string) {
    this._baseDir = BaseDir;
    this.LoadControllerFile(this._baseDir);
    this.LoadMiddlewareFile(this._baseDir);
    this.LoadServiceFile(this._baseDir);
  }

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
