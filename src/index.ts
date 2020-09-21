import "reflect-metadata";

import {
  Config,
  Middleware,
  Service,
  Controller,
  Autowired,
  Plugin,
} from "./decorator/decorator";
import { Get, Post, Put, Delete, Patch } from "./decorator/http_decorator";
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
import { FastScanner, Logger } from "./tools/index";
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
  FastScanner,
  Logger,
};
