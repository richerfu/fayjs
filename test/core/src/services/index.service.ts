import { Service, SoService } from "../../../../dist";

@Service
export class TestService extends SoService {
  async index():Promise<any>{
    return "Test Service Success"
  }
}