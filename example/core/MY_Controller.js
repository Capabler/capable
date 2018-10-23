/**
 * 公共的控制器
 * 处理一些初始化的信息，比如登录信息，统一返回等
 */
module.exports = class extends DJ_Controller { 
	constructor(ctx) { 
		super(ctx)		
		this.isAjax = false
		if (/^\/api/.test(ctx.request.url)) { 
			//处理请求是否是通过正常的ajax访问的
			if (ctx.request.headers["x-requested-with"] === 'XMLHttpRequest') {
				this.isAjax = true	
			}
		}
		this.isLogin = $_SESSION.hasOwnProperty('user_name') && $_SESSION['user_name'] ? true : false

		this.MethodNotAllowed(() => {
			this.ctx.status = 405
			this.ctx.body = 'Method Not Allowed'
		})
	}

	sendJSON(status = -1, message = 'fail', data = []) {
		this.ctx.set('Content-Type', 'text/json')	
		this.ctx.body = JSON.stringify({
			status,
			message,
			data
		})
	}

}