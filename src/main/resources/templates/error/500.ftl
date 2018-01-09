<!DOCTYPE html>
<html>
	<head>
		<script type="text/javascript" src="${springMacroRequestContext.contextPath}/js/jquery.min.js" ></script>
		<link rel="stylesheet" href="${springMacroRequestContext.contextPath}/css/bootstrap.css">
		<meta http-equiv="cache-control" content="no-cache">
		<title>图麟云平台</title>
	</head>
	<body>
		服务器内部异常，3秒后将自动返回<a href="${springMacroRequestContext.contextPath}/dashboard/index" class="text-center">主页</a>
	</body>
</html>  
<script>  
	function jump(){  
	  location='${springMacroRequestContext.contextPath}/dashboard/index';  
	}  
	setTimeout('jump()',3000);  
</script>    