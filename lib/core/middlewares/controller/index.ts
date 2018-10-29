/**
 * 注册控制器
 */
import Router from 'koa-router';
import Controller from './controller';

export default (app: any): void => {
  app.use(async (ctx: any, next: any) => {
    try {
      await next();
    } catch (error) {
      if (error !== 'method not allowed') {
        throw error;
      }
    }
  });

  const router = new Router();
  Controller(router);
  app.use(router.routes());
};
