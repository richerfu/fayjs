import { SoService, Service } from "../../dist";

@Service
export class TestService extends SoService {
  public async query(): Promise<string> {
    console.log(await this.db.mysql.exec("select * from test", []));
    return "aaa";
  }
}
