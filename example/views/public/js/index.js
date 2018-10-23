$('.userList').delegate('.delete', 'click', function () { 
	const name = $(this).parent().find('.name').text()
	$.post('/api/user/delete', {
		name:name
	}, function () { 
		location.reload()
	})
})

$('.book span').eq(1).click(function () {
	const value = $(this).parent().find('input').val()
	if (value !== '') { 
		$.post('/api/book/add', {
			book_name:value
		}, function (data) { 
			if (data.status === 1) {
				location.reload()
			}	
		})
	}
})

$('.bookList').delegate('.delete', 'click', function () { 
	const name = $.trim($(this).parents('li').find('a').text())
	$.post('/api/book/delete', {
		book_name:name
	}, function () { 
		location.reload()
	})
})

$('.bookList').delegate('.change', 'click', function () { 
	$(this).parents('li').find('a').hide()
	$(this).parents('li').find('input').val($.trim($(this).parents('li').find('a').text()))
	$(this).parents('li').find('input').show()
	$(this).parents('li').find('.cancel').show()	
	$(this).parents('li').find('.change').hide()
	$(this).parents('li').find('.save').show()
})

$('.bookList').delegate('.cancel', 'click', function () { 
	$(this).parents('li').find('a').show()
	$(this).parents('li').find('input').hide()
	$(this).parents('li').find('.change').show()
	$(this).parents('li').find('.save').hide()
	$(this).parents('li').find('.cancel').hide()	
})

$('.bookList').delegate('.save', 'click', function () {
	const last = $.trim($(this).parents('li').find('a').text())
	const name = $(this).parents('li').find('input').val()
	if (name !== '') { 
		$.post('/api/book/update', {
			last_name: last,			
			book_name: name			
		}, function () { 
			location.reload()
		})
	}
})