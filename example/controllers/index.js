module.exports = class extends DJ_Controller {
  async index() {
    this.ctx.body = 'hello delicatejs';
  }
};
