/**
 * 封装数据库查询的ORM
 */

const Base = require('./base');

module.exports = class extends Base {
  constructor(config = {}) {
    super(config);
    this.columns = '';
    this.table = '';
    this.sql = '';
  }

  async query(sql = '') {
    sql = sql || this.sql;
    return await this.__SELECT__(sql);
  }

  select(columns = '') {
    this.columns = columns;
    return this;
  }

  from(table) {
    this.table = table;
    return this;
  }

  get(table = '') {
    if (table === '') {
      if (this.table === '') {
        throw '请指定表名称';
      } else {
        //this.db.select('version,token').from('info').get().row_array()
        const columns = this.columns ? '*' : this.columns;
        this.sql = 'SELECT ' + columns + ' FROM ' + this.table;
        return this;
      }
    } else {
      //this.db.get('info').row_array()
      this.sql = 'SELECT * FROM ' + table;
      return this;
    }
  }

  async row_array() {
    const result = await this.query();
    return result[0];
  }

  async result_array() {
    return await this.query();
  }
};
