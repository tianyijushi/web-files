var prefix_url=tunicorn.contextPath, page_size = 10,
	_checkUserPost = function(){
		var username = $('#userName').val().trim();
		var password = $('#password').val().trim();
		var name = $('#name').val().trim();
		var roleId = $('#roleId').val().trim();
		var phoneNumber = $('#phone').val().trim();
		var email = $('#email').val().trim();
		var comment = $('#comment').val().trim();
		if(username=='' || password=='' || name=='' || roleId==''|| phoneNumber==''|| email==''){
			noty({text: "所有必选项均不能为空", layout: "topCenter", type: "warning", timeout: 2000});
			return false;
		}
		if(username.length > 25){
			noty({text: "用户名长度为25个字符以内！", layout: "topCenter", type: "warning", timeout: 2000});
			return false;
		}
		if(password.length < 6 || password.length > 20){
			noty({text: "密码长度为6-20个字符之间！", layout: "topCenter", type: "warning", timeout: 2000});
			return false;
		}
		if(name.length > 10){
			noty({text: "姓名长度为10个字符以内！", layout: "topCenter", type: "warning", timeout: 2000});
			return false;
		}
		if(email.length > 50){
			noty({text: "Email长度为50个字符以内！", layout: "topCenter", type: "warning", timeout: 2000});
			return false;
		}
		var regex = new RegExp("^[a-zA-Z0-9_]+$");
		if(!regex.test(username)){
			noty({text: "用户名只能包含英文、数字及_等字符!", layout: "topCenter", type: "warning", timeout: 2000});
			return false;
		}
		var regex = new RegExp("^[^\u4e00-\u9fa5]+$");
		if(!regex.test(password)){
			noty({text: "密码不能包含中文字符!", layout: "topCenter", type: "warning", timeout: 2000});
			return false;
		}
		var regex = new RegExp("^[\u4e00-\u9fa5a-zA-Z0-9&@\(\)_-]+$");
		if(!regex.test(name)){
			noty({text: "姓名只能包含中英文、数字及&@_-()等字符!", layout: "topCenter", type: "warning", timeout: 2000});
			return false;
		}
		var regex = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
		if(!regex.test(email)){
			noty({text: "Email格式不正确!", layout: "topCenter", type: "warning", timeout: 2000});
			return false;
		}
		var regex = /^\d{11}$/;
		if(!regex.test(phoneNumber)){
			noty({text: "手机号格式不正确!", layout: "topCenter", type: "warning", timeout: 2000});
			return false;
		}
		return true;
	},
	 _initDevicePagination = function(currentPage, totalCount) {
		var options = {
				alignment: 'center',
		        currentPage: currentPage,
		        totalPages: Math.ceil(totalCount / page_size),
		        numberOfPages: page_size,
		        onPageClicked: function (event, originalEvent, type, page) {
		        	doUserSearch(page);
		        }
			};
			$('#table_paginator').bootstrapPaginator(options);
			$("#table_paginator").show();
	},
	_getByUserName = function($this){
		var $this = $('#searchValue');
		var name = $this.val();
		if(name.trim()==''){
			noty({text: "请输入用户名!", layout: "topCenter", type: "warning", timeout: 2000});
			return;
		}
		var url = prefix_url + "/user?name="+name;
		tunicorn.utils.get(url, function(data){
	    	$("#content").html(data);
	    });
	},
	 _enterEvent=function(){
		var event=arguments.callee.caller.arguments[0]||window.event;
        if(event.keyCode==13){
        	_getByUserName();
		}
	},
	_checkPasswordPost = function(){
		var password = $('#password').val().trim();
		var newPassword = $('#newPassword').val().trim();
		if(password=='' || newPassword==''){
			noty({text: "密码不能为空", layout: "topCenter", type: "error", timeout: 2000});
			return false;
		}
		if((password.length < 6 || password.length > 20) || (newPassword.length < 6 || newPassword.length > 20)){
			noty({text: "密码长度为6-20个字符之间！", layout: "topCenter", type: "warning", timeout: 2000});
			return false;
		}
		var regex = new RegExp("^[^\u4e00-\u9fa5]+$");
		if(!regex.test(password) || !regex.test(newPassword)){
			noty({text: "密码不能包含中文字符!", layout: "topCenter", type: "warning", timeout: 2000});
			return false;
		}
		if(password!=newPassword){
			noty({text: "两次密码输入不一致", layout: "topCenter", type: "error", timeout: 2000});
			return false;
		}
		return true;
	},
	_initUserEvents = function(){
		//add user click
		$('#createUser').on('click', function(e){
			tunicorn.utils.get(prefix_url + '/user/0', function(html){
				$('#user_edit .modal-body').html(html);
				$('#user_edit_label').text('创建用户');
				$('#user_edit').modal('show');
			});
		});
		//edit user click
		$('#userList .edit').on('click', function(e){
			var uid = $(this).attr('uid');
			tunicorn.utils.get(prefix_url + '/user/'+uid, function(html){
				$('#user_edit .modal-body').html(html);
				$('#user_edit').modal('show');
			});
		});
		//save user or add user
		$('#saveUser').on('click', function(e){
			if(!_checkUserPost()){
				return;
			}
			tunicorn.utils.postForm($('#userForm'), function(err, data){
				if(err){
	               noty({text: err, layout: "topCenter", type: "error", timeout: 2000});
	               return;
	            }
				$("#user_edit").modal('hide');
	            if(data && data.success){
	            	noty({text: "保存用户成功！", layout: "topCenter", type: "success", timeout: 2000});
	            	setTimeout(function(){
	            		tunicorn.utils.render(prefix_url+'/user');
	            	},500);
	            }else{
	               noty({text: data.errorMessage, layout: "topCenter", type: "error", timeout: 2000});
	            }
			});
		});
		
		//change password
		$('#userList .updatepw').on('click', function(e){
			var uid = $(this).attr('uid');
			$('#passwdUserId').val(uid);
			$('#user_password').modal('show');
		});
		$('#passwordUser').on('click', function(e){
			if(!_checkPasswordPost()){
				return false;
			};
			tunicorn.utils.postForm($('#pwdForm'), function(err, data){
				if(err){
	               noty({text: err, layout: "topCenter", type: "error", timeout: 2000});
	               return;
	            }
				$("#user_password").modal('hide');
	            if(data && data.success){
	            	noty({text: "修改密码成功！", layout: "topCenter", type: "success", timeout: 2000});
	            	setTimeout(function(){
	            		tunicorn.utils.render(prefix_url+'/user');
	            	},500);
	            }else{
	               noty({text: data.errorMessage, layout: "topCenter", type: "error", timeout: 2000});
	            }
			});
		});
		//search
		$("#searchValue").keydown(function(){
			_enterEvent();
		})
		$("#iconSearch").click(function(){
			_getByUserName();
		})
		//delete user
		$('#userList .btn-danger').on('click', function(e){
			var uid = $(this).attr('uid');
			$('#user_delete_label').attr('uid', uid);
			$('#user_delete').modal('show');
		});
		$('#deleteUser').on('click', function(e){
			var uid = $('#user_delete_label').attr('uid');
			$("#user_delete").modal('hide');
			$.ajax({
				url : prefix_url+'/user/'+uid,
				type : 'DELETE',
				success : function(data){
					if(data && data.success){
						noty({text: "删除用户成功！", layout: "topCenter", type: "success", timeout: 2000});
		            	setTimeout(function(){
		            		tunicorn.utils.render(prefix_url+'/user');
		            	},500);
					}
				}
			});
		});
		//page
		$('.ajax-link').on('click', function(e){
			e.preventDefault(); 
			var url = $(this).attr('href');
			tunicorn.utils.get(url, function(data){
		    	$("#content").html(data);
		    });
		});
},  doUserSearch = function(pageNum) {
	var searchValue = $("#userNameSearch").val();		    	
	var page = 1;
	if (pageNum) {
		page = pageNum;
	}
	$.ajax({
		 type: 'GET',
		 url: d_url + '/user?name='+searchValue + '&page=' + page,
		 success: function(data) {
		 	$("#content").html(data);
    	},
    	error: function(data) {
    		//返回500错误页面
    		$("html").html(data.responseText);
    	}
	});		    
};
