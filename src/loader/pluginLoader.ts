import "reflect-metadata";
import * as Koa from "koa";
import { join } from "path";
import { iocContainer, _Plugin } from "../decorator/inject";
import { PLUGIN, Name, Plugins } from "../decorator/constants";
import {
  GeneratorProp,
  FinalTemplate,
  writeTypingsFile,
  MkdirFolder,
  FindModulePath,
} from "../utils/helper";
import { LoadError } from "../utils/error";

interface PatchPluginConfig {
  controller?: boolean;
  service?: boolean;
  middleware?: boolean;
}

export class PluginLoader {
  private appConfig: any;
  private baseDir: string;
  private pluginConfig: PatchPluginConfig = {
    controller: true,
    service: true,
    middleware: false,
  };
  private _app: Koa;

  /**
   * load plugin，plugin init
   * @param baseDir
   * @param config
   * @param app
   */
  public constructor(baseDir: string, config: Object, app: Koa) {
    this.baseDir = baseDir;
    this.appConfig = config;
    if (this.appConfig && this.appConfig.PatchPluginConfig) {
      this.pluginConfig = Object.assign(
        {},
        { controller: true, service: true, middleware: false },
        this.appConfig.PatchPluginConfig
      );
    }
    this._app = app;
    for (const pluginItem of _Plugin) {
      const nameKey = Reflect.getMetadata(PLUGIN, pluginItem);
      const pluginInstance = iocContainer.get(pluginItem);
      pluginInstance.app = this._app;
      pluginInstance.config = this.appConfig;
      if (pluginInstance && pluginInstance.start) {
        pluginInstance.start();
      } else {
        throw new LoadError(`${nameKey} Plugin Init Error.`);
      }
    }
  }

  /**
   * load plugin to controller service middleware
   * generator .d.ts file
   * @param type
   * @param instances
   */
  public async autoLoadPlugin(
    type: "controller" | "middleware" | "service",
    instances: Set<Function | any>
  ): Promise<any> {
    try {
      if (this.pluginConfig[type]) {
        for (const instance of instances) {
          const iocInstance = iocContainer.get(instance);
          let prop = "";
          let importContent = "";
          for (const pluginItem of _Plugin) {
            const nameKey = Reflect.getMetadata(PLUGIN, pluginItem);
            const pluginInstance = iocContainer.get(pluginItem);
            iocInstance[nameKey] = pluginInstance;
            //  生成.d.ts文件
            if (!Plugins.includes(nameKey)) {
              prop += GeneratorProp(nameKey, pluginItem.name);
              importContent += FindModulePath(pluginItem.name, this.baseDir);
            }
          }
          const template = FinalTemplate(Name[type], importContent, prop);
          const folderName = this.baseDir;
          await MkdirFolder(join(folderName, "./types"));
          await writeTypingsFile(
            join(folderName, "./types", `./${type}.d.ts`),
            template
          );
        }
      }
    } catch (e) {
      throw new LoadError(`AutoLoadPlugin Error: ${e.message}`);
    }
  }
}
