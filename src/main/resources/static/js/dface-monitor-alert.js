var d_url=tunicorn.contextPath;
var monitorAlert=monitorAlert || {};
monitorAlert=(function(){	
	var canHandleAlert = $("#canHandleAlert").val();
	var alert_item_template = '';
	alert_item_template += '<tr class="captureTable">' +
	                        	'<td onclick="monitorAlert.showLargeAlertImageModal(\'{{captureImg}}\', \'{{faceImg}}\')"><img style="width: 70px;height: 70px" src="{{captureImg}}" alt=""></td>' +
	                        	'<td onclick="monitorAlert.showLargeAlertImageModal(\'{{captureImg}}\', \'{{faceImg}}\')"><img style="width: 70px;height: 70px" src="{{faceImg}}" alt=""></td>' +
	                        	'<td><p class="newline" title="{{faceName}}/{{idCard}}">{{faceName}}/{{idCard}}</p></td>' +
	                        	'<td><p class="newline" title="{{groupName}}">{{groupName}}</p></td>' +
	                        	'<td>{{score}}</td>' +
	                        	'<td class="newline" title="{{sourceLocation}}">{{sourceLocation}}</td>' +
	                        	'<td class="newline" title="{{sourceName}}">{{sourceName}}</td>' +
	                        	'<td id="captureTime_{{alertId}}">{{captureTime}}</td>';
	                        	alert_item_template += '</tr>';
	
	_.templateSettings = {
		interpolate: /\{\{(.+?)\}\}/g,
		evaluate: /\{\%(.+?)\%\}/g
	};
	var alertItemTemplate = _.template(alert_item_template);
	var flag = false;
	var sourceNameLocationMapping = {};	
	function init(totalCount){
		if(totalCount != "0"){
			initPagination(1, totalCount || 1);
		}
		ellipsis();
		initDate();
		$('#modal-source-select').selectpicker({
			width :'90%'
		});
		$('#search-btn').click(function() {
			doAlertSearch(1);
		});
	};
	function ellipsis(){
		var items=$('.ellipsis');
		var arr=[];
		for(var j=0;j<items.length;j++){
			arr[j]=items[j];
		}
		if(arr.length>0){
		  for(var i=0;i<arr.length;i++){
			  if($(arr[i]).html()!=null && $(arr[i]).html().length>16){
				  $(arr[i]).html($(arr[i]).html().substr(0,16)+'...')
			  }
		   }
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
		ellipsis();
	}
	
	function doPaginationClicked(pageNum) {
		doAlertSearch(pageNum);
	}
	
	function doAlertSearch(pageNum) {
		var sourceIds = $("#modal-source-select").val();
		/*if(!sourceId) {
			noty({text: '请选择有效的视频源', layout: 'topCenter', type: 'error', timeout: 2000});
			return;
		}*/
		var data = {'faceName': $.trim($('#face-name').val()), 'idCard': $.trim($('#id-card').val()), 
					'sourceName': $.trim($('#source-select-new').val()),
					'processStatus': $('#pstatus-select').val(), 'groupId': parseInt($('#group-select').val()),
					'captureStartTime': $('#fromDate').val(), 'captureEndTime': $('#toDate').val(),
					'sourceIds': sourceIds};
		
		if(pageNum) {
			data.pageNum = pageNum - 1;
		}
		showMask();
		$.ajax({
			type: 'post',
			url: d_url + '/monitor/searchAlert',
			data: JSON.stringify(data),
			contentType: 'application/json',
			success: function(resp) {
			    hideMask();
				if(!resp.success) {
					noty({text: resp.errorMessage, layout: 'topCenter', type: 'error', timeout: 2000});
					//alert('获取告警信息异常');
					return;
				}
				
				var alerts = resp.data.alerts;
				$('#alert-table').find('tr.captureTable:not(".tableHeader")').remove();
				
				$.each(alerts, function(index, item) {
					
					var groupName = '未知';
					if(!!item.group){
						groupName = item.group.name;
					}
					$('#alert-table').find('tbody').append(alertItemTemplate({'captureImg': item.realCapturePath, 
															'faceImg': item.realAssetPath, 'faceName': item.faceName, 'groupName': groupName,
															'score': item.score.toFixed(2),
															'sourceLocation': item.videoSource.location||'-', 'sourceName': item.videoSource.name,
															'captureTime': item.captureTimeStr, 'idCard': item.faceIDCard, 'alertId':item.id}));
				});
				var totalCount = resp.data.totalCount;
				if(totalCount == 0){
					$("#alert-table").hide();
					$("#table_paginator").hide();
				}else{
					$("#alert-table").show();
					initPagination(pageNum || 1, totalCount);
				}
			},
			error: function() {
				hideMask();
				noty({text: '获取告警信息失败', layout: 'topCenter', type: 'error', timeout: 2000});
				//alert('获取告警信息失败');
			}
		});
	};
	/*function showEdit(alertId,event) {
		var data={"unprocessed":"未处理","solved":"已处理"};
		var currentStatus = $("#status_"+alertId).text();
		var statusNode = $("#status");
		var commentText=$("#comment_"+alertId).text();
		statusNode.empty();
		if (currentStatus == data.unprocessed) {
			statusNode.append('<option value="unprocessed" selected="true">未处理</option><option value="solved">已处理</option>');
		} else if (currentStatus == data.solved) {
			statusNode.append('<option value="unprocessed">未处理</option><option value="solved" selected="true">已处理</option>');
		}
		$("#comment").val(commentText);
		$("#updateBtn").attr("aid", alertId);
		$("#editAlert").modal('show');
	};*/
	/*function updateAlert() {
		var aid = $("#updateBtn").attr("aid");
		var status = $("#status").val();
		var comment = $("#comment").val();
		var captureTime = $("#captureTime_" + aid).text();
		var data = {"processStatus":status,"processComment":comment,"captureTimeStr":captureTime};
		$.ajax({
			 type: 'PUT',
			 url: d_url + '/monitor/alert/' + aid,
			 contentType : 'application/json',
			 data: JSON.stringify(data),
			 dataType: 'json', 
			 success: function(data) {
				if(!data.success) {
						noty({text: data.errorMessage, layout: 'topCenter', type: 'error', timeout: 2000});
						return;
				}
			 	$("#status_"+aid).text($("#status").find("option:selected").text());
			 	$("#comment_"+aid).text(comment);
			 	$("#comment_"+aid).attr('title',comment);
			 	$("#editAlert").modal('hide');
			 	var item=$("#comment_"+aid);
			 	 if(item.html()!=null && item.html().length>16){
			 		item.html(item.html().substr(0,16)+'...');
			 		item.attr('title',comment);
				  }
        	},
			error: function(data) {
        		//返回500错误页面
        		$("html").html(data.responseText);
	        }
		});
	};*/
	function showLargeAlertImageModal(realCapturePath, realAssetPath){
		$("#realCapturePath").attr("src", realCapturePath);
		$("#realAssetPath").attr("src", realAssetPath);
		$('#bigAlertImageModal').modal('show');
	}
	return{
		_init:init,
		//showEdit:showEdit,
		//updateAlert:updateAlert,
		showLargeAlertImageModal:showLargeAlertImageModal
	}
})()