<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
	<title>图麟科技动态人脸平台</title>
	
	<link rel="stylesheet" href="${springMacroRequestContext.contextPath}/css/bootstrap.css">
	<!-- 
	<link rel="stylesheet" href="${springMacroRequestContext.contextPath}/css/font-awesome.min.css">
	<link rel="stylesheet" href="${springMacroRequestContext.contextPath}/css/iconfont.css">
	-->
	<link rel="stylesheet" href="${springMacroRequestContext.contextPath}/css/jquery-jvectormap-1.2.2.css">
	<link rel="stylesheet" href="${springMacroRequestContext.contextPath}/css/AdminLTE.css">
	<link rel="stylesheet" href="${springMacroRequestContext.contextPath}/css/_all-skins.min.css">
	
    <!--
    <script type="text/javascript" src="${springMacroRequestContext.contextPath}/js/jquery.fileupload.js" ></script>
    <script type="text/javascript" src="${springMacroRequestContext.contextPath}/js/jquery.fileupload-process.js" ></script>
    <script type="text/javascript" src="${springMacroRequestContext.contextPath}/js/jquery.fileupload-validate.js" ></script>
    <script type="text/javascript" src="${springMacroRequestContext.contextPath}/js/jquery-editable-select.min.js" ></script>
    
    <script type="text/javascript" src="${springMacroRequestContext.contextPath}/js/lodash.min.js" ></script>
    <script type="text/javascript" src="${springMacroRequestContext.contextPath}/js/moment.min.js" ></script>
    <script type="text/javascript" src="${springMacroRequestContext.contextPath}/js/masonry.pkgd.js" ></script>
    -->
    
    <!--
    <link href="${springMacroRequestContext.contextPath}/css/jquery-fileupload.css" rel="stylesheet">
    <link href="${springMacroRequestContext.contextPath}/css/jquery-fileupload-ui.css" rel="stylesheet">
    -->
    <link href="${springMacroRequestContext.contextPath}/css/jquery-editable-select.min.css" rel="stylesheet">
    <link href="${springMacroRequestContext.contextPath}/css/bootstrap-datetimepicker.min.css" rel="stylesheet">
    <link href="${springMacroRequestContext.contextPath}/css/bootstrap-select.css" rel="stylesheet">
    <link href="${springMacroRequestContext.contextPath}/css/style.css" rel="stylesheet">
    <link href="${springMacroRequestContext.contextPath}/css/cropper.css" rel="stylesheet">
    <link href="${springMacroRequestContext.contextPath}/css/jquery-ui.min.css" rel="stylesheet">
    
   
	<style type="text/css">
		.skin-blue .sidebar-menu>li:hover>a, .skin-blue .sidebar-menu>li.active>a {
			color: #fff;
			background: #1e282c;
			border-left-color: #00a65a;
		}
		.content-wrapper, .right-side {
			min-height: 100%;
			background-color: #fff;
		}
		.navbar a:hover{
			background-color:green
		}
		.light{
			color:#fff;
		}
		.default{
			color:#8aa4af;
		}
	</style>
	
</head>
<body class="hold-transition skin-blue sidebar-mini" onload="loadEvent()">
	<div class="wrapper">
	  <header class="main-header">
		<!- - Logo - ->
		<a href="javascript:void(0)" class="logo" style="background-color: #000;">
		  <span class="logo-lg">
			  <div>
				  <p><img src="${springMacroRequestContext.contextPath}/image/logo.png" alt="" style="height: 40px;height: 40px;float: left;width: 155px;margin-left: 22px;margin-top: -4px;"></p>
				  <p style=""></p>
				  <!-- <p style="font-size: 11px;margin-top: -5px; color: #eee">图麟云开放平台</p> -->
			  </div>
		  </span>
		</a>
		<!- - Header Navbar - ->
		<nav class="navbar navbar-static-top" role="navigation" style="background-color: #000; height: 50px;">
			<a href="#" class="glyphicon glyphicon-align-justify" data-toggle="offcanvas" role="button" style="padding:0px 15px;color:#fff;line-height: 50px;margin-top: -1px; float:left;">
				<span class="sr-only">Toggle navigation</span>
		 	</a>
		 	<ul class="nav navbar-nav">
		 		<li class="dropdown">
	                <a class="top-menu-link" href="javascript:void(0)" onclick="setPath()">移动目录</a>
	            </li>
		 	</ul>
		</nav>
	  </header>
	  <aside class="main-sidebar" style="width:199px;">
		<section class="sidebar" >
		<div id="tree" style="height:95%;overflow-y :scroll;position:absolute;background-color: #ffffff;"></div>
		
		</section>
	  </aside>
	  <section class="content-wrapper" style="">
	   	<div id="content" style="margin-left:40px;">
	   	</div>
	   	
	   	<div id="save_source" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
	     <div class="modal-dialog" role="document">
	         <div class="modal-content">
	             <div class="modal-header">
	                 <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
	                 <h4 class="modal-title" id="myModalLabel">设置移动目录</h4>
	             </div>
	             <div class="modal-body">
	             	 <form id="source_form" action="${springMacroRequestContext.contextPath}/files/setPath" method="post">
	                 <div class="form-group">
	                     <span class="control-label col-sm-3 .col-md-offset-3 text-right" ><span style="color:red">*</span>IPC名称</span>
	                     <div class="col-sm-9 ">
	                     	<input id="endPath" name="endPath" value="${endPath}" style="margin-bottom: 24px" type="text" class="form-control" placeholder="移动目录">
	                     </div>
	                 </div>
	                 </form>
	             </div>
	             
	             <div class="modal-footer" style="border-top-color: #ffffff">
	                <button type="button" class="btn btn-default" data-dismiss="modal" id="cancel_source_confirm">取消</button>
	                <button type="button" class="btn btn-success" id="save_source_confrim" onclick="savePath()">确定</button>
	            </div>
	        </div>
	    </div>
	</div> 
	</section>
	</div>
</body>
	<script type="text/javascript" src="${springMacroRequestContext.contextPath}/js/jquery.min.js"></script>
	<script type="text/javascript" src="${springMacroRequestContext.contextPath}/js/bootstrap.js"></script>
	<script type="text/javascript" src="${springMacroRequestContext.contextPath}/js/jquery.noty.packaged.js" ></script>	
	<script type="text/javascript" src="${springMacroRequestContext.contextPath}/js/app.min.js"></script>
	<script type="text/javascript" src="${springMacroRequestContext.contextPath}/js/jquery.ui.widget.js" ></script>
    <script type="text/javascript" src="${springMacroRequestContext.contextPath}/js/jquery.form.js" ></script>
    <script type="text/javascript" src="${springMacroRequestContext.contextPath}/js/jquery.iframe-transport.js" ></script>
	<script type="text/javascript" src="${springMacroRequestContext.contextPath}/js/bootstrap-datetimepicker.min.js" ></script>
    <script type="text/javascript" src="${springMacroRequestContext.contextPath}/js/bootstrap-datetimepicker.zh-CN1.js" ></script>
    <script type="text/javascript" src="${springMacroRequestContext.contextPath}/js/echarts.common.min.js" ></script>
    <script type="text/javascript" src="${springMacroRequestContext.contextPath}/js/bootstrap-select.js" ></script>
    <script type="text/javascript" src="${springMacroRequestContext.contextPath}/js/bootstrap-paginator.js" ></script>
    <script type="text/javascript" src="${springMacroRequestContext.contextPath}/js/tunicorn-cloud.js" ></script>
    <script type="text/javascript" src="${springMacroRequestContext.contextPath}/js/tunicorn-template.js" ></script>
    <script type="text/javascript" src="${springMacroRequestContext.contextPath}/js/jquery-ui.js" ></script>
    <script type="text/javascript" src="${springMacroRequestContext.contextPath}/js/jquery.timeago.js" ></script>
   <script type="text/javascript" src="${springMacroRequestContext.contextPath}/js/jquery.nicescroll.js" ></script>  
   <script type="text/javascript" src="${springMacroRequestContext.contextPath}/js/bootstrap-treeview.js"></script>
   <script type="text/javascript" src="${springMacroRequestContext.contextPath}/js/bootstrap-slider.min.js"></script>
   <script type="text/javascript" src="${springMacroRequestContext.contextPath}/js/chosen.jquery.js"></script>
   
   <script type="text/javascript">
	function loadEvent() {  
		 if (!document.all) {  
		  window.constructor.prototype  
		    .__defineGetter__(  
		      "event",  
		      function() {  
		       var func = arguments.callee.caller;  
		       while (func != null) {  
		        var arg0 = func.arguments[0];  
		        if (arg0  
		          && (arg0.constructor == Event || arg0.constructor == MouseEvent)) {  
		         return arg0;  
		        }  
		        func = func.caller;  
		       }  
		       return null;  
		      });  
		 }  
		}  
		function getTree() {
			var tree = [];
			var formData = new FormData();
			formData.requestId = "123456";
			tunicorn.utils.post("/files/files/listFolders", formData, function(err, result){
	        	if(err){
					noty({text: "服务器异常!", layout: "topCenter", type: "error", timeout: 2000});
					return;
				}
				if(result.success){
					var list_folders = result.data;
					tree = list_folders.nodes;
					return tree;
				}else{
					noty({text: result.errorMessage, layout: "topCenter", type: "error", timeout: 2000});
					return;
				}
	        });
			return tree;
		}
		$(function(){
	    	var tree = [];
			var formData = new FormData();
			formData.requestId = new Date().getTime();
			tunicorn.utils.post("/files/files/listFolders", formData, function(err, result){
	        	if(err){
					noty({text: "服务器异常!", layout: "topCenter", type: "error", timeout: 2000});
					return;
				}
				if(result.success){
					var list_folders = result.data;
					tree = list_folders.nodes;
				}else{
					noty({text: result.errorMessage, layout: "topCenter", type: "error", timeout: 2000});
					return;
				}
				$('#tree').treeview({data: tree});
	        });
	     });
	     
	     function itemOnclick(target){
	    
	     	e = target||window.event.target;
	      	var nodeid = $(target).attr('data-nodeid');  
    		var tree = $('#tree');  
			var node = tree.treeview('getNode', nodeid);  
			
		    if ($(target).children(".glyphicon").hasClass("glyphicon-plus") || $(target).children(".glyphicon").hasClass("glyphicon-minus")) 
			{
            	$(target).children(".glyphicon")[0].click();
 			}
 			console.info(node);
 			console.info(node.path);
 			var path = node.path
		    //var path = node.path.replace(/\\/g,'\\\\');
		    getFiles(path);  
      	 	/**
			var nodeid = $(target).attr('data-nodeid');  
			var tree = $('#tree');  
			
			var node = tree.treeview('getNode', nodeid);  
			 if ($(target).children(".glyphicon").hasClass("glyphicon-plus") || $(target).children(".glyphicon").hasClass("glyphicon-minus")) 
			{
            	$(target).children(".glyphicon")[0].click();
 			}
			var path = node.path.replace(/\\/g,'\\\\');
			getFiles(path);  
			**/
	     }
	     
	     function getFiles(path){
	     	var formData = new FormData();
			formData.requestId = new Date().getTime();
			formData.path = path;
			tunicorn.utils.post("/files/files/getPicFiles", formData, function(err, result){
	        	$("#content").html(result);
	        });
	     }
	     
	     function setPath(){
	     	$('#save_source').modal('show');
	     }
	     
	     function savePath(){
	     	var formData = new FormData();
			formData.requestId = new Date().getTime();
			formData.endPath = $("#endPath").val();
			tunicorn.utils.post("/files/files/setPath", formData, function(err, result){
	        	if(result.success){
	        		noty({text: "设置成功！", layout: "topCenter", type: "warning", timeout: 2000});
	        		$("#cancel_source_confirm").click();
	        	}else{
	        		noty({text: "设置失败！", layout: "topCenter", type: "warning", timeout: 2000});
	        	}
	        });
	     }
</script>
</html>
