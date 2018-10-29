/**
 * 入口中间件
 * 主要初始化参数和通用方法
 * 捕获错误，处理错误
 */
import { IGlobal } from '../../types/global';

export default (app: any) => {
  app.use(async (ctx: any, next: any) => {
    try {
      // 初始化数据信息
      const cookieHeader = ctx.headers.cookie;
      const cookie: any = {};
      if (cookieHeader) {
        const cookies: any = cookieHeader.split(';');
        cookies.forEach((item: any) => {
          const crumbs = item.split('=');
          if (crumbs.length > 1) {
            cookie[crumbs[0].trim()] = crumbs[1].trim();
          }
        });
      }
      (global as IGlobal).setcookie = (name: any, value: any, options = {}) => {
        ctx.cookies.set(name, value, options);
      };
      (global as IGlobal).$_COOKIE = cookie;
      (global as IGlobal).$_SESSION = ctx.session;

      ctx.set('X-Powered-By', 'DelicateJS');

      // 执行核心操作
      await next();

      // 关闭数据库链接
      (global as IGlobal).emitter.emit('close.database');

      // 清除预置参数
      (global as IGlobal).emitter.removeAllListeners();
    } catch (err) {
      // 关闭数据库链接
      (global as IGlobal).emitter.emit('close.database');

      // 清除预置参数
      (global as IGlobal).emitter.removeAllListeners();

      let status = 500;

      if (err.code === 'ECONNREFUSED') {
        status = 503;
      }

      ctx.status = err.status || status || 500;
      ctx.body = {
        code: 400, // code码为400表示错误异常了
        msg: err.message || err.code,
      };
    }
  });
};
