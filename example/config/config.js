module.exports = {
  // 服务端口号
  port: 3000,

  // 数据库引擎可选, lokijs、sequelize
  database_engine: 'lokijs',

  /**
   * 自定义公共继承的对象，默认是放在core文件夹下，文件名称已MY_开头
   * 控制器自动挂载MY_Controller.js文件
   * 模块自动挂载MY_Model.js文件
   * 那么我们在controllers中定义类时，可以继承MY_Controller
   * 而MY_Controller继承的是DJ_Controller，所以可以做一些通用的业务处理
   */
  subclass_prefix: 'MY_',

  /**
   * 加载一些model全局使用，不需要每次都去this.load.model()
   * 接受多个model的加载，数组形式
   * 内容和this.load.model的传值的信息一致，都是models文件夹下的文件的名称，不包括后缀
   * 例如：
   * models:['book_model','user_model']
   */
  models: [],

  /**
   * 是否使用socket
   */
  socket: false,
};
