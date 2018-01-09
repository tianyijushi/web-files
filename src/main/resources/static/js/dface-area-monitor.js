var d_url=tunicorn.contextPath;
var areaMonitor=areaMonitor || {};
areaMonitor=(function(){
	var PAGE_SIZE = 40;
	function initPagination(currentPage, totalCount) {
		var options = {
			alignment: 'center',
	        currentPage: currentPage,
	        totalPages: Math.ceil(totalCount / PAGE_SIZE),
	        numberOfPages: 20,
	        onPageClicked: function (event, originalEvent, type, page) {
	        	doCaptureSearch(page);
	        }
		};
		
		$('#table_paginator').bootstrapPaginator(options);
		$("#table_paginator").show();
	}
	
	function doCaptureSearch(pageNum) {
		var sourceId = $("#sourceId").val();
		if(!sourceId) {
			noty({text: '请选择有效的视频源', layout: 'topCenter', type: 'error', timeout: 2000});
			return;
		}
		var data = {'perPage':PAGE_SIZE, 'sourceId':sourceId, 'captureStartTime': $('#fromDate').val(), 'captureEndTime': $('#toDate').val()};
					
		if(pageNum) {
			data.pageNum = pageNum - 1;
		}
		$.ajax({
			type: 'post',
			url: d_url + '/monitor/searchCapture',
			data: JSON.stringify(data),
			contentType: 'application/json',
			success: function(resp) {
				if(!resp.success) {
					noty({text: resp.errorMessage, layout: 'topCenter', type: 'error', timeout: 2000});
					return;
				}
				var captures = resp.data.captures;
				if(captures.length ==0){
					if(!$(".noCaptureMsg")){
						$('#table-show').html('<p class="noCaptureMsg" style="text-align: center;">当前没有任何抓拍信息，请稍后再进行查询！</p>');
					}else{
						$(".noCaptureMsg").remove();
						$('#table-show').html('<p class="noCaptureMsg" style="text-align: center;">当前没有任何抓拍信息，请稍后再进行查询！</p>');
					}
					$("#table_paginator").hide();
					return;
				}
				var html = '<tr class=" tableShow  cl showMoreCapture">'+
							'<td style="vertical-align: middle;">';
				$.each(captures, function(index, item) {
					if(index%10==0){
						html += '</td></tr><tr><td>';
					}
					html += '<div class="fetchpic_1">'+
								'<img class="tablePic showCreatePersonModal" beard="' + item.beard + '" hat="' + item.hat + '" glasses="' + item.glasses + '" age="' + item.age + '" sex="' + item.sex + '" realorigin="' + item.realOriginFilePath + '" src="' + item.realFilePath + '">'+
									'<div class="timeStyle">'+
									  '<div class="timeWord">时间</div><span class="timeago" title="' + item.captureTimeStr + '"></span></div>'+
							'</div>';
				});
				html += '</td></tr>';
				$('#table-show').html(html);
				$(".timeago").timeago();
				$(".showCreatePersonModal").click(function(){
					var realFilePath = $(this).attr("src");
					var realOriginFilePath = $(this).attr("realorigin");
					var beard = $(this).attr("beard");
					var hat = $(this).attr("hat");
					var glasses = $(this).attr("glasses");
					var age = $(this).attr("age");
					var sex = $(this).attr("sex");
					showCreatePersonModal(realFilePath, realOriginFilePath, beard, hat, glasses, age, sex);
				});
				var totalCount = resp.data.totalCount;
				if(totalCount == 0){
					$("#table-show").hide();
					$("#table_paginator").hide();
				}else{
					$(".noCaptureMsg").hide();
					$("#table-show").show();
					initPagination(pageNum || 1, totalCount);
				}
			},
			error: function() {
				hideMask();
				noty({text: '获取抓拍信息失败', layout: 'topCenter', type: 'error', timeout: 2000});
			}
		});
	};
	function init(isClusterMode, currentPage, totalCount){
		$(".timeago").timeago();
		$("#searchButo").click(function(){
			doCaptureSearch(1);
		})
		
		$("#areaMonitorUp").click(function(){
			$("#picUpload").click();
		});
		
		$("#save").click(function(){
			createFace();
		});
		
		if(totalCount != "0"){
			initPagination(currentPage, totalCount);
		}
		$(".showCreatePersonModal").click(function(){
			var realFilePath = $(this).attr("src");
			var realOriginFilePath = $(this).attr("realorigin");
			var beard = $(this).attr("beard");
			var hat = $(this).attr("hat");
			var glasses = $(this).attr("glasses");
			var age = $(this).attr("age");
			var sex = $(this).attr("sex");
			showCreatePersonModal(realFilePath, realOriginFilePath, beard, hat, glasses, age, sex);
		});
		
		$("#createPerson").on("hidden.bs.modal", function() {
			$("#name_create").val("");
			$('#modal-group-select').val("");
			$("#sex_create").val("male");
			$("#criminal_create").val(1);
			$("#id_create").val("");
			$("#idcard_create").val("");
			$("#comment_create").val("");
	        $("#errorMsg").text("");
	        $('#modal-group-select').val("");
	        //$('#modal-group-select').selectpicker('deselectAll');
	    });
	  /*  $('#modal-group-select').selectpicker({
		    width: '100%'
		 });*/
	};
	function createFace(){
		var name = $("#name_create").val();
		var groups = $('#modal-group-select').val();
		var sex = $("#sex_create").val();
		var criminal = $("#criminal_create").val();
		var id = $("#id_create").val();
		var idCard = $("#idcard_create").val();
		var comment = $("#comment_create").val();
		var captureImage = $("#captureImage").attr("src");
		if (name == "") {
			$('#errorMsg').text("请输入人员名称");
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
		var formData = new FormData();
		formData.append("name", name);
		formData.append("sex", sex);
		formData.append("groupIds", groups);
		formData.append("criminalRecord", criminal);
		formData.append("idType", id);
		formData.append("idCard", idCard);
		formData.append("comment", comment);
		formData.append("captureImage", captureImage);
    	$.ajax({
			 type: 'POST',
			 url: d_url + '/group/user/create',
			 contentType : false,
			 data: formData,
			 processData: false,
			 success: function(data) {
			 	if (data.success) {
			 		$('#createPerson').modal('hide');
			 		setUpIndex();
			 		noty({text: "创建人员成功!", layout: "topCenter", type: "success", timeout: 2000});
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
    function setUpIndex() {
    	var sid = $('#modal-group-select').val();
    	$.ajax({
			type: 'POST',
			url: d_url + '/group/' + sid + '/index',
			contentType: 'application/x-www-form-urlencoded',
			data: {'groupId': sid},
			dataType: 'json', 
			success: function(data) {
				if (data.success) {
					//$this.prop('disabled', true);
					//noty({text: '正在入库，这需要几分钟', layout: 'topCenter', type: 'warning', timeout: 2000});
					return;
				} else {
					//noty({text: data.errorMessage, layout: 'topCenter', type: 'warning', timeout: 2000});
					return;
				}
        	},
        	error: function(data) {
        		noty({text: '入库失败', layout: 'topCenter', type: 'error', timeout: 2000});
        	}
		});
    };
	
	//日期加减法  date参数为计算开始的日期，days为需要加的天数   
	//格式:addDate('2017-1-11',20) 
	function addDate(date, days){
	    var d=new Date(date.replace(new RegExp(/-/g), '/')); 
	    d.setDate(d.getDate() + days); 
	    var m = d.getMonth() + 1; 
	    var month = '';
	    if(m < 10){
	    	month = '0' + m;
	    }else{
	    	month = m;
	    }
	    var day = d.getDate();
	    var newDay = '';
	    if(day < 10){
	    	newDay = '0' + day;
	    }else{
	    	newDay = day;
	    }
	    return d.getFullYear() + '-' + month + '-' + newDay; 
	}
	var getCurrentDate = function(){
		var date = new Date();
		return date.format('yyyy-MM-dd');
		//return date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
	}
	var getCurrentTime = function(){
		var date = new Date();
		return date.format('hh:mm:ss');
		//return date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
	}
	var getCurrentDateTime = function(){
		//return getCurrentDate() + ' ' + getCurrentTime();
		var date = new Date();
		return date.format('yyyy-MM-dd hh:mm:ss');
	}
	
	function showCreatePersonModal(realFilePath, realOriginFilePath, beard, hat, glasses, age, sex){
		var canCreateFaceBySingle = $("#canCreateFaceBySingle").val();
		if(canCreateFaceBySingle == 'true'){
			$("#myModalLabel").html("抓拍图片");
			
			$("#originFileDiv").show();
			$("#add-person").hide();
			
			if(realOriginFilePath){
				$("#captureOriginImage").attr("src", realOriginFilePath);
			}else{
				$("#captureOriginImage").attr("src", realFilePath);
			}
			$("#captureImage").attr("src", realFilePath);
			if(sex && sex == 'female'){
				$("#sexSpan").html("女");
			}
			if(beard && beard == '1'){
				$("#beardSpan").html("有胡子");
			}
			if(hat && hat == '1'){
				$("#hatSpan").html("有帽子");
			}
			if(glasses && glasses == '1'){
				$("#glassesSpan").html("穿戴");
			}
			if(age && age != "null"){
				$("#ageSpan").html(age);
			}
			$('#createPerson').modal('show');
		}
		$("#savePersonBtn").click(function(){
			$("#myModalLabel").html("新建人员");
			$("#originFileDiv").hide();
			$("#add-person").show();
		});
		//event.stopPropagation();
	};
	
	return {
		_init:init
	}
})()