var d_url=tunicorn.contextPath;
var deployOffline=window.deployOffline || {};
deployOffline=(function(){
	var videoFormatArray = ['avi', '3gp', 'wmv', 'flv', 'rmvb', 'mov', 'mkv', 'rm', 'mpeg', 'mp4'];
	var page_size = 8;
	function init(currentPage, totalCount){
		//getVideoOfflineList();
		if(totalCount != "0"){
			initOfflinePagination(currentPage, totalCount);
		}
		initDate();
		 $("#offline-modal").on("hidden.bs.modal", function() {
				$('#offline_form')[0].reset(); 
				$("#sourceId").val("");
				$("#videoId").val(""); 
		 });
		 $("#add-offline-video").click(function(){
				var dateData = getInitDate();
				$('#fromDate').val(dateData['startDate']);
				getVideoCameraList();
				$("#video-label").text("新增离线视频")
				$("#offline-modal").modal("show");
			});
			$('#table_content .edit').on('click', function(e){
				showEditModal(this);
			});
			$('#table_content .delete').on('click', function(e){			
				var videoOfflineId = $(this).attr('sid');
				var sourceId = $(this).attr('sourceId');
				template.modal.showDeleteModal(d_url + '/deploy/videoOffline/' + sourceId + '/' + videoOfflineId, d_url + '/deploy/videoOffline/');
			});
			$("#offline-edit").click(function(){
				$("#video-label").text("更新离线视频")
				$("#offline-modal").modal("show");
			});
			$("#save_video_confrim").on('click',function(){
				var videoName=$.trim($("#videoName").val());
				var videoPath=$.trim($("#videoPath").val());
				var startTimeStr = $.trim($('#fromDate').val());
				var comment = $("#comment").val();
				var cameraId = $("#relate_camera").val();
				if(startTimeStr.split(':').length == 2) {
					startTimeStr += ':00';
				}
				$("#startTime").val(startTimeStr);
				if(videoName=='' || videoPath=='' || startTimeStr==''){
					noty({text: "必填项不能为空!", layout: "topCenter", type: "warning", timeout: 2000});
					return;
				}
				var regex = new RegExp("^[\u4e00-\u9fa5a-zA-Z0-9\(\)_-]{1,20}$");
				if(!regex.test(videoName)){
					noty({text: "名称应为1-20位之间的中英文、数字下划线等字符!", layout: "topCenter", type: "warning", timeout: 2000});
					return false;
				}
				var regex =new RegExp("(^//.|^/|^[a-zA-Z])?:?/.+(/$)?");
				if (!regex.test(videoPath)){
					noty({text: "输入文件路径不合法!", layout: "topCenter", type: "warning", timeout: 2000});
					return;
				}
				if(videoPath){
					var index = videoPath.lastIndexOf(".");
					var fileExt = videoPath.substring(index + 1, videoPath.length).toLowerCase();
					if($.inArray(fileExt, videoFormatArray) == -1){
						noty({text: "文件格式不支持!", layout: "topCenter", type: "warning", timeout: 2000});
						return;
					}
				}
				var sourceId =  $("#sourceId").val();
				var videoId =  $("#videoId").val();
				var data ={};
				if(sourceId && videoId){
					data = {'name': videoName,'filePath': videoPath, 'startTimeStr': startTimeStr,'comment':comment,'id':videoId, 'sourceId':sourceId, 'cameraId':cameraId};
				}else{
					data = {'name': videoName,'filePath': videoPath, 'startTimeStr': startTimeStr,'comment':comment, 'cameraId' :cameraId};
				}
				$.ajax({
					type: 'post',
					url: $('#offline_form').attr('action'),
					data: JSON.stringify(data),
					contentType: 'application/json',
					success: function(data) {
						if(data && data.success){
			            	noty({text: "保存成功!", layout: "topCenter", type: "success", timeout: 2000});
			            	$("#offline-modal").modal("hide");
			            	setTimeout(function(){
			            		 tunicorn.utils.render(d_url + "/deploy/videoOffline");
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
			$("#offline-delete").click(function(){
				$("#delete_video").modal("show");
			});
			
			$("#delete_camera_confrim").on('click',function(){
				var sourceId = $("#delete_camera_confrim").attr("sourceId");
				var videoOfflineId = $("#delete_camera_confrim").attr("videoOfflineId");
				$.ajax({
					type: 'DELETE',
					url:  d_url + '/deploy/videoOffline/'+sourceId+'/'+videoOfflineId,
					success: function(data) {
						if(data && data.success){
			            	noty({text: "删除成功!", layout: "topCenter", type: "success", timeout: 2000});
			            	setTimeout(function(){
			            		getVideoOfflineList(); 
			            	},500);
			            }else{
			               noty({text: data.errorMessage, layout: "topCenter", type: "warning", timeout: 2000});
			            }
					},
					error: function() {
						noty({text: "删除失败!", layout: "topCenter", type: "warning", timeout: 2000});
					}
				});
				
			});
	};
	function getInitDate() {
		var current = moment();
		return {'startDate': current.format('YYYY-MM-DD HH:mm:ss'), 'endDate': current.add(1, 'M').format('YYYY-MM-DD HH:mm:ss')};
	};
	function initDate() {
		var dateData = getInitDate();
		$("#fromDate").val(dateData['startDate']);
		
		//时间段显示
		$('.form_datetime1').datetimepicker({
			format: 'yyyy-mm-dd hh:ii:ss',
			language: 'zh-CN',
		    todayBtn : "linked",
		    autoclose:true ,
		    endDate : new Date()
		})
	};
	function getVideoOfflineList(pageNum, name) {
		if(!pageNum){
			pageNum = 1;
		}
		if(!name && name!=0){
			name = '';
		}
		$.ajax({
			type : "GET",
			url : d_url + '/deploy/videoOffline?page=' + pageNum +"&name=" + name,
			success : function(data) {
				var html = '';
				$("#totalOffline").html("共0个");
				if(data.data && data.data.sources && data.data.sources.length > 0){
					$("#totalOffline").html("共"+data.data.pageBO.total+"个");
					var pageHtml = '';
					if(pageNum && pageNum > 1){
						pageHtml += '<a onclick="deployOffline.getVideoOfflineList('+(pageNum - 1)+',\''+name+'\')" href="javascript:void(0)" data-dismiss="modal" style="display: inline-block;" class="btn btn-default perpage ajax-link"">上一页</a>';
					}
					var page = '';
					if(pageNum && data.data.pageBO.totalPage){
						page = pageNum +'/'+data.data.pageBO.totalPage;
					}else{
						page ='1/1';
					}
					pageHtml += '<span class="pagenum" style="margin:0 5px;">'+page+'</span>';
					if(pageNum && pageNum<data.data.pageBO.totalPage){
						pageHtml += '<a onclick="deployOffline.getVideoOfflineList('+(pageNum + 1)+',\''+name+'\')" href="javascript:void(0)" data-dismiss="modal" page="${page+1}" class="btn btn-default nextpage ajax-link" style="display: inline-block;">下一页</a>';
					}
					$("#pageFinder").html(pageHtml);
					var canEditOffline = $("#canEditOffline").val();
					var canDeleteOffline = $("#canDeleteOffline").val();
					for(var i=0;i<data.data.sources.length;i++){
						var source = data.data.sources[i];
						var comment = source.comment==null?'':source.comment;
						var cameraName = source.cameraName==null?'':source.cameraName;
						html += '<tr class="captureTable">'+
		                        '<td class="name" style="width:100px;word-wrap: break-word;">'+source.name+'</td>'+
		                        '<td class="filePath"><p style="width:250px;word-wrap: break-word;" title="'+source.filePath+'">'+source.filePath+'</p></td>'+
		                        '<td class="">'+cameraName+'</td>'+
		                        '<td class="startTime">'+source.startTimeStr+'</td>'+
		                        '<td class="comment"><p class="line" title="'+comment+'">'+comment+'</p></td>';
		                        if(canEditOffline == 'true' || canDeleteOffline == 'true'){
		                        	html += '<td>';
		                        	if(canEditOffline == 'true'){
				                        html +=  '<button style="margin-right:5px;" sourceid="'+source.sourceId+'" videoid="'+source.id+'" sourcename="'+source.name+'" filepath="'+source.filePath+'" starttime="'+source.startTimeStr+'" comment="'+comment+'"'+
					                  	'cameraid="'+source.cameraId+'" onclick="deployOffline.showEditModal(this)" title="编辑" class="btn btn-sm btn-success glyphicon glyphicon-pencil" id="offline-edit"></button>';
				                    }
				                    if(canDeleteOffline == 'true'){
				                        html += '<button sourceid="'+source.sourceId+'" videoid="'+source.id+'"  onclick="deployOffline.showDeleteModal(this)" title="删除" class="btn btn-sm btn-danger glyphicon glyphicon-trash" id="offline-delete"></button>';
				                    }
				                   html += '</td>';
		                        }
		                       html +='</tr>';
					}
				}

				$("#offlineContent").html(html);
			},
		});
	};
	function showEditModal(_this){
		var sid = $(_this).attr('sid');
		var sourceId = $(_this).attr('sourceid');
		var $tr = $(_this).parent().parent();
		var sourceName = $tr.find('.name').text();
		var filePath = $tr.find('.filePath').text();
		var startTime = $tr.find('.startTimeStr').text();
		var comment = $tr.find('.comment').text();
		var cameraId = $tr.find('.cameraName').attr("cameraid");
		
		$('#videoName').val(sourceName);
		$("#videoPath").val(filePath);
		$('#startTime').val(startTime);
		$("#fromDate").val(startTime);
		$('#comment').val(comment);
	    $("#sourceId").val(sourceId);
	    $("#videoId").val(sid);
	    $("#relate_camera").val(cameraId);
		$('#offline_form').attr('action', d_url + '/deploy/videoOffline/update');
		getVideoCameraList(cameraId);
		$("#video-label").text("更新离线视频");
		$("#offline-modal").modal("show");
	};
	function showDeleteModal(_this){
		$("#delete_camera_confrim").attr("sourceId",$(_this).attr('sourceid'));
		$("#delete_camera_confrim").attr("videoOfflineId",$(_this).attr('videoid'));
		$("#delete_video").modal("show");
	};
	
	function  getOfflineByName(){
		var $this = $('#offlineSearch');
		var name = $this.val();
		if(name.trim()==''){
			noty({text: "请输入离线视频名称!", layout: "topCenter", type: "warning", timeout: 2000});
			return;
		}
		var url = $this.attr('url')+"?name="+name;
		tunicorn.utils.get(url, function(data){
	    	$("#content").html(data);
	    });
	};
	
	function getVideoCameraList(cameraId){
		$.ajax({
			type: 'GET',
			url: d_url + '/deploy/videoCameraList',
			success: function(data) {
				if(data && data.success && data.data){
	             var optionHtml = '<option value="">请选择摄像头</option>';
	             if(data.data.length > 0){
	            	 for(var i = 0; i < data.data.length; i++){
	            		 var cameraInfo = data.data[i];
	            		 if(cameraId && cameraId == cameraInfo.id){
	            			 optionHtml += '<option value="' + cameraInfo.id + '" selected="selected">'+cameraInfo.name+'</option>'; 
	            		 }else{
	            			 optionHtml += '<option value="' + cameraInfo.id + '">'+cameraInfo.name+'</option>'; 
	            		 }
	            		 
	            	 }
	            	 $("#relate_camera").html(optionHtml);
	             }
	            }
			},
			error: function() {
				noty({text: "删除失败!", layout: "topCenter", type: "warning", timeout: 2000});
			}
		});
	};
	function initOfflinePagination(currentPage, totalCount) {
		var options = {
				alignment: 'center',
		        currentPage: currentPage,
		        totalPages: Math.ceil(totalCount / page_size),
		        numberOfPages: page_size,
		        onPageClicked: function (event, originalEvent, type, page) {
		        	doOfflineSearch(page);
		        }
			};
			$('#table_paginator').bootstrapPaginator(options);
			$("#table_paginator").show();
	};
	function doOfflineSearch(pageNum) {
	    	var searchValue = $("#offlineName").val();		    	
	    	var page = 1;
	    	if (pageNum) {
	    		page = pageNum;
	    	}
	    	$.ajax({
				 type: 'GET',
				 url: d_url + '/deploy/videoOffline?name='+searchValue + '&page=' + page,
				 success: function(data) {
				 	$("#content").html(data);
	        	},
	        	error: function(data) {
	        		//返回500错误页面
	        		$("html").html(data.responseText);
	        	}
			});		    
	    }
	return {
		_init:init,
		getVideoOfflineList:getVideoOfflineList,
		getOfflineByName:getOfflineByName,
		showEditModal:showEditModal,
		showDeleteModal:showDeleteModal
	}
})();
