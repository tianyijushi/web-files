var d_url=tunicorn.contextPath;
var userManage=userManage || {};
userManage=(function(){	
	var originalFaceIds = [];
	var originalFaces = [];
	//var groupId = groupId;
	var person_search_result_template = '<div class="col-sm-3 filtered-person-card" fid={{fid}}>' +
	'<div class="thumbnail">' +
		'<input type="checkbox" class="pull-right person-selected" {% if(existed) { %}checked="checked" disabled="disabled"{% } %} />' +
		'<img class="person-image showLargePic"  faceAssetId="{{faceAssetId}}" style="width: 140px;height: 140px;" src="{{imgSrc}}" alt="人员图片">' +
		'<div class="caption">' +
			'<p class="line" title="{{name}}">姓名：<span class="person-name">{{name}}</span></p>' +
			'<p class="line" title="{{idCard}}">证件号：<span class="person-idcard">{{idCard}}</span></p>' +
		'</div>' +
	'</div>' +
'</div>';

	var person_card_template = '<div class="col-sm-2 person-card" fid="{{fid}}" style="width:20%">' +
	'<div class="thumbnail">' +
		'<a href="javascript:void(0);" class="glyphicon glyphicon-remove pull-right remove"></a>' +
		'<img class="showLargePic" faceAssetId="{{faceAssetId}}" src="{{imgSrc}}" alt="照片">' +
		'<div class="caption">' +
			'<p class="line" title="{{name}}">姓名：<span>{{name}}</span></p>' +
			'<p class="line" title="{{idCard}}">证件号：<span>{{idCard}}</span></p>' +
		'</div>' +
	'</div>' +
	'</div>';

	_.templateSettings = {
	interpolate: /\{\{(.+?)\}\}/g,
	evaluate: /\{\%(.+?)\%\}/g
	};

	var personSearchResultTemplate = _.template(person_search_result_template);
	var personCardTemplate = _.template(person_card_template); 
	function init(groupId){		
		$('#search_btn').click(function(){
			searchBtn();
		});
		
		$("#search_content").keydown(function(){
			var event=arguments.callee.caller.arguments[0]||window.event;
	        if(event.keyCode==13){
				searchBtn();
			}
		});
		
		$('#group_person_container').on('click', 'a.remove', function() {
			var $parent = $(this).parents('div.person-card');
			var fid = parseInt($parent.attr('fid'));
			
			$.each(originalFaces, function(index, item) {
				if(item.fid === fid) {
					originalFaces.splice(index, 1);
					return false;
				}
			});
			
			gotoFirstPage();
		});
		$('#modal_confirm_btn').click(function() {
			$('input.person-selected:checked:not(:disabled)').each(function(index, dom) {
				var $parent = $(dom).parents('div.filtered-person-card');
			
				originalFaces.unshift({'fid': parseInt($parent.attr('fid')), 'imgSrc': $parent.find('.person-image').attr('src'), 
									'name': $parent.find('.person-name').text(), 'idCard': $parent.find('.person-idcard').text()});
			});
			
			$('#add_person_model').modal('hide');
			gotoFirstPage();
		});
		
		$('#save_btn').click(function() {
			var faceIds = [];
			
			$.each(originalFaces, function(index, item) {
				faceIds.push(item.fid);
			});
			
			var addedFaceIds = _.difference(faceIds, originalFaceIds);
			var deletedFaceIds = _.difference(originalFaceIds, faceIds);
			
			$.ajax({
				type: 'POST',
				url: d_url + '/group/savePerson',
				contentType : 'application/json',
				data: JSON.stringify({'addedFaceIdList': addedFaceIds, 'deletedFaceIdList': deletedFaceIds, 'groupId': groupId}),
				dataType: 'json', 
				success: function(resp) {
					if(!resp.success) {
						noty({text: resp.errorMessage, layout: 'topCenter', type: 'error', timeout: 2000});
						return;
				 	}
				 	
				 	$.ajax({
						 type: 'GET',
						 url: d_url + '/group/config',
						 success: function(data) {
						 	$("#content").html(data);
				         },
				         error: function(data) {
				        	noty({text: '打开底库配置页面失败', layout: 'topCenter', type: 'error', timeout: 2000});
				         }
					});
	        	},
	        	error: function(resp) {
	        		noty({text: '保存人员失败', layout: 'topCenter', type: 'error', timeout: 2000});
	        	}
			});
		});
		
		$('#cancel_btn').click(function() {
			$.ajax({
				 type: 'GET',
				 url: d_url + '/group/config',
				 success: function(data) {
				 	$("#content").html(data);
		         },
		         error: function(data) {
		        	noty({text: '打开底库配置页面失败', layout: 'topCenter', type: 'error', timeout: 2000});
		         }
			});
		});
		
		initData(groupId);
	};
	

	function searchBtn(){
		var data = {};
		var inputValue = $.trim($('#search_content').val());
		
		if(!inputValue) {
			noty({text: '请输入搜索内容', layout: 'topCenter', type: 'warning', timeout: 2000});
			return;
		}
		
		switch($('#search_select').val()) {
			case 'name':
				data['searchName'] = inputValue;
				break;
			case 'idCard':
				data['searchIdCard'] = inputValue;
				break;
			default:
				break;
		}
	
		$.ajax({
			type: 'POST',
			url: d_url + '/group/filterPerson',
			contentType : 'application/json',
			data: JSON.stringify(data),
			dataType: 'json', 
			success: function(data) {
				if(!data.success) {
					noty({text: data.errorMessage, layout: 'topCenter', type: 'error', timeout: 2000});
					return;
			 	}
			 	
			 	var existedPersonIds = [];
			 	$.each(originalFaces, function(index, item) {
					existedPersonIds.push(item.fid);
				});
			 	
			 	var faces = data.data;
			 	$('#filter_person_container').empty();
			 	
			 	$.each(faces, function(index, item) {
			 		$('#filter_person_container').append(personSearchResultTemplate({'fid': item.id, 'imgSrc': item.assets[0] ? item.assets[0].realFilePath : d_url + '/image/empty.jpg', 
			 		'name': item.name, 'idCard': item.idCard, 'existed': $.inArray(item.id, existedPersonIds) > -1, 'faceAssetId':item.assets[0] ? item.assets[0].id:''}));
			 	});
			 	var isCropper = $("#isCropper").val();
			 	if(isCropper && isCropper == 'true'){
				 	$('.showLargePic').click(function() {
						var captureFilePath = $(this).attr('src');
						var faceAssetId = $(this).attr('faceAssetId');
						$("#bigImage").attr("src", captureFilePath);
						$("#bigCaptureImageModal").modal('show');
						$('#bigImage').cropper('destroy');
						getFaceAssetById(faceAssetId);
				 	});
			 	}

			 	$('#add_person_model').modal('show');
        	},
        	error: function(data) {
        		noty({text: '搜索人员失败', layout: 'topCenter', type: 'error', timeout: 2000});
        	}
		});
		
	};
	function renderExistedPersonContainer(currentPage, pageSize, personList) {
		$('#existed_person_container').empty();
		
		var items = [];
		if (currentPage < Math.ceil(personList.length / pageSize)) {
			items = personList.slice((currentPage - 1) * pageSize, currentPage * pageSize);
		} else {
			items = personList.slice((currentPage - 1) * pageSize);
		}
		
		if(items.length) {
			$.each(items, function(index, item) {
				$('#existed_person_container').append(personCardTemplate({'fid': item.fid, 'imgSrc': item.imgSrc, 'name': item.name, 'idCard': item.idCard, 'faceAssetId':item.faceAssetId}));
			});
		 	var isCropper = $("#isCropper").val();
		 	if(isCropper && isCropper == 'true'){
			 	$('.showLargePic').click(function() {
					var captureFilePath = $(this).attr('src');
					var faceAssetId = $(this).attr('faceAssetId');
					$("#bigImage").attr("src", captureFilePath);
					$("#bigCaptureImageModal").modal('show');
					$('#bigImage').cropper('destroy');
					getFaceAssetById(faceAssetId);
			 	});
		 	}

		}
	};
	function initPagination(currentPage, personList) {
		var options = {
			alignment: 'center',
	        currentPage: currentPage,
	        totalPages: Math.ceil((personList.length || 1) / dface.constants.PAGINATION_ITEMS_PER_PAGE),
	        numberOfPages: dface.constants.PAGINATION_ITEMS_PER_PAGE,
	        onPageClicked: function (event, originalEvent, type, page) {
	        	renderExistedPersonContainer(page, dface.constants.PAGINATION_ITEMS_PER_PAGE, personList);
	        }
		};
		
		$('#table_paginator').bootstrapPaginator(options);
		$("#table_paginator").show();
	};
	function gotoFirstPage() {
		renderExistedPersonContainer(1, dface.constants.PAGINATION_ITEMS_PER_PAGE, originalFaces);
		initPagination(1, originalFaces);
	};
	function initData(groupId) {
		$.ajax({
			type: 'POST',
			url: d_url + '/group/fetchPerson',
			contentType: 'application/x-www-form-urlencoded',
			data: {'groupId': groupId},
			dataType: 'json', 
			success: function(data) {
				if(!data.success) {
					noty({text: data.errorMessage, layout: 'topCenter', type: 'error', timeout: 2000});
					return;
			 	}
			 	
			 	$.each(data.data, function(index, face) {
			 		originalFaces.push({'fid': face.id, 'imgSrc': face.assets[0] ? face.assets[0].realFilePath : contextPath + '/image/empty.jpg', 'name': face.name,
			 				'idCard': face.idCard, 'faceAssetId':face.assets[0] ? face.assets[0].id:''});
			 		originalFaceIds.push(parseInt(face.id));
			 	});
			 	
			 	gotoFirstPage();
        	},
        	error: function(data) {
        		noty({text: '查找底库人员失败', layout: 'topCenter', type: 'error', timeout: 2000});
        	}
		});
	};
	function getFaceAssetById(faceAssetId) {
		$.ajax({
			type: 'POST',
			url: d_url + '/group/person/' +faceAssetId,
			contentType: 'application/json',
			dataType: 'json', 
			success: function(data) {
				if(!data.success) {
					noty({text: data.errorMessage, layout: 'topCenter', type: 'error', timeout: 2000});
					return;
			 	}
				if(data.data){
					var keypoint = data.data.keypoint;
					var newKeypoint = keypoint.split(" ");
					if(keypoint){
				 	  	$("#bigImage").cropper({
		      				responsive : false,
		      				data : {x: 300, y:400, width:400, height:400, rotate:0},
		      				modal : false,
		      				guides : false,
		      				center : false,
		      				highlight : false,
		      				background : false,
		      				autoCrop : false,
		      				autoCropArea : 0.3,
		      				movable : false,
		      				scalable :true,
		      				zoomable :true,
		      				zoomOnWheel :false,
		      				disabled :true,
		      				minContainerWidth : 400,
		      				minContainerHeight : 400,
		      				ready: function () {
		      					var initData = {"x":0,"y":0,"width":0,"height":0,"rotate":0,"scaleX":1,"scaleY":1,"label":"u1", "name" : "21"};
		      					var allData = [];
		      					var resultData = {"x":parseInt(newKeypoint[0]),"y":parseInt(newKeypoint[1]),"width":parseInt(newKeypoint[2]),"height":parseInt(newKeypoint[3]),"rotate":0,"scaleX":1,"scaleY":1,"label":"u1", "name" : "21"};
		      					var newData = $.extend({},initData,resultData);
		      					allData.push(newData);
		      					$(this).cropper('setAllData', allData);
		      					$(this).cropper('disable');
		      				}
		      			});
					}
				}
        	},
        	error: function(data) {
        		noty({text: '查找底库人员失败', layout: 'topCenter', type: 'error', timeout: 2000});
        	}
		});
	};
	return {
		_init:init
	}		
		
})()