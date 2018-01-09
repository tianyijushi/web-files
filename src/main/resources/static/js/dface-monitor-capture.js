var d_url=tunicorn.contextPath;
var monitorCapture=monitorCapture || {};
monitorCapture = (function(){
	var canCreateFaceBySingle = $("#canCreateFaceBySingle").val();
	var canViewFaceGroupSearchPage = $("#canViewFaceGroupSearchPage").val();
	var capture_item_template = '';
	 capture_item_template += '<tr class="captureTable">' +
		         					'<td onclick="monitorCapture.showLargeImageModal(\'{{captureImg}}\', \'{{captureOriginImg}}\')"><img style="width: 70px;height: 70px" src="{{captureImg}}" alt=""></td>' +
		         					'<td><p style="width:250px; white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="{{sourceLocation}}">{{sourceLocation}}</p></td>' +
		         					'<td><p style="width:250px; white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="{{sourceName}}">{{sourceName}}</p></td>' +
		         					'<td>{{alerted}}</td>' +
		         					'<td>{{captureTime}}</td>';
	if(canCreateFaceBySingle == 'true' || canViewFaceGroupSearchPage == 'true'){
		capture_item_template += '<td style="width:5%;">';
		if(canViewFaceGroupSearchPage == 'true'){
			capture_item_template += '<span title="进行图像检索" style="cursor:pointer" class="glyphicon glyphicon-search" onclick="monitorCapture.gotoSearchGroup(\'{{captureImg}}\')"></span>';
		}
		if(canCreateFaceBySingle == 'true'){
			capture_item_template += '<button title="新增人员" realfilepath="{{captureImg}}" style="margin-left:20px;" type="button" class="btn btn-success glyphicon glyphicon-plus showCreatePersonModal"></button>';
		}
		capture_item_template += '</td>'
	}
	capture_item_template += '</tr>';
	
	_.templateSettings = {
		interpolate: /\{\{(.+?)\}\}/g,
		evaluate: /\{\%(.+?)\%\}/g
	};
	
	var flag = false;
	var cameraNameLocationMapping = {};
	var captureItemTemplate = _.template(capture_item_template);
	function init(totalCount){
		$('#modal-source-select').selectpicker({
			width :'90%'
		});
		$('#search-btn').click(function(evt) {
			doCaptureSearch(1);
		});
		$(".showCreatePersonModal").click(function(){
			var realFilePath = $(this).attr("realfilepath");
			showCreatePersonModal(realFilePath);
		});
		$("#save").click(function(){
			createFace();
		});
		initDate();
		if(totalCount != "0"){
			initPagination(1, totalCount || 1);
		}
	};
	function initDate() {
		$('.datetimepicker').remove();	
		var current = moment();
		$("#toDate").val(current.format('YYYY-MM-DD HH:mm:ss'));
	    $("#fromDate").val(current.subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss'));

		//时间段显示
		$('.form_datetime1').datetimepicker({
		    language: 'zh-CN',
		    autoclose:true ,
		    endDate : new Date()
		}).on('changeDate',function(e){
		    var d =  e.date;
		    var d1 = e.date > moment($("#toDate").val())?true:false;
		    //$('.form_datetime2').datetimepicker('setStartDate',d);
		    var end = d.setDate(d.getDate() + 7);
		    if(end < moment($("#toDate").val()) || d1){
	        	var end1 = new Date();
	        	if(end > end1){
	        		$("#toDate").val(moment(end1).format('YYYY-MM-DD HH:mm:ss'));
	        		//$('.form_datetime2').datetimepicker('setEndDate',end1);
	        	}else{
	        		var newdata=moment(d);
	        		$("#toDate").val(newdata.format('YYYY-MM-DD HH:mm:ss'));
	        		//$('.form_datetime2').datetimepicker('setEndDate',d);
	        	} 
		    }
		    //$('.form_datetime1').datetimepicker('setEndDate', $("#toDate").val());
		});
		$('.form_datetime2').datetimepicker({
		    language: 'zh-CN',
		    autoclose:true, //选择日期后自动关闭
		   // startDate:$("#fromDate").val(),
		    endDate : new Date()
		}).on('changeDate',function(e){
		    var d=e.date;  
		    //$('.form_datetime1').datetimepicker('setEndDate', d);
		    //$('.form_datetime2').datetimepicker('setStartDate', $("#fromDate").val());
		    var d1 = e.date < moment($("#fromDate").val())?true:false;
		    var end = d.setDate(d.getDate()-7);
		    if(end > moment($("#fromDate").val()) || d1){
			    var newdata=moment(d);
	    		$("#fromDate").val(newdata.format('YYYY-MM-DD HH:mm:ss'));
		    }
		});
		
	};
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
	function showMask(){
		 var top = ($(window).height() - $(".loading_1").height())/2;   
	     var left = ($("#content").offsetWidth - $(".loading_1").width())/2;   
	     var scrollTop = $(document).scrollTop();   
	     var scrollLeft = $(document).scrollLeft();   
		  $(".loading").css({"top":top + scrollTop,"left":left + scrollLeft,"display":"block"});
		  $(".mask").height(document.body.scrollHeight);
		  $(".mask").width(document.body.offsetlWidth);
		  $(".mask").fadeTo(200, 0.2);
	  
	};
	function hideMask(){
		$(".loading").css("display","none");
	    $(".mask").fadeOut(200);
	   
	};
	function doPaginationClicked(pageNum) {
		doCaptureSearch(pageNum);
	}
	
	function doCaptureSearch(pageNum) {
		var sourceIds = $("#modal-source-select").val();
		/*if(!sourceId) {
			noty({text: '请选择有效的视频源', layout: 'topCenter', type: 'error', timeout: 2000});
			return;
		}*/
		var data = {'sourceIds':sourceIds, 'captureStartTime': $('#fromDate').val(), 'captureEndTime': $('#toDate').val()};
					
		if(pageNum) {
			data.pageNum = pageNum - 1;
		}
		showMask();
		$.ajax({
			type: 'post',
			url: d_url + '/monitor/searchCapture',
			data: JSON.stringify(data),
			contentType: 'application/json',
			success: function(resp) {
				hideMask();
				if(!resp.success) {
					noty({text: resp.errorMessage, layout: 'topCenter', type: 'error', timeout: 2000});
					//alert('获取抓拍信息异常');
					return;
				}
				var captures = resp.data.captures;
				$('#capture-table').find('tr.captureTable:not(".tableHeader")').remove();
				
				$.each(captures, function(index, item) {
					$('#capture-table').find('tbody').append(captureItemTemplate({'captureImg': item.realFilePath, 'captureOriginImg':item.realOriginFilePath,
															'sourceLocation': item.source.location || '-', 'sourceName': item.source.name,
															'captureTime': item.captureTimeStr, 'alerted': item.alertedStr, 'captureId':item.id}));
				});
				$(".showCreatePersonModal").click(function(){
					var realFilePath = $(this).attr("realfilepath");
					showCreatePersonModal(realFilePath);
				});
				var totalCount = resp.data.totalCount;
				if(totalCount == 0){
					$("#capture-table").hide();
					$("#table_paginator").hide();
				}else{
					$("#capture-table").show();
					initPagination(pageNum || 1, totalCount);
				}
			},
			error: function() {
				hideMask();
				noty({text: '获取抓拍信息失败', layout: 'topCenter', type: 'error', timeout: 2000});
				//alert('获取抓拍信息失败');
			}
		});
	};
	function showCreatePersonModal(realFilePath){
		$("#captureImage").attr("src", realFilePath);
		$('#createPerson').modal('show');
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
					$this.prop('disabled', true);
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
	function gotoSearchGroup(searchPic){
		dface.ajax({
			type: 'get',
			url: d_url + '/search/group',
			data:{
				searchPic:searchPic
			},
			success: function(resp) {
				var $monitorMenu = $('ul.sidebar-menu li.treeview:eq(0)');
				$monitorMenu.removeClass("active");
				$monitorMenu.find("ul").hide();
				
				var $searchMenu = $('ul.sidebar-menu li.treeview:eq(3)');
				$searchMenu.addClass("active");
				
			    var $parentMenu = $('ul.sidebar-menu li.treeview:eq(3) ul.treeview-menu');
			    $parentMenu.show();
				$parentMenu.find('li a').css('color', '#8AA4AF');
				$parentMenu.find('li:eq(1) a').css('color', '#fff');
			
				$("#content").empty().html(resp);
			},
			error: function() {
				noty({text: '获取图像检索页面失败', layout: 'topCenter', type: 'error', timeout: 2000});
				//alert('获取图像检索页面失败');
			}
		});
	};
	function showLargeImageModal(captureFilePath, captureOriginFilePath){
		if(captureOriginFilePath){
			$("#bigImage").attr("src", captureOriginFilePath);	
		}else{
			$("#bigImage").attr("src", captureFilePath);
		}
		$('#bigImageModal').modal('show');
	};
	return {
		_init:init,
		gotoSearchGroup:gotoSearchGroup,
		showLargeImageModal:showLargeImageModal
	}
})()