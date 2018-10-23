import Sequelize from 'sequelize';

export default ({ database, username, password, host }: any) => {
  return new Sequelize(database, username, password, {
    host,
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
    timezone: '+08:00',
    define: {
      engine: 'InnoDB',
      charset: 'utf8mb4',
      timestamps: false,
      freezeTableName: true,
    },
    operatorsAliases: false,
    logging(sql: any) {},
  });
};
