var d_url=tunicorn.contextPath;
var dface=dface || {};
dface=(function(){
	function login(){
		var userName = $("#userName").val();
		var password = $("#password").val();
		var data = {"userName":userName, "password":password};
		$.ajax({
			 type: 'POST',
			 url: 'login',
			 contentType : 'application/json',
			 data: JSON.stringify(data),
			 dataType: 'json', 
			 success: function(data) {
			 	if (data.success) {
			 		location.href="dashboard/index";
			 	} else {
			 		$('#errorMsg').text(data.errorMessage);
            	} 
        	},
        	error: function(data) {
        		//返回500错误页面
        		$("html").html(data.responseText);
        	}
		});
	};
	function checkLogin(){
		if($("#userName").val().trim()==""){
        	$('#errorMsg').text('请输入用户名');
        	return false;
        } else if ($("#password").val().trim()==""){
        	$('#errorMsg').text('请输入密码');
    		return false;
        　　　　} else {
        	login();
       }
	};
	function checkPassword(){
		var event=arguments.callee.caller.arguments[0]||window.event;
        if(event.keyCode==13){
		    $("#button").click();
		}
	};
	return {
		checkLogin:checkLogin,
		checkPassword:checkPassword
	}
})()