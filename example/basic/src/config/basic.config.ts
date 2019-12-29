import { Config } from "iqy-server";

@Config("dev")
export class TestConfig {
  public mysql = {
    enable: true,
    client: {
      host: "127.0.0.1",
      port: 3306,
      user: "root",
      password: "Your Password",
      database: "test_sql",
    },
  };
}
