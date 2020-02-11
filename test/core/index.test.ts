import { describe, it, before, after } from "mocha";
import { expect } from "chai";
import SoServer from "../../dist";
import {
  _Config,
  _Controller,
  _Middleware,
  _Plugin,
  _Service,
  BeforeMiddleware,
} from "../../dist/decorator/inject";
import { Curl } from "../../dist/plugins/curl";

const curl = new Curl();

describe("Test core", function() {
  let server: SoServer;
  before(function() {
    server = new SoServer({
      baseDir: __dirname,
    });
    server.Listen(8199);
  });

  it("Test Controller IOC Inject", async function() {
    expect(_Controller.size).equals(1);
  });

  it("Test Config IOC Inject", async function() {
    expect(_Config.size).equals(2);
  });

  it("Test Plugin IOC Inject", async function() {
    expect(_Plugin.size).equals(3);
  });

  it("Test Service IOC Inject", async function() {
    expect(_Service.size).equals(1);
  });

  it("Test Service", async function() {
    const result = await curl.get("http://127.0.0.1:8199");
    expect(result).equals("Test Service Success");
  });

  it("Test Controller", async function() {
    const result = await curl.get("http://127.0.0.1:8199/controller");
    expect(result).equals("Test Controller Success");
  });

  it("Test Config", async function() {
    const result = await curl.get("http://127.0.0.1:8199/config");
    const obj = JSON.parse(result);
    expect(JSON.stringify(obj.db)).equals(
      JSON.stringify({
        host: "127.0.0.1",
        port: 3306,
      })
    );
  });

  after(function() {
    server.close();
  });
});
