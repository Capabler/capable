/**
 * 使用sequelize进行增删改查
 */
import Sequelize from 'sequelize';
import sequelize from './main';

export default class {
  private sequelize: any;
  constructor(config = {}) {
    this.sequelize = sequelize(config);
  }

  public async __SELECT__(sql: any) {
    const data = await this.sequelize.query(sql, {
      type: Sequelize.QueryTypes.SELECT,
    });
    this.sequelize.close();
    return data;
  }

  public async __INSERT__(sql: any) {
    const data = await this.sequelize.query(sql, {
      type: Sequelize.QueryTypes.INSERT,
    });
    this.sequelize.close();
    return data;
  }
}
