import { Plugin, BasePlugin } from "../../../../dist";

@Plugin("pluginsA")
export class TestPlugin implements BasePlugin{
  public app:any;
  public config:any;

  public start(){
    
  }
}