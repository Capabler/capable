/**
 * 封装数据库查询的ORM
 */

import Base from './base';

export default class extends Base {
  private columns: any;
  private table: any;
  private sql: any;
  private conditions: Object;

  constructor(config = {}) {
    super(config);
    this.columns = '';
    this.table = '';
    this.sql = '';
    this.conditions = {};
  }

  public async query(sql = '') {
    sql = sql || this.sql;
    return this.__SELECT__(sql);
  }

  public select(columns = '') {
    this.columns = columns;
    return this;
  }

  public where(conditions = {}) {
    this.conditions = conditions;
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
        this.sql = 'SELECT ' + columns + ' FROM ' + this.table + ' WHERE ';
      }
    } else {
      // this.db.get('info').row_array()
      this.sql = 'SELECT * FROM ' + table + ' WHERE ';
    }

    for (const key in this.conditions) {
      if (this.conditions.hasOwnProperty(key)) {
        this.sql += key + ' = "' + (this as any).conditions[key] + '" AND ';
      }
    }
    this.sql += ' 1 =1 ';
    return this;
  }

  public async row_array() {
    const result = await this.query();
    return result.length ? result[0] : null;
  }

  public async result_array() {
    return this.query();
  }
}
