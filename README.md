# Capable

一套基于`koa`的Web业务层`mvc`框架，让Web开发变得更便捷，更灵活，更高效

[详细文档](http://www.sunyangjie.com/2018/04/29/nodejs%E7%89%88web%E4%B8%9A%E5%8A%A1%E5%B1%82%E6%A1%86%E6%9E%B6/)

### 注意

开发阶段使用`supervisor`进行热更新代码，请务必全局安装

```shell
npm install supervisor -g
```

### 体验
```
npm install
npm start
```

直接访问`http://localhost:3000/`,首页实现了一个增删改查的demo

### 数据库引擎

引擎`sequelize`使用的是`mysql`数据库

引擎`lokijs`使用的是文件数据库，默认为项目目录下的`db.json`

同时可以切换使用这两个数据库引擎，可以在`application`文件夹配置中进行引擎相关的信息配置

### 核心代码

文件夹`system`是核心代码

### 业务代码

文件夹`application`是业务代码，文件夹名称可配置

### 介绍

在`application/controllers`下新建`home.js`，新建方法为`detail`，代码如下

```js
module.exports = class extends CA_Controller { 
  constructor(ctx) { 
    super(ctx)
  }

  async detail(id, name, age) {		
    if (Object.keys($_POST).length) {
      this.send('post 请求')
    } else {
      await this.view('home', { id, name, age })
    }	
  }
}
```

启动服务后，便可以访问下面路由

	/home/detail

	/home/detail/:id

	/home/detail/:id/:name

	/home/detail/:id/:name/:age

get请求和post请求，获取数据的方式为`$_GET`、`$_POST`，也可以通过方法的参数获取


`this.view`

第一个参数是在views目录下模板地址，模板的相关配置在`config/template.js`

第二个参数为模板需要的数据`Object`

`constructor`在访问的时候不会在里面进行响应操作，需要在路由的方法内进行响应处理

### 动态切换模板引擎

`this.load.template('react')`

response headers

X-Template-Engine: react


### License

CodeStarter is [MIT licensed](./LICENSE).