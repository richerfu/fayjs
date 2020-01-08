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
  Plugin
} from "./decorator/Decorator";
import { Injected, Provided, Inject } from "./decorator/Inject";
import { SoController, SoMiddleware, SoService } from "./decorator/Context";
import Logger from "./utils/Logger";
import {
  RequestQuery,
  RequestContext,
  RequestBody,
  RequestParams,
  Body,
  RequestHeader,
  RouteMiddleware,
} from "./decorator/ParamterDecorator";
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
  Plugin
};
