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
import { Injected, Provided, Inject } from "./decorator/inject";
import {
  SoController,
  SoMiddleware,
  SoService,
  SoPlugin,
} from "./decorator/context";
import Logger from "./utils/logger";
import {
  RequestQuery,
  RequestContext,
  RequestBody,
  RequestParams,
  Body,
  RequestHeader,
  RouteMiddleware,
} from "./decorator/paramterDecorator";
import SoServer from "./core";

export default SoServer;

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
  SoController,
  SoMiddleware,
  SoService,
  Logger,
  RequestBody,
  RequestContext,
  RequestParams,
  RequestQuery,
  RequestHeader,
  RouteMiddleware,
  Body,
  Injected,
  Provided,
  Inject,
  Plugin,
  SoPlugin,
};
