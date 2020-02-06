import { SoController } from "iqy-server";
import { TestPlugin } from "/home/southorange/project/node_project/iqy-server/example/basic/src/plugins/test.plugin";
import { TestBPlugin } from "/home/southorange/project/node_project/iqy-server/example/basic/src/plugins/testb.plugin";

declare module "iqy-server" {
  interface SoController {
    testPlugin: TestPlugin;
    testPluginB: TestBPlugin;
  }
}
