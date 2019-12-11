import { Config } from "../../src/core";

@Config("dev")
export class TestConfig {
  baseDir: string = __dirname
}
