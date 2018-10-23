const fs = require('fs');
const path = require('path');
const Loader = require('./loader');
const dir = process.cwd();

const { subclass_prefix, database_engine } = require(path.join(
  dir,
  'config/config.js',
));

module.exports = (app) => {
  global.DJ_Model = class {
    constructor(ctx) {
      this.ctx = ctx;
      this.load = new Loader(app, ctx);
      this.database_engine = database_engine;
    }
  };

  //确认是否存在MY_Model
  const AppCtrDir = path.join(
    path.join(dir, 'core', subclass_prefix + 'Model.js'),
  );

  if (fs.existsSync(AppCtrDir)) {
    global[subclass_prefix + 'Model'] = require(AppCtrDir);
  }
};
