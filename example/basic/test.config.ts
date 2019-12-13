import { Config } from "./../../dist/core";

@Config("dev")
export class TestConfig {
  public baseDir: string = __dirname;
}
