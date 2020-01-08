import "reflect-metadata";
import * as Koa from "koa";
import { join } from "path";
import { iocContainer, _Plugin } from "../decorator/Inject";
import { PLUGIN, Name } from "../decorator/Constants";
import {
  GeneratorProp,
  FinalTemplate,
  writeTypingsFile,
  MkdirFolder,
} from "../utils/helper";
interface PluginConfig {
  controller?: boolean;
  service?: boolean;
  middleware?: boolean;
  config: Object;
}

export class PluginLoader {
  private pluginMap: Map<string, any> = new Map();
  private appConfig: any;
  private baseDir: string;
  private pluginConfig: PluginConfig = {
    controller: true,
    service: true,
    middleware: false,
    config: {},
  };
  private _app: Koa;

  public constructor(baseDir: string, config: Object, app: Koa) {
    this.baseDir = baseDir;
    this.appConfig = config;
    this._app = app;
  }
  /**
   * init all plugin
   * @param config plugin config
   * {
   *    controller: [boolean],
   *    service: [boolean],
   *    middleware: [boolean],
   *    config:{
   *      db:{
   *        instance: [Object],
   *        main: [Function]
   *      }
   *    }
   * }
   */
  public async init(pluginConfig: PluginConfig): Promise<any> {
    if (JSON.stringify(pluginConfig) === "{}") {
      return;
    }
    try {
      Object.assign(this.pluginConfig, pluginConfig);
      Object.keys(pluginConfig.config).forEach(key => {
        if (
          !pluginConfig.config[key] ||
          pluginConfig.config[key].instance === undefined ||
          !pluginConfig.config[key].main
        ) {
          throw new Error(
            `Plugin config ${key} fields must have instance(Object) and main(Function)`
          );
        }
        const pluginInstance = pluginConfig.config[key].main.call(
          pluginConfig.config[key].instance,
          this._app,
          this.appConfig
        );
        this.pluginMap.set(key, pluginInstance);
      });
    } catch (e) {
      console.log(e);
    }
  }

  public async addPlugin(
    key: string,
    config: { instance: any; main: Function }
  ): Promise<any> {
    this.pluginConfig.config[key] = config;
    if (this.pluginMap.get(key)) {
      throw new Error(
        `Add Plugin Error: key(${key}) is exited,please change it`
      );
    }
    if (config.instance === undefined || !config.main) {
      throw new Error(
        `Plugin config fields must have type(interface) and main(Function)`
      );
    }
    try {
      const pluginInstance = config.main.call(
        config.instance,
        this._app,
        this.appConfig
      );
      this.pluginMap.set(key, pluginInstance);
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * load all plugin to controller | service | middleware
   */
  public async load(
    type: "controller" | "middleware" | "service",
    instances: Set<Function | any>
  ): Promise<any> {
    try {
      if (this.pluginConfig[type]) {
        for (const instance of instances) {
          const iocInstance = iocContainer.get(instance);
          this.pluginMap.forEach((plugin, pluginKey) => {
            iocInstance[pluginKey] = plugin;
          });
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  public async autoLoadPlugin(
    type: "controller" | "middleware" | "service",
    instances: Set<Function | any>
  ): Promise<any> {
    try {
      if (this.pluginConfig[type]) {
        for (const instance of instances) {
          const iocInstance = iocContainer.get(instance);
          let prop = "";
          _Plugin.forEach(plugin => {
            const nameKey = Reflect.getMetadata(PLUGIN, plugin);
            const pluginInstance = new plugin(this.appConfig, this._app);
            console.log(plugin.name);
            iocInstance[nameKey] = pluginInstance;
            prop += GeneratorProp(nameKey, plugin.name);
          });
          console.log(Name[type]);
          const template = FinalTemplate(Name[type], prop);
          const folderName = join(this.baseDir, `./src`);
          await MkdirFolder(folderName);
          await MkdirFolder(join(folderName, "./typings"));
          await writeTypingsFile(
            join(folderName, "./typings", `./${type}.d.ts`),
            template
          );
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * 生成types文件
   */
  public createTypes(): void {}

  public async getPlugin(): Promise<Map<string, any>> {
    return this.pluginMap;
  }
}
