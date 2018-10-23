/**
 * 使用sequelize进行增删改查
 */
const Sequelize = require('sequelize');
const sequelize = require('./main');

module.exports = class {
  constructor(config = {}) {
    this.sequelize = sequelize(config);
  }

  async __SELECT__(sql) {
    const data = await this.sequelize.query(sql, {
      type: Sequelize.QueryTypes.SELECT,
    });
    this.sequelize.close();
    return data;
  }

  async __INSERT__(sql) {
    const data = await this.sequelize.query(sql, {
      type: Sequelize.QueryTypes.INSERT,
    });
    this.sequelize.close();
    return data;
  }
};
