const path = require('path')
/**
 * 系统环境参数的配置
 */
global.application = path.join(__dirname, 'application')

/**
 * 如果选择react模板，需要添加该配置，否则无法进行模板的解析
 */
require('babel-register')({
  presets: [ "es2015", "react"],
  extensions: [ '.jsx' ],
});

//启动核心方法
require('./system/core')()
