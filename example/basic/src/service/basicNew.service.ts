import { SoService, Service, Autowired } from "iqy-server";
import { TestService } from "./basic.service";

@Service
export class TestNewService extends SoService {
  @Autowired
  private testService: TestService;
  public async query(): Promise<string> {
    return "aaa";
  }
}
