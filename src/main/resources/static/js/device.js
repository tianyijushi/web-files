var prefix_url=tunicorn.contextPath, base_url = prefix_url+'/deploy/device/', source_base_url = prefix_url+'/deploy/videoCamera/',
    page_size = 8,
    _initCommonEvents = function(){
		$('.ajax-link').on('click', function(e){
			e.preventDefault(); 
			var url = $(this).attr('href');
			tunicorn.utils.get(url, function(data){
		    	$("#content").html(data);
		    });
		});
		//modal
		 $("#save_source").on("hidden.bs.modal", function() {
			 $('#source_form')[0].reset(); 
		     $("#sourceId").val("");
			 $("#videoCameraId").val(""); 
		});
	}, _initDevicePagination = function(currentPage, totalCount) {
		var options = {
				alignment: 'center',
		        currentPage: currentPage,
		        totalPages: Math.ceil(totalCount / page_size),
		        numberOfPages: page_size,
		        onPageClicked: function (event, originalEvent, type, page) {
		        	doDeviceSearch(page);
		        }
			};
			$('#table_paginator').bootstrapPaginator(options);
			$("#table_paginator").show();
	}, _initVideoCameraPagination = function(currentPage, totalCount) {
		var options = {
				alignment: 'center',
		        currentPage: currentPage,
		        totalPages: Math.ceil(totalCount / page_size),
		        numberOfPages: page_size,
		        onPageClicked: function (event, originalEvent, type, page) {
		        	doVideoCameraSearch(page);
		        }
			};
			$('#table_paginator').bootstrapPaginator(options);
			$("#table_paginator").show();
	}, _initDeviceEvents = function(){
		//delete service
		$('#table_content .delete').on('click', function(e){			
			var sid = $(this).attr('sid');
			template.modal.showDeleteModal(base_url+sid, base_url);
		});
		//add service
		$('#create_device').on('click', function(e){
			$('#device_form').attr('action', base_url+'create');
			$('#save_server').modal('show');
		});
		//update server
		$('#table_content .edit').on('click', function(e){	
			var sid = $(this).attr('sid');
			var $tr = $(this).parent().parent();
			var name = $tr.find('.name').text();
			var ip = $tr.find('.ip').text();
			var port = $tr.find('.port').text();
			var comment = $tr.find('.comment').text();
			$('#myModalLabel').text("更新服务器");
			$('#serverid').val(sid);
			$('#servername').val(name);
			$('#serveraddress').val(ip);
			$('#serverport').val(port);
			$('#comment').val(comment);
			$('#device_form').attr('action', base_url+'update');
			$('#save_server').modal('show');
		});
		//save server info
		$('#save_server_confrim').on('click', function(e){	
			var servername = $('#servername').val().trim();
			var serveraddress = $('#serveraddress').val().trim();
			var serverport = $('#serverport').val().trim();
			var comment = $('#comment').val().trim();
			if(servername=='' || serveraddress=='' || serverport==''){
				noty({text: "必填项不能为空!", layout: "topCenter", type: "warning", timeout: 2000});
				return;
			}
			var regex = new RegExp("^.{1,40}$");
			if(!regex.test(servername)){
				noty({text: "服务器名称不合法", layout: "topCenter", type: "warning", timeout: 2000});
				return false;
			}
			var regex = new RegExp("^\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}$");
			if(!regex.test(serveraddress)){
				noty({text: "IP地址格式不正确!", layout: "topCenter", type: "warning", timeout: 2000});
				return false;
			}
			var regex = new RegExp("^\\d{1,5}$");
			if(!regex.test(serverport)){
				noty({text: "端口号格式不正确!", layout: "topCenter", type: "warning", timeout: 2000});
				return false;
			}
			var regex = new RegExp("^.{0,100}$");
			if(!regex.test(comment)){
				noty({text: "备注长度应在100以内!", layout: "topCenter", type: "warning", timeout: 2000});
				return false;
			}
			tunicorn.utils.postForm($('#device_form'), function(err, data){
				if(err){
					noty({text: "服务器异常!", layout: "topCenter", type: "warning", timeout: 2000});
					return false;
				}
				if(data && data.success){
	            	noty({text: "保存成功!", layout: "topCenter", type: "success", timeout: 2000});
	            	$('#save_server').modal('hide');
	            	setTimeout(function(){
	            		tunicorn.utils.render(base_url);
	            	},500);
	            }else{
	               noty({text: data.errorMessage, layout: "topCenter", type: "error", timeout: 2000});
	            }
				
			});
		});
	},_initSourceEvents = function(){
		$("#save_source").on("hidden.bs.modal", function() {
		});
		//delete source
		$('#table_content .delete').on('click', function(e){			
			var videoCameraId = $(this).attr('sid');
			var sourceId = $(this).attr('sourceId');
			template.modal.showDeleteModal(source_base_url + sourceId + "/" + videoCameraId, source_base_url);
		});
		//add source
		$('#create_source').on('click', function(e){
			$('#source_form').attr('action', source_base_url + 'create');
			$('#save_source').modal('show');
		});
		//update source
		$('#table_content .edit').on('click', function(e){
			var sid = $(this).attr('sid');
			var sourceId = $(this).attr('sourceid');
			var $tr = $(this).parent().parent();
			var name = $tr.find('.name').text();
			var location = $tr.find('.location').text();
			//var ip = $tr.find('.ip').text();
			var rtsp = $tr.find('.rtsp').text();
			var comment = $tr.find('.comment').text();
			$('#myModalLabel').text("更新在线视频");
			$('#videoCameraId').val(sid);
			$("#sourceId").val(sourceId);
			$('#sourceName').val(name);
			//$('#sourceAddress').val(ip);
			$('#sourceLocation').val(location);
			//$('#sourceLocation').attr('title', location);
			$('#rtsp').val(rtsp);
			$('#cameraComment').val(comment);
			$('#source_form').attr('action', source_base_url + 'update');
			$('#save_source').modal('show');
		});

		//save source info 
		$('#save_source_confrim').on('click', function(e){	
			var sourceName = $('#sourceName').val().trim();
			//var sourceAddress = $('#sourceAddress').val().trim();
			var sourceLocation = $('#sourceLocation').val().trim();
			var rtsp = $('#rtsp').val().trim();
			var comment = $('#cameraComment').val().trim();
			if(sourceName==''  || sourceLocation=='' || rtsp==''){
				noty({text: "必填项不能为空!", layout: "topCenter", type: "warning", timeout: 2000});
				return;
			}
			var regex = new RegExp("^[\u4e00-\u9fa5a-zA-Z0-9\(\)_-]{1,20}$");
			if(!regex.test(sourceName)){
				noty({text: "名称应为1-20位之间的中英文、数字下划线等字符!", layout: "topCenter", type: "warning", timeout: 2000});
				return false;
			}
			/*var regex = new RegExp("^\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}$");
			if(!regex.test(sourceAddress)){
				noty({text: "IP地址格式不正确!", layout: "topCenter", type: "warning", timeout: 2000});
				return false;
			}*/
			var regex = new RegExp("^[\u4e00-\u9fa5a-zA-Z0-9\(\)_-]{1,80}$");
			if(!regex.test(sourceLocation)){
				noty({text: "位置应为1-80位之间的中英文、数字下划线等字符!", layout: "topCenter", type: "warning", timeout: 2000});
				return false;
			}
//			var regex = new RegExp("^[a-zA-Z0-9\\:\\/\\@\\._-]+$");
			if(rtsp.length>255){
				noty({text: "RTSP应在255个字符以内!", layout: "topCenter", type: "warning", timeout: 2000});
				return false;
			}
			var regex = new RegExp("^.{0,100}$");
			if(!regex.test(comment)){
				noty({text: "备注长度应在100以内!", layout: "topCenter", type: "warning", timeout: 2000});
				return false;
			}
			var sourceId =  $("#sourceId").val();
			var videoId =  $("#videoCameraId").val();
			var data ={};
			if(sourceId && videoId){
				data = {'name': sourceName, 'location': sourceLocation,'rtsp':rtsp, 'comment':comment,'id':videoId, 'sourceId':sourceId};
			}else{
				data = {'name': sourceName, 'location': sourceLocation,'rtsp':rtsp,'comment':comment};
			}
			var regex = new RegExp("^([0-9]+\.{0,1}[0-9]{0,})+\,+([0-9]+\.{0,1}[0-9]{0,})$");
			if(regex.test(sourceLocation)){
				data.coordinate = sourceLocation;
			}
			$.ajax({
				type: 'post',
				url: $('#source_form').attr('action'),
				data: JSON.stringify(data),
				contentType: 'application/json',
				success: function(data) {
					if(data && data.success){
						noty({text: "保存成功!", layout: "topCenter", type: "success", timeout: 2000});
						$('#save_source').modal('hide');
		            	setTimeout(function(){
		            		tunicorn.utils.render(source_base_url);
		            	},500);
		            }else{
		               noty({text: data.errorMessage, layout: "topCenter", type: "error", timeout: 2000});
		            }
				},
				error: function() {
					noty({text: "保存失败!", layout: "topCenter", type: "warning", timeout: 2000});
				}
			});
		});
	}, getByName = function($this){
		var $this = $('#search');
		var name = $this.val();
		if(name.trim()==''){
			noty({text: "请输入设备名!", layout: "topCenter", type: "warning", timeout: 2000});
			return;
		}
		var url = $this.attr('url')+"?name="+name;
		tunicorn.utils.get(url, function(data){
	    	$("#content").html(data);
	    });
	}, doDeviceSearch = function(pageNum) {
    	var searchValue = $("#deviceName").val();		    	
    	var page = 1;
    	if (pageNum) {
    		page = pageNum;
    	}
    	$.ajax({
			 type: 'GET',
			 url: d_url + '/deploy/device?name='+searchValue + '&page=' + page,
			 success: function(data) {
			 	$("#content").html(data);
        	},
        	error: function(data) {
        		//返回500错误页面
        		$("html").html(data.responseText);
        	}
		});		    
    }, doVideoCameraSearch = function(pageNum) {
    	var searchValue = $("#videoCameraName").val();		    	
    	var page = 1;
    	if (pageNum) {
    		page = pageNum;
    	}
    	$.ajax({
			 type: 'GET',
			 url: d_url + '/deploy/videoCamera?name='+searchValue + '&page=' + page,
			 success: function(data) {
			 	$("#content").html(data);
        	},
        	error: function(data) {
        		//返回500错误页面
        		$("html").html(data.responseText);
        	}
		});		    
    };
