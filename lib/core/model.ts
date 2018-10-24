import fs from 'fs';
import path from 'path';
import Loader from './loader';
import { IGlobal } from '../types/global';
const dir = process.cwd();

const { subclass_prefix } = require(path.join(dir, 'config/config.js'));

export default (app: any) => {
  (global as IGlobal).DJ_Model = class {
    private ctx: any;
    private load: any;
    constructor(ctx: any) {
      this.ctx = ctx;
      this.load = new Loader(app, ctx);
    }
  };

  // 确认是否存在MY_Model
  const AppCtrDir = path.join(
    path.join(dir, 'core', subclass_prefix + 'Model.js'),
  );

  if (fs.existsSync(AppCtrDir)) {
    (global as any)[subclass_prefix + 'Model'] = require(AppCtrDir);
  }
};
