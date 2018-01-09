var d_url=tunicorn.contextPath;
var groupUser=groupUser || {};
groupUser=(function(){
	function init(currentPage,totalCount){
		initPagination(currentPage, totalCount || 1);
		$("#groupSearch").click(function(){
			searchFace(0);
		});
		$("#save").click(function(){
			createFace();
		});
		$("#createPerson").on("hidden.bs.modal", function() {
            $('#createPeople')[0].reset();
            $("#errorMsg").text("");
            $("#batchErrorMsg").text("");
       });
       $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
       	 $('#createPeople')[0].reset();
            $("#errorMsg").text("");
            $("#batchErrorMsg").text("");
        });
       $('#modal-group-select').selectpicker({
	    	width: '100%'
	    });
       $(".modal-group-select-edit").selectpicker({
       	width: '100%'
       });
       $('#batchUpload').click(function(event) {
			var directory = $("#batch_directory").val();
			var group = $("#batch_group").val();
			if (directory == "") {
				$('#batchErrorMsg').text("请输入文件目录路径");
				return;
			}
			var invalid =/[`~!@#$%^&*+=<>,.?;"|(){}\'[\]]/im;
			if (invalid.test(directory)){
				$('#batchErrorMsg').text("输入文件目录不合法");
				return;
			}
			if (group == "") {
				$('#batchErrorMsg').text("请选择比对库");
				return;
			}
			var data = {"directory": directory, "groupId": group};
	    	$.ajax({
				 type: 'POST',
				 url: d_url + '/batch/face',
				 contentType : 'application/json',
				 data: JSON.stringify(data),
				 dataType: 'json', 
				 success: function(data) {
				 	if (data.success) {
				 		noty({text: data.data, layout: 'topCenter', type: 'warning', timeout: 2000});
				 		$('#createPerson').modal('hide');
				 		setTimeout(function(){
				 			$.ajax({
								 type: 'GET',
								 url: d_url + '/group/user',
								 success: function(data) {
								 	$("#content").html(data);
					        	},
					        	error: function(data) {
					        		//返回500错误页面
					        		$("html").html(data.responseText);
					        	}
							});
				 		},1000)
				 		
				 	} else {
				 		$('#batchErrorMsg').text(data.errorMessage);
				 	}
	        	},
	        	error: function(data) {
	        		//返回500错误页面
	        		$("html").html(data.responseText);
	        	}
			});
		}); 
       
	}
	function initPagination(currentPage, totalCount) {
		var options = {
			alignment: 'center',
	        currentPage: currentPage,
	        totalPages: Math.ceil(totalCount / dface.constants.PAGINATION_ITEMS_PER_PAGE),
	        numberOfPages: dface.constants.PAGINATION_ITEMS_PER_PAGE,
	        onPageClicked: function (event, originalEvent, type, page) {
	        	doPaginationClicked(page);
	        }
		};
		
		$('#table_paginator').bootstrapPaginator(options);
		$("#table_paginator").show();
	};
	
	function doPaginationClicked(pageNum) {
		searchFace(pageNum);
	};
	
	function searchFace (pageNum) {
    	var name = $("#name").val();
    	var idNumber = $("#idNumber").val();
    	var sex = $("#sex").val();
    	var criminal = $("#criminal").val();
    	var idType = $("#idType").val();
    	var group = $("#group").val();
    	var page = 0;
    	if (pageNum) {
    		page = pageNum -1;
    	}
    	showMask();
    	$.ajax({
			 type: 'GET',
			 url: d_url + '/group/user/search?name=' 
			 		+ name + '&groupId=' + group + '&sex=' + sex + '&idCard=' + idNumber + '&criminalRecord=' + criminal + '&idType=' + idType + '&pageNum=' + page,
			 success: function(data) {
				 hideMask();
			 	$("#content").html(data);
        	},
        	error: function(data) {
        		//返回500错误页面
        		hideMask();
        		$("html").html(data.responseText);
        	}
		});
    };
    
    function showModal (faceId) {
		$.ajax({
			 type: 'GET',
			 url: d_url + '/group/user/' + faceId + '/asset',
			 success: function(data) {
			 	if (data.success) {
			 		var assets = data.data;
			 		for (var index = 0; index < assets.length; index++) {
			 			var asset = assets[index];
			 			if ($("#face_asset_"+asset.id).length > 0) {
			 				continue;
			 			}
			 			$("#row_asset_" + faceId).append(
			 			'<div class="col-sm-3" id="face_asset_'+ asset.id +  '">' +
						'<div class="thumbnail" style="">' + 
						'<div class="pull-right">' +
						'<a href="javascript:void(0)" onclick="groupUser.deleteAsset(' + asset.id + ');" class=" glyphicon glyphicon-remove" style="color:red"></a>' +
						'</div>' + 
						'<img style="width: 130px;height: 130px" src="' + asset.realFilePath + '" alt="">' +
						'</div>' + 										   
						'</div>'										  
			 			);
			 		}
			 		$("#addAsset_" + faceId).modal({
					  backdrop: false
					});
			 	}
        	},
        	error: function(data) {
        		//返回500错误页面
        		$("html").html(data.responseText);
        	}
		});
	};
	function createFace(){
		var name = $("#name_create").val();
		var groups = $('#modal-group-select').val();
		var sex = $("#sex_create").val();
		var criminal = $("#criminal_create").val();
		var id = $("#id_create").val();
		var idCard = $("#idcard_create").val();
		var comment = $("#comment_create").val();
		var files =  document.getElementById("images").files;
		if (files.length == 0) {
			$('#errorMsg').text("请选择人员图片");
			return;
		}
		if (files.length > 5) {
			$('#errorMsg').text("请选择少于6张图片");
			return;
		}
		if (name == "") {
			$('#errorMsg').text("请输入人员名称");
			return;
		}
		if (name && name.length > 128) {
			$('#errorMsg').text("人员名称请输入不大于128个字符");
			return;
		}
		if (!groups) {
			$('#errorMsg').text("请选择比对库");
			return;
		}
		if (sex == null || sex == "") {
			$('#errorMsg').text("请选择性别");
			return;
		}
		if (criminal == "") {
			$('#errorMsg').text("请选择是否有案底");
			return;
		}
		if (id == "") {
			$('#errorMsg').text("请选择证件类型");
			return;
		}
		if (idCard == "") {
			$('#errorMsg').text("请输入证件号");
			return;
		}
		if (idCard && idCard.length > 64) {
			$('#errorMsg').text("证件号请输入不大于64个字符");
			return;
		}
		var formData = new FormData();
		for (var i = 0; i < files.length; i++) {
  			var file = files[i];
  			if (!checkFile(file)) {
  			//$('#errorMsg').text("您选择的图片大于5M, 请重新选择小于5M的图片上传");
  				return;
  			}
  			formData.append('images', file, file.name);
		}
		formData.append("name", name);
		formData.append("sex", sex);
		formData.append("groupIds", groups);
		formData.append("criminalRecord", criminal);
		formData.append("idType", id);
		formData.append("idCard", idCard);
		formData.append("comment", comment);
    	$.ajax({
			 type: 'POST',
			 url: d_url + '/group/user/create',
			 contentType : false,
			 data: formData,
			 processData: false,
			 success: function(data) {
			 	if (data.success) {
			 		$('#createPerson').modal('hide');
			 		setTimeout(function(){
			 			$.ajax({
							 type: 'GET',
							 url: d_url + '/group/user',
							 success: function(data) {
							 	$("#content").html(data);
				        	},
				        	error: function(data) {
				        		//返回500错误页面
				        		$("html").html(data.responseText);
				        	}
						});
			 		},1000)
			 		
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
    function checkFile(file) {
        if ((file.size/1024/1024) > 5) {
			$('#errorMsg').text("您选择的图片大于5M, 请重新选择小于5M的图片上传");
			return false;
		}
        return true;
    };
    function addAsset(groupId, faceId){
		var formData = new FormData();
		var files =  document.getElementById("asset_" + faceId).files;
		if (files.length == 0) {
			noty({text: "请选择待添加的图片", layout: 'topCenter', type: 'warning', timeout: 2000});
			return;
		}
		if (files.length > 5) {
			noty({text: "请选择少于6张图片", layout: 'topCenter', type: 'warning', timeout: 2000});
			//alert("请选择少于5张图片");
			return;
		}
		for (var i = 0; i < files.length; i++) {
  			var file = files[i];
  			if (!checkFile(file)) {
  				return;
  			}
  			formData.append('images', file, file.name);
		}
    	$.ajax({
			 type: 'POST',
			 url: d_url + '/group/user/'+ faceId + '/asset',
			 contentType : false,
			 data: formData,
			 processData: false,
			 success: function(data) {
			 	if (data.success) {
			 		var assets = data.data;
			 		for (var index = 0; index < assets.length; index++) {
			 			var asset = assets[index];
			 			$("#row_asset_" + faceId).prepend(
			 			'<div class="col-sm-3" id="face_asset_'+ asset.id +  '">' +
						'<div class="thumbnail" style="">' + 
						'<div class="pull-right">' +
						'<a href="javascript:void(0)" onclick="groupUser.deleteAsset(' + asset.id + ');" class=" glyphicon glyphicon-remove" style="color:red"></a>' +
						'</div>' + 
						'<img style="width: 130px;height: 130px" src="' + asset.realFilePath  + '" alt="">' +
						'</div>' + 										   
						'</div>'										  
			 			);
			 		}
			 	}else{
			 		var message = data.errorMessage;
			 		if(data.errorCode == 40016){
			 			message =  data.errorMessage + ", 不能添加人员图片";
			 		}
			 		noty({text: message, layout: 'topCenter', type: 'warning', timeout: 2000});
			 		return;
			 	}
        	},
        	error: function(data) {
        		//返回500错误页面
        		$("html").html(data.responseText);
        	}
		});
    };
    function deleteAsset(assetId){
		var data = {"status":"deleted"};
    	$.ajax({
			 type: 'PUT',
			 url: d_url + '/group/user/asset/' + assetId,
			 contentType : 'application/json',
			 data: JSON.stringify(data),
			 dataType: 'json', 
			 success: function(data) {
			 	if (data.success) {
			 		$("#face_asset_" + assetId).remove();
			 	}
        	},
        	error: function(data) {
        		//返回500错误页面
        		$("html").html(data.responseText);
        	}
		});
    }; 
    function deleteFace(faceId){
		var data = {"status":"deleted"};
    	$.ajax({
			 type: 'PUT',
			 url: d_url + '/group/user/' + faceId,
			 contentType : 'application/json',
			 data: JSON.stringify(data),
			 dataType: 'json', 
			 success: function(data) {
			 	if (data.success) {
			 		$('#deleteFace_' + faceId).modal('hide');
			 		setTimeout(function(){
			 			$("#row_" + faceId).remove();
			 		},500)
			 		
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
    function editFace(faceId){
		var name = $("#name_edit_" + faceId).val();
		var group = $("#group_edit_" + faceId).val();
		var groups = $("#modal-group-select-edit" + faceId).val();
		var sex = $("#sex_edit_"  + faceId).val();
		var criminal = $("#criminal_edit_"  + faceId).val();
		var id = $("#id_edit_"  + faceId).val();
		var idCard = $("#idcard_edit_"  + faceId).val();
		var comment = $("#comment_edit_"  + faceId).val();
		if (name == "") {
			$('#errorMsg_' + faceId).text("请输入人员名称");
			return;
		}
		if (name && name.length > 128) {
			$('#errorMsg_' + faceId).text("人员名称请输入不大于128个字符");
			return;
		}
		if (!groups) {
			$('#errorMsg_' + faceId).text("请选择比对库");
			return;
		}
		if (sex == null || sex == "") {
			$('#errorMsg_' + faceId).text("请选择性别");
			return;
		}
		if (criminal == "") {
			$('#errorMsg_' + faceId).text("请选择是否有案底");
			return;
		}
		if (id == "") {
			$('#errorMsg_' + faceId).text("请选择证件类型");
			return;
		}
		if (idCard == "") {
			$('#errorMsg_' + faceId).text("请输入证件号");
			return;
		}
		if (idCard && idCard.length > 64) {
			$('#errorMsg_' + faceId).text("证件号请输入不大于64个字符");
			return;
		}
		var data = {"name":name,"groupIds":groups.join(","),"sex":sex,"idCard":idCard,"criminalRecord":criminal,"idType":id,"comment":comment};
    	$.ajax({
			 type: 'PUT',
			 url: d_url + '/group/user/' + faceId,
			 contentType : 'application/json',
			 data: JSON.stringify(data),
			 dataType: 'json', 
			 success: function(data) {
			 	if (data.success) {
			 		$('#editperson_' + faceId).modal('hide');
			 		setTimeout(function(){
			 			$.ajax({
							 type: 'GET',
							 url: d_url + '/group/user',
							 success: function(data) {
							 	$("#content").html(data);
				        	},
				        	error: function(data) {
				        		//返回500错误页面
				        		$("html").html(data.responseText);
				        	}
						});
			 		},500)
			 		
			 	} else {
			 		$('#errorMsg_' + faceId).text(data.errorMessage);
			 	}
        	},
        	error: function(data) {
        		//返回500错误页面
        		$("html").html(data.responseText);
        	}
		});
    };
    function showMask(){
		 var top = ($(window).height() - $(".loading_1").height())/2;   
	     var left = ($("#content").offsetWidth - $(".loading_1").width())/2;   
	     var scrollTop = $(document).scrollTop();   
	     var scrollLeft = $(document).scrollLeft();   
		  $(".loading").css({"top":top + scrollTop,"left":left + scrollLeft,"display":"block"});
		  $(".mask").height(document.body.scrollHeight);
		  $(".mask").width(document.body.offsetlWidth);
		  $(".mask").fadeTo(200, 0.2);
	  
	}
	function hideMask(){
		$(".loading").css("display","none");
	    $(".mask").fadeOut(200);
	} 
	return {
		_init:init,
		showModal:showModal,
		addAsset:addAsset,
		deleteAsset:deleteAsset,
		deleteFace:deleteFace,
		editFace:editFace
	}
})()