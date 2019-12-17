import { SoService, Service, Autowired } from "./../../dist";
import { TestNewService } from "./testNew.service";

@Service
export class TestService extends SoService {
  @Autowired
  private testNewService: TestNewService;
  public async query(): Promise<string> {
    console.log(await this.db.mysql.exec("select * from test", []));
    return "aaa";
  }
}
