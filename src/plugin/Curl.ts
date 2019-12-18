import * as request from "request";

export class Curl {
  /**
   * send custom request
   * @param options request options
   */
  public async init(options?: request.Options): Promise<any> {
    const result = await new Promise((s, j) => {
      request(options, (e, resp, body) => {
        if (e) {
          j(e);
        }
        if (resp.statusCode !== 200) {
          j(e);
        }
        s(body);
      });
    });
    return result;
  }

  /**
   * send get request
   * @param url request url
   * @param options request options
   */
  public async get(url: string, options?: request.Options): Promise<any> {
    const result = await new Promise((s, j) => {
      request.get(
        {
          url,
          ...options,
        },
        (e, resp, body) => {
          if (e) {
            j(e);
          }
          if (resp.statusCode !== 200) {
            j(e);
          }
          s(body);
        }
      );
    });
    return result;
  }

  /**
   * send post request
   * @param url request url
   * @param data request data
   * @param options request options
   */
  public async post(
    url: string,
    data?: any,
    options?: request.Options
  ): Promise<any> {
    const result = await new Promise((s, j) => {
      request.post(
        {
          url,
          body: data,
          ...options,
        },
        (e, resp, body) => {
          if (e) {
            j(e);
          }
          if (resp.statusCode !== 200) {
            j(e);
          }
          s(body);
        }
      );
    });
    return result;
  }
}
