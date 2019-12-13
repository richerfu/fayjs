import { SoService, Service, Autowired } from "./../../dist/core";
import { TestNewService } from "./testNew.service";

@Service
export class TestService extends SoService {
  @Autowired
  private testNewService: TestNewService;
  public async query(): Promise<string> {
    console.log(this);
    return "aaa";
  }
}
