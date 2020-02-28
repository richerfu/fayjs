import {
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Config,
  Middleware,
  Service,
  Controller,
  Autowired,
  Plugin,
} from "./decorator/decorator";
import {
  BaseMiddleware,
  BasePlugin,
  BaseController,
  BaseService,
} from "./decorator/baseInterface";
import {
  RequestQuery,
  RequestContext,
  RequestBody,
  RequestParams,
  Body,
  RequestHeader,
  RouteMiddleware,
} from "./decorator/paramterDecorator";
import Fay from "./core";

export default Fay;

export {
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Config,
  Middleware,
  Service,
  Controller,
  Autowired,
  RequestBody,
  RequestContext,
  RequestParams,
  RequestQuery,
  RequestHeader,
  RouteMiddleware,
  Body,
  Plugin,
  BaseMiddleware,
  BasePlugin,
  BaseController,
  BaseService,
};
