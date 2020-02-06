import { describe, it, before, after } from "mocha";
import { expect } from "chai";
import SoServer from "./../../dist/index";
import { Curl } from "../../dist/plugins/Curl";

describe("Test Curl Plugin", function() {
  let curl = new Curl();
  before(function() {
    const server: SoServer = new SoServer({
      baseDir: __dirname,
    });
    server.Listen(8199);
  });

  it("Test Curl Get Method", async function() {
    const result = await curl.get("http://127.0.0.1:8199");
    expect(result).equals("Test Get Method Success");
  });

  it("Test Curl Post Method", async function() {
    const result = await curl.post("http://127.0.0.1:8199/test");
    expect(result).equals("Test Post Method Success");
  });

  it("Test Curl Init Method", async function() {
    const getResult = await curl.init({
      method: "get",
      url: "http://127.0.0.1:8199",
    });
    expect(getResult).equals("Test Get Method Success");
    const postResult = await curl.init({
      method: "post",
      url: "http://127.0.0.1:8199/test",
    });
    expect(postResult).equals("Test Post Method Success");
  });

  after(async function() {});
});
