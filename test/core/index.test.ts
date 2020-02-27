import { describe, it, before, after } from "mocha";
import { expect } from "chai";
import SoServer from "../../dist";
import {
  _Config,
  _Controller,
  _Middleware,
  _Plugin,
  _Service,
  _UserDefineMiddleware,
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

  it("Test Middleware IOC Inject", async function() {
    expect(_Middleware.size).equals(2);
    expect(Array.from(_UserDefineMiddleware).length).equals(2);
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

  it("Test Koa-body", async function() {
    const result = await curl.init({
      url: "http://127.0.0.1:8199/formdata",
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      formData: {
        username: 123,
        password: 123,
      },
    });
    expect(result).equals(
      JSON.stringify({
        username: "123",
        password: "123",
      })
    );
  });

  it("Test RequestBody Decorator", async function() {
    const result = await curl.init({
      url: "http://127.0.0.1:8199/testrequestbody",
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      formData: {
        username: 123,
        password: 123,
      },
    });
    expect(result).equals("123");
  });

  it("Test Body Decorator", async function() {
    const result = await curl.init({
      url: "http://127.0.0.1:8199/testrequestbodys",
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      formData: {
        username: 123,
        password: 123,
      },
    });
    expect(result).equals(
      JSON.stringify({
        username: "123",
        password: "123",
      })
    );
  });

  after(function() {
    server.close();
  });
});
