import { SoService, Service, Autowired } from "iqy-server";
import { TestNewService } from "./basicNew.service";

@Service
export class TestService extends SoService {
  @Autowired
  private testNewService: TestNewService;

  public async query(): Promise<string> {
    return "aaa";
  }
}
