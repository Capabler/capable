import fs from 'fs';
import path from 'path';
import events from 'events';
import Loader from './loader';
import { IGlobal } from '../types/global';
const dir = process.cwd();

const {
  subclass_prefix,
  template_engine,
  templates,
  models = [],
} = require(path.join(dir, 'config/config.js'));

export default (app: any) => {
  process.setMaxListeners(0);

  (global as IGlobal).$_POST = {};
  (global as IGlobal).$_GET = {};
  (global as IGlobal).$_COOKIE = {};
  (global as IGlobal).$_SESSION = {};

  (global as IGlobal).emitter = new events.EventEmitter();
  (global as IGlobal).setcookie = Function;

  let _MethodNotAllowedCallback: any = null;

  (global as IGlobal).DJ_Controller = class {
    private ctx: any;
    private load: any;
    private template_engine: any;
    private method: any;

    constructor(ctx: any) {
      this.ctx = ctx;

      const loadedModels: any = [];
      // 加载默认model
      if (models.length) {
        models.map((modelName: any) => {
          const modelFile = path.join(dir, 'models', modelName + '.js');
          if (fs.existsSync(modelFile)) {
            const Model = require(modelFile);
            (this as any)[modelName] = new Model(ctx);
            loadedModels.push(modelName);
          }
        });
      }

      this.load = new Loader(app, ctx, loadedModels);
      // 动态修改的模板引擎
      this.template_engine = null;

      const dbModels: any = [];
      const dbNames: any = [];
      // 加载model
      (global as IGlobal).emitter.on('load.model', (name: any, model: any) => {
        dbModels.push(name);
        const modelKeys = Object.keys(model);
        modelKeys.map((item) => {
          if (!(this as any)[item]) {
            dbNames.push(item);
          }
        });
        (this as any)[name] = model;
      });

      // 加载模板
      (global as IGlobal).emitter.on('load.template', (engine: any) => {
        this.template_engine = engine;
      });

      // 关闭数据库
      (global as IGlobal).emitter.on('close.database', () => {
        dbModels.map((item: any) => {
          dbNames.map((db: any) => {
            (this as any)[item][db].sequelize.close();
          });
        });
      });

      this.judgeMethod();
    }

    public MethodNotAllowed(cb = null) {
      _MethodNotAllowedCallback = cb;
    }

    // 请求方式的判断
    public judgeMethod() {
      let methods: any = [];

      // 一个接口适应多个请求方式
      this.method = async function() {
        methods = (Object as any).values(arguments);
        if (methods.length < 2) {
          if (methods.length) {
            throw {
              message: `this.method的方法至少接受两个参数，请使用this.method.${
                methods[0]
              }()`,
            };
          } else {
            throw { message: `this.method的参数不能为空` };
          }
        }
        if (
          methods.indexOf(this.ctx.request.method.toLocaleLowerCase()) === -1
        ) {
          if (_MethodNotAllowedCallback) {
            await _MethodNotAllowedCallback();
          }
          throw 'method not allowed';
        }
      };

      // 可以执行回调
      ['get', 'post', 'delete', 'head', 'options', 'put', 'patch'].map(
        (method) => {
          this.method[method] = async (cb: any) => {
            if (this.ctx.request.method === method.toLocaleUpperCase()) {
              if (cb) {
                await cb();
              }
            } else {
              if (methods.indexOf(method) === -1) {
                if (_MethodNotAllowedCallback) {
                  await _MethodNotAllowedCallback();
                }
                throw 'method not allowed';
              }
            }
          };
        },
      );
    }

    public async view(template: any, data = {}) {
      (global as IGlobal).emitter.removeAllListeners();
      const ext = templates[this.template_engine || template_engine].ext;
      const tpl = path.join(dir, 'views', template + '.' + ext);
      if (fs.existsSync(tpl)) {
        this.ctx.set(
          'X-Template-Engine',
          this.template_engine || template_engine,
        );
        await this.ctx.render(template, data);
        // 如果改变了模板，恢复当前默认模板引擎
        if (this.template_engine) {
          this.template_engine = null;
          app.context.render = null;
          templates[template_engine].render(app);
        }
      } else {
        this.ctx.body = '模板' + template + '.' + ext + '不存在';
      }
    }

    public async redirect() {
      (global as IGlobal).emitter.removeAllListeners();
      this.ctx.redirect.apply(this.ctx, arguments);
    }
  };

  // 确认是否存在MY_Controller
  const AppCtrDir = path.join(
    path.join(dir, 'core', subclass_prefix + 'Controller.js'),
  );

  if (fs.existsSync(AppCtrDir)) {
    (global as any)[subclass_prefix + 'Controller'] = require(AppCtrDir);
  }
};
