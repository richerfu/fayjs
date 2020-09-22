import { Service } from "../../../../dist";

@Service
export class TestService {
  public async test() {
    return "Test Service Success";
  }
}
