module.exports = class extends MY_Controller { 
	
	async index() {
		await this.method('post', 'get')
		
		await this.method.get(async () => {
			let data = {
				isLogin: this.isLogin
			}
			this.load.model('user_model')
			this.load.model('book_model')
			data['userList'] = await this.user_model.getuserList()
			data['bookList'] = await this.book_model.bookList()

			//默认模板引擎是ejs，动态加载react模板引擎，用来渲染该页面
			if ($_SESSION['user_name'] === 'root') {
				// 只有 root 用户登录使用该引擎
				this.load.template('react')
			}
			await this.view('index', data)
		})

		await this.method.post(async () => { 
			this.ctx.body = '123'
		})
	}		
}