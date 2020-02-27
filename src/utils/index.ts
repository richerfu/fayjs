import { networkInterfaces } from "os";

export const getRestfulMap = (
  key: any,
  target: ClassDecorator
): WeakMap<ClassDecorator, string | Map<string, any> | Set<string | any>> => {
  let restfulMap = Reflect.getMetadata(key, target);
  if (!restfulMap) {
    restfulMap = new WeakMap();
  }
  return restfulMap;
};

export const getRestfulParameterMap = (key: any, map: any): Map<any, any> => {
  let parameterMap = map.get(key);
  if (!parameterMap) {
    parameterMap = new Map();
  }
  return parameterMap;
};

export const getRestfulParameterSet = (
  map: any,
  type: string
): Set<string | any> => {
  let set = map.get(type);
  if (!set) {
    set = new Set();
  }
  return set;
};

/**
 * get function parameter name
 * 获取函数参数名
 * @param fn Function
 */
export const getFunctionParameterName = (fn: Function) => {
  if (typeof fn !== "object" && typeof fn !== "function") return;
  const COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;
  const DEFAULT_PARAMS = /=[^,)]+/gm;
  const FAT_ARROWS = /=>.*$/gm;
  let code = fn.prototype ? fn.prototype.constructor.toString() : fn.toString();
  code = code
    .replace(COMMENTS, "")
    .replace(FAT_ARROWS, "")
    .replace(DEFAULT_PARAMS, "");
  let result = code
    .slice(code.indexOf("(") + 1, code.indexOf(")"))
    .match(/([^\s,]+)/g);
  return result === null ? [] : result;
};

/**
 * get local id address(ipv4)
 */
export const getLocalIPAddress = () => {
  var interfaces = networkInterfaces();
  for (var devName in interfaces) {
    const iface = interfaces[devName];
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i];
      if (
        alias.family === "IPv4" &&
        alias.address !== "127.0.0.1" &&
        !alias.internal
      ) {
        return alias.address;
      }
    }
  }
};

/**
 * format date to YYYY-MM-DD HH:mm:ss
 * @param date Date
 */
export const getFormatTime = (date?: Date): string => {
  const newDate = date ? new Date(date) : new Date();
  const currentDate = `${newDate.getFullYear()}-${newDate.getMonth() +
    1}-${newDate.getDate()} ${newDate.getHours()}:${newDate.getMinutes()}:${newDate.getSeconds()}`;
  return currentDate;
};
