import { iocContainer } from "../decorator/Inject";

interface PluginConfig {
  controller?: boolean;
  service?: boolean;
  middleware?: boolean;
  config: Object;
}

export class PluginLoader {
  private pluginMap: Map<string, any> = new Map();
  private appConfig: any;
  private pluginConfig: PluginConfig = {
    controller: true,
    service: true,
    middleware: false,
    config: {},
  };

  public constructor(config: Object) {
    this.appConfig = config;
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
      const pluginInstance = config.main.call(config.instance, this.appConfig);
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

  public async getPlugin(): Promise<Map<string, any>> {
    return this.pluginMap;
  }
}
