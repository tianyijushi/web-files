var d_url=tunicorn.contextPath;
var areaAlert=areaAlert || {};
areaAlert=(function(){
	var PAGE_FACE_SIZE = 5;
	var PAGE_TIME_SIZE = 10;
	var TOP_COUNT = 5;
	var top_alert_template = '<div class="fetchpic">'+
								'<img class="tablePic" src="{{captureImg}}" title="{{captureTime}}" />' +
								'<div class="timeStyle">' +
									'<div class="timeWord">{{score}}</div><span class="timeago" title="{{captureTime}}"></span>' +
								'</div>' +
							'</div>';
	var alert_item_template = '';
	alert_item_template += '<tr class="captureTable">' +
	                        	'<td onclick="areaAlert.showLargeAlertImageModal(\'{{captureImg}}\', \'{{faceImg}}\')"><img style="width: 70px;height: 70px" src="{{captureImg}}" alt=""></td>' +
	                        	'<td onclick="areaAlert.showLargeAlertImageModal(\'{{captureImg}}\', \'{{faceImg}}\')"><img style="width: 70px;height: 70px" src="{{faceImg}}" alt=""></td>' +
	                        	'<td><p class="newline" title="{{faceName}}/{{idCard}}">{{faceName}}/{{idCard}}</p></td>' +
	                        	'<td><p class="newline" title="{{groupName}}">{{groupName}}</p></td>' +
	                        	'<td>{{score}}</td>' +
	                        	'<td id="captureTime_{{alertId}}">{{captureTime}}</td>';
	                        	alert_item_template += '</tr>';
	_.templateSettings = {
			interpolate: /\{\{(.+?)\}\}/g,
			evaluate: /\{\%(.+?)\%\}/g
			};
	
	var topAlertTemplate = _.template(top_alert_template);
	var alertItemTemplate = _.template(alert_item_template);
	
	function initFacePagination(currentPage, totalCount) {
		var options = {
			alignment: 'center',
	        currentPage: currentPage,
	        totalPages: Math.ceil(totalCount / PAGE_FACE_SIZE),
	        numberOfPages: 20,
	        onPageClicked: function (event, originalEvent, type, page) {
	        	doSearch(page);
	        }
		};
		
		$('#table_paginator').bootstrapPaginator(options);
		$("#table_paginator").show();
	}
	
	function initTimePagination(currentPage, totalCount) {
		var options = {
			alignment: 'center',
	        currentPage: currentPage,
	        totalPages: Math.ceil(totalCount / PAGE_TIME_SIZE),
	        numberOfPages: 20,
	        onPageClicked: function (event, originalEvent, type, page) {
	        	doAlertSearch(page, 'timeView');
	        }
		};
		
		$('#table_paginator').bootstrapPaginator(options);
		$("#table_paginator").show();
	}
	function doSearch(pageNum){
		 var faceName = $.trim($('#faceName').val());
		 var sourceId = $("#sourceId").val();
		 var data = {'sourceId':sourceId, 'faceName': faceName, "perPage": PAGE_FACE_SIZE,'captureStartTime': $('#fromDate').val(), 'captureEndTime': $('#toDate').val()};
		 if(pageNum) {
			data.pageNum = pageNum - 1;
		 }
		dface.ajax({
			type: 'POST',
			url: d_url + '/monitor/searchAlertWithFace',
			data: JSON.stringify(data),
			contentType: 'application/json',
			success: function(resp) {
				if(!resp.success) {
					noty({text: resp.errorMessage, layout: 'topCenter', type: 'error', timeout: 2000});
					return;
				}
				var alerts = resp.data.alerts;
				if(alerts.length ==0){
					if(!$(".noContentFace")){
						$('#face-table-show').html('<p class="noContentFace" style="text-align: center;margin-top: 50px;">当前没有任何告警信息，请稍后再进行查询！</p>');
					}else{
						$(".noContentFace").remove();
						$('#face-table-show').html('<p class="noContentFace" style="text-align: center;margin-top: 50px;">当前没有任何告警信息，请稍后再进行查询！</p>');
					}
					$("#table_paginator").hide();
					return;
				}
				var html ='';
				$.each(alerts, function(index, item) {
					
					html += '<tr class="pic-center tableShow" face_name="'+item.faceName+'" camera_id="'+item.videoSource.id+'">'+
					'<td style="vertical-align: middle;">'+
						'<img class="tablePic" src="'+item.realAssetPath+'" />'+
					'</td>'+
					'<td style="vertical-align: middle;">'+
						'<strong>'+item.faceName+'</strong>'+
						'<p style="margin-top: 16px;">'+item.group.name+
							'<br>'+item.videoSource.name+
						'</p>'+
					'</td>'+
					'<td class="fetchpics ">'+
						'<div class="fetchpic">'+
							'<img class="tablePic" src="'+d_url+'/image/default_face.png" />'+
							'<div class="timeStyle">'+
								'<div class="timeWord">0%</div>0分钟前'+
							'</div>'+
						'</div>'+
						'<div class="fetchpic">'+
							'<img class="tablePic" src="'+d_url+'/image/default_face.png" />'+
							'<div class="timeStyle">'+
								'<div class="timeWord">0%</div>0分钟前'+
							'</div>'+
						'</div>'+
						'<div class="fetchpic">'+
							'<img class="tablePic" src="'+d_url+'/image/default_face.png" />'+
							'<div class="timeStyle">'+
								'<div class="timeWord">0%</div>0分钟前'+
							'</div>'+
						'</div>'+
						'<div class="fetchpic">'+
							'<img class="tablePic" src="'+d_url+'/image/default_face.png" />'+
							'<div class="timeStyle">'+
								'<div class="timeWord">0%</div>0分钟前'+
							'</div>'+
						'</div>'+
						'<div class="fetchpic">'+
							'<img class="tablePic" src="'+d_url+'/image/default_face.png" />'+
							'<div class="timeStyle">'+
								'<div class="timeWord">0%</div>0分钟前'+
							'</div>'+
						'</div>'+
					'</td> '+
					'<td style="vertical-align: middle;">'+
						'<a href="javascript:void(0);" class="glyphicon glyphicon-search" style="display:none;"></a>'+
					'</td>'+
				'</tr>';
					var score = Math.round(item.score*10000)/100;
					
					});
				$('#face-table-show').html(html);
				$(".timeago").timeago();
				var totalCount = resp.data.totalCount;
				if(totalCount == 0){
					$("#face-table-show").hide();
					$("#table_paginator").hide();
				}else{
					$(".noContentFace").hide();
					$("#face-table-show").show();
					initFacePagination(pageNum || 1, totalCount);
				}
				var alertInfoList = getAlertInfoList();
				if(alertInfoList && alertInfoList.length > 0) {
					fetchTopAlerts(alertInfoList);
				}
			},
			error: function() {
				noty({text: '获取告警信息失败', layout: 'topCenter', type: 'error', timeout: 2000});
			}
		});
	};
	
	function fetchTopAlerts(alertInfoList) {
		$.ajax({
			type: 'post',
			url: d_url + '/monitor/fetchTopAlerts',
			data: JSON.stringify({'alertInfoList': alertInfoList}),
			contentType: 'application/json',
			success: function(resp) {
				if(!resp.success) {
					noty({text: resp.errorMessage, layout: 'topCenter', type: 'warning', timeout: 2000});
					return;
				}
				var alerts = resp.data;
				if(alerts && alerts.length > 0) {
					$.each(alerts, function(i, alert){
						var html = '';
						$.each(alert.alertVOs, function(index, item){
							var score = Math.round(item.score*10000)/100;
							var d = {
									'captureTime' : item.captureTimeStr, 
									'captureImg' : item.realCapturePath, 
									'score' : score+'%'
							}
							html += topAlertTemplate(d);
						});
						var selector = '#face-table-show tr[face_name="'+alert.faceName+'"] td.fetchpics';
						if(html.trim()!=''){
							$(selector).html(html);
							$(".timeago").timeago();
						}
					});
				}
			},
			error: function() {
				noty({text: '获取告警信息失败', layout: 'topCenter', type: 'warning', timeout: 2000});
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
	    	month = '0'+ m;
	    }else{
	    	month = m;
	    }
	    var day = d.getDate();
	    var newDay = '';
	    if(day < 10){
	    	newDay = '0'+ day;
	    }else{
	    	newDay = day;
	    }
	    return d.getFullYear() + '-' + month + '-' + newDay; 
	}
	var getCurrentDate = function(){
		var date = new Date();
		return date.format('yyyy-MM-dd');
	}
	var getCurrentTime = function(){
		var date = new Date();
		return date.format('hh:mm:ss');
	}
	var getCurrentDateTime = function(){
		var date = new Date();
		return date.format('yyyy-MM-dd hh:mm:ss');
	}
	
	var getAlertInfoList = function(){
		var alertInfoList = [];
		var dateStr = getCurrentDate();
		var startDate = addDate(dateStr, -7);
		//var startTime = startDate + ' ' + getCurrentTime();
		//var endTime = getCurrentDateTime();
		var startTime = $("#fromDate").val();
		var endTime = $("#toDate").val();
		var faceGroupId = $("#faceGroupId").val();
		var sourceId = $("#sourceId").val();
		$('#face-table-show tr').each(function(index, item){
			var d = {
				'faceName' : $(item).attr('face_name'),
				'top' : TOP_COUNT,
				'captureStartTime' : startTime,
				'captureEndTime' : endTime,
				'sourceId':sourceId
			}
			alertInfoList.push(d);
		});
		return alertInfoList;
	}
	
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
	
	function doAlertSearch(pageNum, type) {
		var sourceId = $("#sourceId").val();
		if(!sourceId) {
			noty({text: '请选择有效的视频源', layout: 'topCenter', type: 'error', timeout: 2000});
			return;
		}
		var data = {'perPage':PAGE_TIME_SIZE, 'sourceId':sourceId, 'captureStartTime': $('#fromDate').val(), 'captureEndTime': $('#toDate').val()};
					
		if(pageNum) {
			data.pageNum = pageNum - 1;
		}
		$.ajax({
			type: 'post',
			url: d_url + '/monitor/searchAlert',
			data: JSON.stringify(data),
			contentType: 'application/json',
			success: function(resp) {
				if(!resp.success) {
					noty({text: resp.errorMessage, layout: 'topCenter', type: 'error', timeout: 2000});
					return;
				}
				var alerts = resp.data.alerts;
				/*if(alerts.length ==0){
					if(!$(".noContent")){
						$('#time-table-show').html('<p class="noContent" style="text-align: center;margin-top: 50px;">当前没有任何告警信息，请稍后再进行查询！</p>');
					}else{
						$(".noContent").remove();
						$('#time-table-show').html('<p class="noContent" style="text-align: center;margin-top: 50px;">当前没有任何告警信息，请稍后再进行查询！</p>');
					}
					$("#table_paginator").hide();
					return;
				}*/
				if(type == 'timeView'){
					$('#time-table-show').find('tr.captureTable:not(".tableHeader")').remove();

					if(alerts.length == 0){
						if(!$(".noContent")){
							$('#time-table-show').find('tbody').append('<tr class="noContent" style="text-align: center;margin-top: 50px;"><td colspan="6">当前没有任何告警信息，请稍后再进行查询！</td></tr>');
						}else{
							$(".noContent").remove();
							$('#time-table-show').find('tbody').append('<tr class="noContent" style="text-align: center;margin-top: 50px;"><td colspan="6">当前没有任何告警信息，请稍后再进行查询！</td></tr>');
						}
						$("#table_paginator").hide();
						return;
					}
					$.each(alerts, function(index, item) {
						var groupName = '未知';
						if(!!item.group){
							groupName = item.group.name;
						}
						$('#time-table-show').find('tbody').append(alertItemTemplate({'captureImg': item.realCapturePath, 
							'faceImg': item.realAssetPath, 'faceName': item.faceName, 'groupName': groupName,
							'score': item.score.toFixed(2),
							'sourceLocation': item.videoSource.location||'-', 'sourceName': item.videoSource.name,
							'captureTime': item.captureTimeStr, 'idCard': item.faceIDCard, 'alertId':item.id}));
					});
				}
				$(".timeago").timeago();
				var totalCount = resp.data.totalCount;
				if(totalCount == 0){
					$("#time-table-show").hide();
					$("#table_paginator").hide();
				}else{
					$(".noContent").hide();
					$("#time-table-show").show();
					initTimePagination(pageNum || 1, totalCount);
				}
			},
			error: function() {
				hideMask();
				noty({text: '获取抓拍信息失败', layout: 'topCenter', type: 'error', timeout: 2000});
			}
		});
	};
	
	function init(currentPage, totalCount, isClusterMode, faceTotalCount){
		initDate();
		$(".timeago").timeago();
		
		if(totalCount != "0"){ 
			initTimePagination(currentPage, totalCount);
		}
		$('#queryView').on('change',function(){
			var selectText = $(this).find('option:selected').val();
			if(selectText == 'timeOption'){
				$("#faceViewContent").hide();
				$("#timeViewContent").show();
				$("#faceNameDiv").hide();
				doAlertSearch(1, 'timeView');
				if(totalCount != "0"){
					initTimePagination(1, totalCount);
				}
			}else if(selectText == 'faceNameOption'){
				$("#timeViewContent").hide();
				$("#faceViewContent").show();
				$("#faceNameDiv").show();
				doSearch(1);
				if(faceTotalCount != "0"){
					initFacePagination(1, faceTotalCount);
				}
				var alertInfoList = getAlertInfoList();
				if(alertInfoList && alertInfoList.length > 0) {
					fetchTopAlerts(alertInfoList);
				}
			}
		});
		$("#searchButo").click(function(){
			var selectView = $("#queryView").val();
			if(selectView == 'timeOption'){
				doAlertSearch(1, 'timeView');
			}else{
				doSearch(1);
			}
		})

		$('#table-show tr').on('click', function(e){
			var $tr = $(this);
			//var face_group_id = $tr.attr('fg_id');
			var face_group_id = $('#faceGroupId').val();
			var face_name = $tr.attr('face_name');
			var camera_id = $tr.attr('camera_id');
			$('#alertHistory').empty();
			get_alert_history(face_group_id, face_name, getCurrentDateTime(), isClusterMode, true);
			$('#alertHistory').attr('fg_id', face_group_id);
			$('#alertHistory').attr('face_name', face_name);
			$tr.parent().find('tr').css('background-color', '#fff');
			$tr.css('background-color', '#d2e9ff');

			$("#big").click();
			$("#alertHistory").data('currentSourceId', camera_id);
		});
	};
	
	function showLargeAlertImageModal(realCapturePath, realAssetPath){
		$("#realCapturePath").attr("src", realCapturePath);
		$("#realAssetPath").attr("src", realAssetPath);
		$('#bigAlertImageModal').modal('show');
	}
	return {
		_init:init,
		doSearch:doSearch,
		showLargeAlertImageModal:showLargeAlertImageModal
	}
})();
