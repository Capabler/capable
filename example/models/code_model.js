module.exports = class extends MY_Model { 
	async saveCode(data) { 
		if (this.database_engine === 'lokijs') { 
			return await this.code.insert('code',data)
		}
	}

	async getCode(id) { 
		if (this.database_engine === 'lokijs') { 
			return await this.code.select('code', { id })	
		}
	}
}