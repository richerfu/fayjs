import { DbClient } from "iqy-mysql";

interface Config {
  enable: boolean;
  client?: Object;
  clients?: Object;
}

class DbLoader {
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

  public async LoaderDb(): Promise<any> {
    if (this.config.client) {
      return await Promise.resolve(this.dbClient.getClient("mysql"));
    } else {
      let db: Map<string, any> = new Map<string, any>();
      Object.keys(this.config.clients).forEach(item => {
        db.set(item, this.dbClient.getClient(item));
      });
      return await Promise.resolve(db);
    }
  }
}
