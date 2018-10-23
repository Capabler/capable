import path from 'path';
import fs from 'fs';
import { IGlobal } from '../types/global';

import Sequelize from '../database/sequelize';
import Lokijs from '../database/lokijs';

const dir = process.cwd();
const { templates } = require(path.join(dir, 'config/config.js'));

export default class {
  private app: any;
  private ctx: any;
  private models: any;
  private databases: any;

  constructor(app: any, ctx: any, loadedModels = []) {
    this.app = app;
    this.ctx = ctx;
    this.models = [...loadedModels];
    this.databases = [];
  }

  /**
   *
   * 动态加载model,并将model的文件名作为对象名传给this对象
   */
  public model(name: any) {
    const modelFile = path.join(dir, 'models', name + '.js');
    if (fs.existsSync(modelFile) && this.models.indexOf(name) === -1) {
      const Model = require(modelFile);
      (global as IGlobal).emitter.emit('load.model', name, new Model(this.ctx));
    }
  }

  /**
   * 动态创建数据库连接对象，并返回数据库连接对象
   */
  public database(db: any): any {
    const { database_engine } = require(path.join(dir, 'config/config.js'));
    const databases = require(path.join(dir, 'config/database.js'));

    let config;
    // 判断使用的数据库引擎
    switch (database_engine) {
      case 'sequelize':
        config = databases.sequelize[db];
        if (config) {
          return new Sequelize(config);
        } else {
          throw 'sequelize的' + db + '不存在';
        }

      case 'lokijs':
        config = databases.lokijs[db];
        if (config) {
          return new Lokijs(config);
        } else {
          throw 'lokijs的' + db + '不存在';
        }

      default:
        break;
    }
  }

  /**
   * 动态注册模板引擎
   */
  public template(templateName: any) {
    this.app.context.render = null;
    if (templates[templateName]) {
      templates[templateName].render(this.app);
      (global as IGlobal).emitter.emit('load.template', templateName);
    }
  }
}
