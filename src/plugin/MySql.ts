import { DbClient, Db } from "iqy-mysql";
import { Connection, Pool } from "mysql";

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
    if (config.client && config.clients) {
      throw new Error(
        `clients and client are existed.please delete client field`
      );
    }
    if (config.client) {
      this.dbClient = new DbClient();
      this.dbClient.createClient("mysql", config.client);
    } else {
      this.dbClient = new DbClient(config.clients);
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
      console.log(db)
      return db;
    }
  }
}
