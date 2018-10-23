const md5 = require('md5')

module.exports = class extends MY_Controller { 
	async create() { 
		if ($_POST['code'] && $_POST['code'] !== '') {
			const id = md5($_POST['code'] + new Date().getTime())
			this.load.model('code_model')
			await this.code_model.saveCode({
				code: $_POST['code'],
				id
			})
			this.sendJSON(0, 'success', { id })		
		} else { 
			this.sendJSON()
		}
	}
}