import { Plugin, SoPlugin } from "../../../../dist";

@Plugin("pluginsA")
export class TestPlugin implements SoPlugin{
  public app:any;
  public config:any;

  public start(){
    
  }
}