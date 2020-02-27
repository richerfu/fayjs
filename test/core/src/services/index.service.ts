import { Service } from "../../../../dist";

@Service
export class TestService {
  async index():Promise<any>{
    return "Test Service Success"
  }
}