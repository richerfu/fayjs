import * as globby from "globby";
import { join, posix } from "path";

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
      join(__dirname, "../plugins"),
    ];
    const filePaths = await globby(pathPatterns);
    for (const itemPath of filePaths) {
      await import(itemPath);
    }
  }
}
