import Koa from 'koa';
import path from 'path';
import Socket from './socket';
import DelicateCore from './delicate';
import DelicateModel from './model';

import EntryMiddle from './middlewares/entry';
import ParsePostMiddle from './middlewares/parse-post';
import SessionMiddle from './middlewares/session';
import ControllerMiddle from './middlewares/controller';

const { port } = require(path.join(process.cwd(), 'config/config.js'));

const app = new Koa();

// 全局注册公共方法
DelicateCore(app);
DelicateModel(app);

// 挂载中间件
EntryMiddle(app);
ParsePostMiddle(app);
SessionMiddle(app);
ControllerMiddle(app);

/**
 * 启动服务器
 * 如果设置了socket，则启动socket服务
 */
Socket(app).listen(port, () => {
  console.log('> http://localhost:' + port);
});
