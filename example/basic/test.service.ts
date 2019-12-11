import {SoService,Service } from './../../dist/core'

@Service
export class TestService extends SoService {
  async query(): Promise<string>{
    return "aaa"
  }
}
