export const CONTROL = '@@CONTROL';
export const control_reg = new RegExp(`^${CONTROL}`);
export const SERVICE = '@@SERVICE';
export const AUTOWIRED = '@@AUTOWIRED';
export const autowired_reg = new RegExp(`^${AUTOWIRED}@@`);
export const RESTFUL = '@@RESTFUL';
export const restful_reg = new RegExp(`^${RESTFUL}`);
export const MIDDLEWARE = '@@MIDDLEWARE';
export const middleWare_reg = new RegExp(`^${MIDDLEWARE}`);
export const WEBSOCKET = '@@WEBSOCKET';
export const websocket_reg = new RegExp(`^${WEBSOCKET}`);
export const ERROR = '@@ERROR'
export const error_reg = new RegExp(`^${ERROR}`)

export type RestfulMethodType = 'get' | 'post' | 'put' | 'patch' | 'delete';
