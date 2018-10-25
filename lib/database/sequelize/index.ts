/**
 * 封装数据库查询的ORM
 */

import Base from './base';

export default class extends Base {
  private columns: any;
  private table: any;
  private sql: any;
  private conditions: Object;
  private order: any;

  constructor(config = {}) {
    super(config);
    this.columns = '';
    this.table = '';
    this.sql = '';
    this.conditions = {};
    this.order = '';
  }

  public async query(sql = '') {
    sql = sql || this.sql;
    this.sql = '';
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

  // order_by('uid asc, id desc')
  public order_by(order = '') {
    this.order = order;
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
        table = this.table;
      }
    }

    const columns = this.columns === '' ? '*' : this.columns;
    this.sql = 'SELECT ' + columns + ' FROM ' + table;
    this.columns = '';

    const WHERE = [];
    for (const key in this.conditions) {
      if (this.conditions.hasOwnProperty(key)) {
        WHERE.push(key + ' = "' + (this as any).conditions[key] + '"');
      }
    }
    this.conditions = {};
    if (WHERE.length) {
      this.sql += ' WHERE ' + WHERE.join(' AND ');
    }

    if (this.order) {
      this.sql += ' ORDER BY ' + this.order;
    }

    this.order = '';

    return this;
  }

  public async row_array() {
    const result = await this.query();
    return result.length ? result[0] : null;
  }

  public async result_array() {
    return this.query();
  }

  public async insert(table = '', data: Object) {
    if (table === '') {
      throw 'insert的table不能为空';
    } else {
      const keys = Object.keys(data);
      const values = Object.values(data);
      if (keys.length) {
        const sql =
          'INSERT INTO ' +
          table +
          '(' +
          keys.join(',') +
          ') value(' +
          values.map((item) => "'" + item + "'").join(',') +
          ');';
        return this.__INSERT__(sql);
      } else {
        throw 'insert的数据不能为空';
      }
    }
  }

  public async update(table = '', data: any) {
    if (table === '') {
      throw 'update的table不能为空';
    } else {
      if (!Object.keys(data).length) {
        throw 'update更新的内容不能为空';
      }
      let sql = 'UPDATE ' + table + ' SET ';
      const SET = [];
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          SET.push(key + ' = "' + data[key] + '"');
        }
      }
      sql += SET.join(',');
      const WHERE = [];
      for (const key in this.conditions) {
        if (this.conditions.hasOwnProperty(key)) {
          WHERE.push(key + ' = "' + (this as any).conditions[key] + '"');
        }
      }
      this.conditions = {};
      if (WHERE.length) {
        sql += ' WHERE ' + WHERE.join(' AND ');
      }
      return this.__UPDATE__(sql);
    }
  }
}
