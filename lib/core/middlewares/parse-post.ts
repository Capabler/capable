/**
 * 处理post请求的解析
 */

import bodyParser from 'koa-bodyparser';

export default (app: any) =>
  app.use(
    bodyParser({
      onerror: (err, ctx) => {
        ctx.throw('body parse error', 422);
      },
    }),
  );
