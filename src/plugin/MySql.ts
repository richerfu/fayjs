import { DbClient, Db } from "iqy-mysql";
import logger from "../utils/Logger";
import { Plugin } from "../decorator/Decorator";

interface Config {
  enable: boolean;
  client?: Object;
  clients?: Object;
}

interface DbInstance {
  [propName: string]: Db;
}

export class DbLoader {
  private dbClient: DbClient;
  private config: Config;
  public constructor(config: Config) {
    this.config = config;
  }

  public async init(): Promise<any> {
    try {
      if (!this.config) {
        return;
      }
      this.dbClient = new DbClient();
      if (this.config.client && this.config.clients) {
        throw new Error(
          `clients and client are existed.please delete client field`
        );
      }
      if (this.config.client) {
        await this.dbClient.createClient("mysql", this.config.client);
      }
      if (this.config.clients) {
        await this.dbClient.init(this.config.clients);
      }
    } catch (e) {
      logger.error(e);
    }
  }

  public LoaderDb(config?: Config): { [key: string]: Db } {
    let db: DbInstance = {};
    if (this.config.client) {
      db.mysql = new Db(this.dbClient.getClient("mysql"));
      return db;
    } else {
      Object.keys(this.config.clients).forEach(item => {
        db[item] = new Db(this.dbClient.getClient(item));
      });
      return db;
    }
  }
}

@Plugin("db")
export class MySQL {
  private config: any;
  private app: any;
  private dbLoader: DbLoader;
  private db: {
    [key: string]: Db;
  };

  constructor(config: any, app: any) {
    this.config = config;
    this.app = app;
    if (config && config.mysql) {
      this.dbLoader = new DbLoader(config.mysql);
      this.dbLoader.init().then(() => {
        this.db = this.dbLoader.LoaderDb(config.mysql);
      });
    }
  }

  /**
   * 获取单数据库
   */
  public get mysql(): Db {
    return this.db.mysql;
  }

  /**
   * 获取多数据源对应的数据库实例
   * @param key string db key
   */
  public get(key: string): Db {
    return this.db[key];
  }
}
