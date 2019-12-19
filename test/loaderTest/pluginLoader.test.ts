import { describe, it } from "mocha";
import { expect } from "chai";
import { PluginLoader } from "../../dist/loader/PluginLoad";
import { DbLoader } from "../../dist/plugin/MySql";
import { Curl } from "../../dist/plugin/Curl";

describe("Test PluginLoader", function() {
  const curl = new Curl();
  const config = {
    mysql: {
      enable: true,
      client: {
        host: "127.0.0.1",
        port: 3306,
        user: "root",
        password: "fuyu6666",
        database: "test_sql",
      },
    },
    plugins: {
      config: {},
    },
  };
  const pluginLoader: PluginLoader = new PluginLoader(config);

  config.plugins.config["curl"] = {
    instance: null,
    main: () => {
      return curl;
    },
  };

  it("Test InitPlugin Method", async function() {
    await pluginLoader.init(config.plugins);
    const plugins = await pluginLoader.getPlugin();
    expect(plugins.size).equals(1);
  });

  it("Test AddPlugin Method", async function() {
    const dbLoader: DbLoader = new DbLoader(config.mysql);
    await dbLoader.init();
    await pluginLoader.addPlugin("db", {
      instance: dbLoader,
      main: dbLoader.LoaderDb,
    });
    const plugins = await pluginLoader.getPlugin();
    expect(plugins.size).equals(2);
  });
});
