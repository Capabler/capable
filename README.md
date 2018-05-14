# [DelicateJS](http://www.sunyangjie.com/2018/04/29/nodejs%E7%89%88web%E4%B8%9A%E5%8A%A1%E5%B1%82%E6%A1%86%E6%9E%B6/)&middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/delicatejs/delicatejs/blob/master/LICENSE) [![NPM version](https://img.shields.io/npm/v/delicate-cli.svg)](https://www.npmjs.com/package/delicate-cli)

一套基于`koa`的Web业务层`mvc`框架，让Web开发变得更便捷，更灵活，更高效

### Setup
```
npm install supervisor delicate-cli -g

delicate init <my-project>

cd <my-project>

npm install

npm start
```

访问 `http://localhost:3000/` [more>](https://github.com/delicatejs)

### Update

如果核心代码进行重大更新，主要是`system`文件夹更新了

无需重新克隆文件拷贝，只需要在项目根目录下执行`delicate update`即可完成更新

### Deployment

使用 [pm2](https://github.com/Unitech/pm2) 进行项目的部署服务

### [Download](https://github.com/delicatejs/delicatejs/archive/0.0.1.zip)

### 更新日志

- 服务端返回形式
  - 正常返回
  ```js
  //例如返回json格式的数据
  this.ctx.set('Content-Type', 'text/json')	
  this.ctx.body = {}
  ```

  - 模板返回
  ```js
  //指定模板的路径和模板需要渲染的数据[数组]
  this.view(templatePath,templateData)  
  ```

  - 重定向
  ```js
  //重定向到路由为'/'的页面
  this.redirect('/')
  ```


- 请求方式检测

```js
//core  MY_Controller
module.exports = class extends DJ_Controller{
  constructor(ctx) { 
    super(ctx)				
    this.MethodNotAllowed(() => {
      this.ctx.status = 405
      this.ctx.body = 'Method Not Allowed'
    })
  }
}

//controllers
//目前支持请求方式 'get', 'post', 'delete', 'head', 'options', 'put', 'patch'
module.exports = class extends MY_Controller{
  async delete(){
    /*
     * 指定当前接受的请求方式
     * 如果请求方式不是delete，会执行this.MethodNotAllowed的回调方法
     * 如果不指定method，也可以直接写业务，但是这个会任何请求方式都会命中该路由  
     */

    //指定单个请求方式
    await this.method.delete()
    
    //指定多个请求方式
    await this.method('delete','post')
    
    //指定不同的请求方式的业务代码
    //必须要先指定所有可能的请求方式
    //await this.method('post', 'delete')
    this.method.post( async () => {
      //post请求方式的业务代码
    });

    this.method.delete( async()=>{
      //delete请求方式的业务代码
    });

    //编写业务代码 
    //更多查看最佳实践delicatejs-example    
  }
}
```

### More

更多使用姿势，请参考[example](https://github.com/delicatejs/delicatejs-example)

### License

MIT