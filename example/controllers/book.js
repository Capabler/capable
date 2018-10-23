module.exports = class extends MY_Controller { 
	async detail(book_name) {
		await this.method.get(async () => {
			this.load.model('book_model')
			const data = await this.book_model.bookDetail(book_name)
			if (data.length) {
				await this.view('book/detail', data[0])
			} else {
				await this.redirect('/')
			}
		})	
	}
}