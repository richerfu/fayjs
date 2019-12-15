// import { parse } from "querystring";
// import * as Koa from "koa";

// export class Parser {
//   private options: any;

//   public constructor(options?: any) {
//     this.options = options;
//   }

//   public async parsePostData(ctx: Koa.Context): Promise<any> {
//     const postData: Uint8Array[] = await new Promise((resolve, reject) => {
//       try {
//         let postdata: Uint8Array[] = Uint8Array.alloc(
//           this.options
//             ? this.options.limit
//               ? this.options.limit
//               : 1024 * 56
//             : 1024 * 56
//         );
//         ctx.req.addListener("data", data => {
//           postdata = postdata.concat(data);
//         });
//         ctx.req.addListener("end", () => {
//           resolve(postdata);
//         });
//       } catch (err) {
//         reject(err);
//       }
//     });

//     console.log(postData.toJSON());

//     const postType: string = ctx.req.headers["content-type"];
//     switch (postType) {
//       case "application/x-www-form-urlencoded": {
//         break;
//       }
//       case "multipart/form-data": {
//         break;
//       }
//       case "application/json": {
//         return parse(postData.toString());
//         break;
//       }
//       default: {
//         break;
//       }
//     }
//   }
// }
