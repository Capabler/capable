/**
 * 使用sequelize进行增删改查
 */
import Sequelize from 'sequelize';
import sequelize from './main';

export default class {
  public sequelize: any;
  constructor(config = {}) {
    this.sequelize = sequelize(config);
  }

  public async __SELECT__(sql: any) {
    const data = await this.sequelize.query(sql, {
      type: Sequelize.QueryTypes.SELECT,
    });
    return data;
  }

  public async __INSERT__(sql: any) {
    const data = await this.sequelize.query(sql, {
      type: Sequelize.QueryTypes.INSERT,
    });
    return data;
  }

  public async __UPDATE__(sql: any) {
    const data = await this.sequelize.query(sql, {
      type: Sequelize.QueryTypes.UPDATE,
    });
    return data;
  }
}
