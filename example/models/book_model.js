module.exports = class extends MY_Model{ 
	async bookList() { 
		if (this.database_engine === 'lokijs') { 
			return await this.book.select('book')
		}
	}

	async bookDetail(book_name) { 
		if (this.database_engine === 'lokijs') { 
			return await this.book.select('book', { book_name })		
		}
	}

	async addBook(data) { 
		if (this.database_engine === 'lokijs') {
			return await this.book.insert('book', data)		
		}
	}

	async deleteBook(data) { 
		if (this.database_engine === 'lokijs') {
			return await this.book.delete('book', data)		
		}
	}

	async updateBook(where,data) { 
		if (this.database_engine === 'lokijs') {
			return await this.book.update('book', where, data)		
		}
	}
}