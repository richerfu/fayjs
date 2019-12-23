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
} from "./decorator/Decorator";
import { Inject } from "./decorator/Inject";
import { SoController, SoMiddleware, SoService } from "./decorator/Context";
import Logger from "./utils/Logger";
import {
  RequestQuery,
  RequestContext,
  RequestBody,
  RequestParams,
  Body,
  RequestHeader,
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
  Body,
  Inject,
};
