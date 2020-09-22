import { describe, it, before, after } from "mocha";
import { expect } from "chai";
import Fay, { fayContainer } from "../../dist";
import { TestMiddleware } from "./src/middlewares/index.middleware";
import * as TYPES from "../../dist/container/type";

// describe("Test core", function() {
//   let server: Fay;
//   before(function() {
//     server = new Fay({
//       baseDir: __dirname,
//     });
//     server.Listen(8199);
//   });

//   it("Test Container", () => {
//     console.log(fayContainer.get(TYPES.TYPES.MiddlewareType));
//   });

//   after(function() {
//     server.close();
//   });
// });

const server = new Fay({
  baseDir: __dirname,
});

server.Listen(8199);
