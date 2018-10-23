const md5 = require('md5')

module.exports = class extends MY_Controller { 
	//登录
	async login() {	
		const data = {
			error: '',
			user_name: '',
			user_password: ''					
		}
		if (this.isLogin) { 
			this.redirect('/')
		}
		if (Object.keys($_POST).length) {
			const { user_name = '', user_password = '' } = $_POST
			data.user_name = user_name
			data.user_password = user_password
			this.load.model('user_model')
			const info = await this.user_model.getuser(user_name)
			if (info.length) {
				if (md5(user_password) === info[0].password) {
					$_SESSION['user_name'] = user_name
					this.redirect('/')
				} else { 
					data.error = "密码不正确"
				}
			} else { 
				data.error = "该用户名不存在"
			}		
		}
		await this.view('login', data)	
	}

	async register() {	
		const data = {
			error: '',
			user_name: '',
			user_password: ''					
		}
		if (this.isLogin) { 
			this.redirect('/')
		}
		if (Object.keys($_POST).length) {
			const { user_name = '', user_password = '' } = $_POST
			if (user_name !== '' && user_password !== '') {								
				data.user_name = user_name
				data.user_password = user_password
				this.load.model('user_model')
				const info = await this.user_model.getuser(user_name)
				if (info.length) {
					data.error = "用户名重复"
				} else {
					await this.user_model.addUser(user_name, md5(user_password))
					this.redirect('/access/login')
				}	
			} else { 
				data.error = "用户名或者密码不能为空"
			}			
		}
		await this.view('register', data)	
	}

	//退出登录
	async logout() { 
		$_SESSION['user_name'] = ''
		this.redirect('/')
	}
}