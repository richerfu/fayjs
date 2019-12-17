import { DbClient, Db } from "iqy-mysql";
import logger from "../utils/Logger";

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
      this.dbClient = new DbClient();
      if (this.config.client && this.config.clients) {
        throw new Error(
          `clients and client are existed.please delete client field`
        );
      }
      if (this.config.client) {
        await this.dbClient.createClient("mysql", this.config.client);
      } else {
        await this.dbClient.init(this.config.clients);
      }
    } catch (e) {
      logger.error(e);
    }
  }

  public LoaderDb(): { [key: string]: Db } {
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
