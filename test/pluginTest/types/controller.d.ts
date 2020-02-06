import { SoController } from 'iqy-server';
  import { TestPlugin } from '/home/southorange/project/node_project/iqy-server/test/pluginTest/test.plugin'; 
undefined
  declare module 'iqy-server' {
    interface SoController {
      TestPlugin: TestPlugin; 
wss: SocketServer; 

    }
  }
  