import { Plugin, SoPlugin } from "iqy-server";

@Plugin("testPlugin")
export class TestPlugin implements SoPlugin {
  public app: any;
  public config: any;

  public start() {}
}
