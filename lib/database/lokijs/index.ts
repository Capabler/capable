/**
 * 使用lokijs引擎
 */
import loki from 'lokijs';
import fs from 'fs';
import path from 'path';

export default class {
  private db: any;
  constructor(config: any) {
    let dir = config.db.split('/');
    dir.pop();
    dir = dir.join('/');
    if (!fs.existsSync(path.join(process.cwd(), dir))) {
      fs.mkdirSync(dir);
    }
    this.db = new loki(config.db || 'db.json');
    process.on('SIGINT', () => {
      this.db.close();
    });
  }

  public initDB() {
    return new Promise((resolve, reject) => {
      if (this.db) {
        this.db.loadDatabase(null, () => {
          resolve();
        });
      } else {
        reject('请先指定数据库名称');
      }
    });
  }

  public async initTable(tabelName: any) {
    await this.initDB();
    let table = this.db.getCollection(tabelName);
    if (table === null) {
      await this.insert(tabelName);
      table = this.db.getCollection(tabelName);
    }
    return table;
  }

  // 创建表
  public createTable(tabelName: any) {
    if (this.db) {
      return this.db.addCollection(tabelName);
    }
  }

  // 保存数据表
  public saveDatabase() {
    this.db.saveDatabase();
  }

  // 添加数据
  public async insert(tabelName: any, data = {}) {
    await this.initDB();
    let table = this.db.getCollection(tabelName);
    if (table === null) {
      table = this.createTable(tabelName);
    }
    if (Object.keys(data).length) {
      table.insert(data);
    }
    this.saveDatabase();
  }

  // 拉取数据
  public async select(tabelName: any, data = {}) {
    const table = await this.initTable(tabelName);
    return table
      .chain()
      .find(data)
      .data();
  }

  // 清除表的所有数据
  public async clearTable(tabelName: any) {
    const table = await this.initTable(tabelName);
    table.chain().remove();
    this.saveDatabase();
  }

  // 删除指定的表数据
  public async delete(tabelName: any, data = {}) {
    if (Object.keys(data).length === 0) {
      throw { message: '删除表数据需要传值' };
    }
    const table = await this.initTable(tabelName);
    table
      .chain()
      .find(data)
      .remove();
    this.saveDatabase();
  }

  // 更新数据
  public async update(tabelName: any, where = {}, updateData = {}) {
    if (
      Object.keys(where).length === 0 ||
      Object.keys(updateData).length === 0
    ) {
      throw { message: '更新数据需要传值' };
    }
    const table = await this.initTable(tabelName);
    table.update({ ...table.findOne(where), ...updateData });
    this.saveDatabase();
  }
}
