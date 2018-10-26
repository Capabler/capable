import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import session from 'koa-session';
import staticServer from 'koa-static';
import path from 'path';
import { IGlobal } from '../types/global';
import Controller from './controller';
import DelicateCore from './delicate';
import DelicateModel from './model';

const dir = process.cwd();

const { port, source, templates, template_engine } = require(path.join(
  dir,
  'config/config.js',
));

const app = new Koa();
const router = new Router();

// 全局注册公共方法
DelicateCore(app);
DelicateModel(app);

/**
 * 入口中间件
 * 主要初始化参数和通用方法
 * 捕获错误，处理错误
 */
app.use(async (ctx, next) => {
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

/**
 * 处理post请求的解析
 */
app.use(
  bodyParser({
    onerror: (err, ctx) => {
      ctx.throw('body parse error', 422);
    },
  }),
);

/**
 * 增加session功能
 */
app.use(
  session(
    {
      key: 'koa:sess',
      maxAge: 86400000,
      overwrite: true,
      httpOnly: true,
      signed: false,
      rolling: true,
      renew: false,
    },
    app,
  ),
);

/**
 * 注册模板
 */
if (templates && template_engine) {
  templates[template_engine].render(app);
}

/**
 * 静态资源访问权限
 */
if (source) {
  app.use(staticServer(source));
}

/**
 * 路由未匹配到捕获
 */
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    if (error !== 'method not allowed') {
      throw error;
    }
  }
});

/**
 * 注册控制器
 */
Controller(router);

/**
 * 注册路由
 */
app.use(router.routes());

/**
 * 启动服务器
 */
app.listen(port, () => {
  console.log('> http://localhost:' + port);
});
