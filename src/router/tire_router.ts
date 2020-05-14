import { METHODS } from "http";
import { TireTreeNode } from "./tire_router_node";
import { RouterLoaderError, RouterNotMatch } from "../error/router_error";
import { HttpError } from "../error/http_error";

interface RouteMatchHandleResult {
  handle: any;
  params: any[];
}

const NOT_FOUND: RouteMatchHandleResult = { handle: null, params: [] };

class TireRouter {
  /**
   * trie router tree root
   */
  private root: Map<string, TireTreeNode> = new Map();
  public constructor() {
    if (!(this instanceof TireRouter)) {
      return new TireRouter();
    }
  }

  /**
   * register router
   * @param method string
   * @param path string
   * @param handle Function[]
   */
  public on(method: string, path?: string, ...handle: Function[]) {
    if (path[0] !== "/") {
      throw new RouterLoaderError("path must begin with '/' in path");
    }
    if (!this.root.get(method)) {
      this.root.set(method, new TireTreeNode());
    }
    this.root.get(method).addRoute(path, handle);
    return this;
  }

  /**
   * register get method router
   * @param path string
   * @param arg Function[]
   */
  public get(path: string, ...arg: Function[]) {
    return this.on("GET", path, ...arg);
  }

  /**
   * register get method router
   * @param path string
   * @param arg Function[]
   */
  public put(path: string, ...arg: Function[]) {
    return this.on("PUT", path, ...arg);
  }

  /**
   * register post method router
   * @param path string
   * @param arg Function[]
   */
  public post(path: string, ...arg: Function[]) {
    return this.on("POST", path, ...arg);
  }

  /**
   * register delete method router
   * @param path string
   * @param arg Function[]
   */
  public delete(path: string, ...arg: Function[]) {
    return this.on("DELETE", path, ...arg);
  }

  /**
   * register head method router
   * @param path string
   * @param arg Function[]
   */
  public head(path: string, ...arg: Function[]) {
    return this.on("HEAD", path, ...arg);
  }

  /**
   * register patch method router
   * @param path string
   * @param arg Function[]
   */
  public patch(path: string, ...arg: Function[]) {
    return this.on("PATCH", path, ...arg);
  }

  /**
   * register options method router
   * @param path string
   * @param arg Function[]
   */
  public options(path: string, ...arg: Function[]) {
    return this.on("OPTIONS", path, ...arg);
  }

  /**
   * register trace method router
   * @param path string
   * @param arg Function[]
   */
  public trace(path: string, ...arg: Function[]) {
    return this.on("TRACE", path, ...arg);
  }

  /**
   * register connect method router
   * @param path string
   * @param arg Function[]
   */
  public connect(path: string, ...arg: Function[]) {
    return this.on("CONNECT", path, ...arg);
  }

  /**
   * register all method router
   * @param path string
   * @param arg Function[]
   */
  public all(path: string, ...arg: Function[]) {
    METHODS.forEach(method => {
      this.on(method, path, ...arg);
    });
    return this;
  }

  /**
   * get router handler and params
   * @param method string
   * @param path string
   */
  public find(method: string, path: string) {
    const tree = this.root.get(method);
    if (tree) {
      return tree.search(path);
    }
    return NOT_FOUND;
  }
}

export const tireRouter = new TireRouter();
