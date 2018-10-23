import React from 'react'

export default (props) => {
	return (
		<div>
			<link rel="stylesheet" type="text/css" href="/css/index.css" />
			<a href="/code">代码编辑器</a>
			{
				props.isLogin ?
					<a href="/access/logout">用户登出</a>
					:
					<div>
						<a href="/access/login">用户登录</a>
						<a href="/access/register">用户注册</a>
					</div>	
			}		
			<h1>hello React</h1>	
			<p className="book">
				<span>书籍名称：</span>
				<input type="text"/>
				<span>添加</span>
			</p>
			<ul className="bookList">
			{props.bookList.map((item,index) => { 
				return (
					<li key={index}>
						<span>
							<a href={`/book/detail/${item.book_name}`}>
									{item.book_name}
							</a>
							<input type="text" style={{ display: 'none' }}/>
						</span>
						<div>
							<span className="change">修改</span>
							<span className="save" style={{ display: 'none' }}>保存</span>
							<span className="cancel" style={{ display: 'none' }}>取消</span>
							<span className="delete">删除</span>
						</div>
					</li>
				)
				})}
			</ul>	
			<script src="/js/jquery.js"></script>
			<script src="/js/index.js"></script>
		</div>		
	)
}