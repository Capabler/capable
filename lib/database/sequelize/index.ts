/**
 * 封装数据库查询的ORM
 */

import Base from './base';

export default class extends Base {
  private columns: any;
  private table: any;
  private sql: any;

  constructor(config = {}) {
    super(config);
    this.columns = '';
    this.table = '';
    this.sql = '';
  }

  public async query(sql = '') {
    sql = sql || this.sql;
    return this.__SELECT__(sql);
  }

  public select(columns = '') {
    this.columns = columns;
    return this;
  }

  public from(table: any) {
    this.table = table;
    return this;
  }

  public get(table = '') {
    if (table === '') {
      if (this.table === '') {
        throw '请指定表名称';
      } else {
        // this.db.select('version,token').from('info').get().row_array()
        const columns = this.columns ? '*' : this.columns;
        this.sql = 'SELECT ' + columns + ' FROM ' + this.table;
        return this;
      }
    } else {
      // this.db.get('info').row_array()
      this.sql = 'SELECT * FROM ' + table;
      return this;
    }
  }

  public async row_array() {
    const result = await this.query();
    return result[0];
  }

  public async result_array() {
    return this.query();
  }
}
