/**
 * 注释的代码是走sequelize引擎，需要连接mysql数据库
 */
module.exports = class extends MY_Model{ 

	async getuserList() {
		if (this.database_engine === 'sequelize') {
			return await this.db_r.select("select * from user")
		}
		return await this.user.select('user')
	}

	async addUser(name, password) {
		if (this.database_engine === 'sequelize') {
			return await this.db_r.insert(`INSERT INTO user(name,password) values('${name}','${password}')`)	
		}	
		return await this.user.insert('user', { name, password })
	}

	async getuser(name) {
		if (this.database_engine === 'sequelize') {
			return await this.db_r.select(`select * from user where name='${name}' `)
		}	
		return await this.user.select('user', { name })
	}

	async deleteUser(name) { 
		if (this.database_engine === 'sequelize') {
			return await this.db_r.select(`select * from user where name='${name}' `)
		}	

		return await this.user.delete('user', { name })	
	}
}