import { Plugin, SoPlugin } from "iqy-server";

@Plugin("testPluginB")
export class TestBPlugin implements SoPlugin {
  public app: any;
  public config: any;

  public start() {}
}
