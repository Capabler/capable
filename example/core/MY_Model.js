/**
 * 公共的Model，处理一些公共资源，比如数据库加载等
 */

module.exports = class extends DJ_Model {
  constructor(ctx) {
    super(ctx);
    //this.db_r = this.load.database('read')
    this.book = this.load.database('book');
    this.user = this.load.database('user');
    this.code = this.load.database('code');
  }
};
