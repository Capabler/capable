module.exports = class extends MY_Controller { 
	//用户列表接口
	async list() {
		if (!this.isAjax) { 
			this.sendJSON()
			return false
		}
		this.sendJSON(0, 'success', [])		
	}

	//访问用户详情接口
	async detail(id = null) {
		if (!this.isAjax) { 
			this.sendJSON()
			return false
		}
		let data = {}, status = -1, message = 'fail'		
		if (id) {
			status = 0
			message = 'success'
			data = { name: 123 }			
		}
		this.sendJSON(status, message, data)		
	}

	//删除用户
	async delete() { 
		if (!this.isAjax) { 
			this.sendJSON()
			return false
		}
		if (!!$_POST['name'] === false) { 
			this.sendJSON()
			return false
		}
		this.load.model('user_model')
		await this.user_model.deleteUser($_POST['name'])
		this.sendJSON(1, 'success')	
	}
}