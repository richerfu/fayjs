import { Service, BaseService } from "../../../../dist";

@Service
export class TestService extends BaseService {
  async index():Promise<any>{
    return "Test Service Success"
  }
}