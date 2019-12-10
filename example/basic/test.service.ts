import {SoService,Service } from './../../src/core'

@Service
export class TestService extends SoService {
  async query(): Promise<string>{
    return "aaa"
  }
}