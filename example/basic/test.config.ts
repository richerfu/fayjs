import { Config } from "./../../dist/core";

@Config("dev")
export class TestConfig {
  baseDir: string = __dirname
}
