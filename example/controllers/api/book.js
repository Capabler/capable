module.exports = class extends MY_Controller {

	async list() {
		this.load.model('book_model')
		const list = await this.book_model.bookList()
		this.sendJSON(1, 'success', list)		
	}

	async add() {
		await this.method.post()
		
		if (!this.isAjax) {
			this.sendJSON()
			return false
		}
		if (!!$_POST['book_name'] === false) {
			this.sendJSON()
			return false
		}
		this.load.model('book_model')
		await this.book_model.addBook({
			book_name: $_POST['book_name']
		})
		this.sendJSON(1, 'success')
	}

	async delete() { 
		if (!this.isAjax) { 
			this.sendJSON()
			return false
		}
		if (!!$_POST['book_name'] === false) { 
			this.sendJSON()
			return false
		}
		this.load.model('book_model')
		await this.book_model.deleteBook({
			book_name: $_POST['book_name']			
		})
		this.sendJSON(1, 'success')	
	}

	async update() { 
		if (!this.isAjax) { 
			this.sendJSON()
			return false
		}
		if (!!$_POST['book_name'] === false) { 
			this.sendJSON()
			return false
		}
		this.load.model('book_model')
		await this.book_model.updateBook({
			book_name: $_POST['last_name']	
		}, {
			book_name: $_POST['book_name']	
		})
		this.sendJSON(1, 'success')	
	}

}