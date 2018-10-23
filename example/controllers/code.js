module.exports = class extends MY_Controller { 

	async index() { 
		let data = {
			code: null
		}
		if ($_GET['id']) {
			this.load.model('code_model')
			const code = await this.code_model.getCode($_GET['id'])
			if (code.length !== 0) {
				data.code = code[0]['code']	
			}
		}
		await this.view('code/index', data)	
	}
}