var d_url=tunicorn.contextPath;
var monitorDetail=monitorDetail || {};
monitorDetail=(function(){
	var INTERVAL_TIME = 2;
	var alert_info_template = '<div style="background-color: #d3e9ed;margin-bottom: 7px;" class="alert_item">' +
    '<div style="height: 30px;">' +
		     '<div class="CaptureTime pull-left" style="">{{captureTime}}</div>'+
		     '<div class="sourceLocation pull-right" style="">{{sourceLocation}}</div>'+
	      ' </div>'+
	   	  '<div style="height: 130px;position: relative;">'+
       '<div style="float: left;width: 24%" >'+
             '<img class="capturePic" src="{{captureImg}}" alt="">'+
       '</div>'+
        '<div class="comparePic"><img style="width: 60%;" src="' + d_url + '/image/vs.png" alt=""></div>'+
        '<div class="scoreShow">{{score}}</div>'+
        '<div style="float: left;width: 24%;">'+
            '<img style="width:100%;height: 120px;" src="{{faceImg}}" alt="">'+
            '<img class="compareBorder" src="' + d_url + '/image/{{border}}">'+
        '</div>'+
        '<div class="col-sm-2" style="width: 36%;margin-left: -1.5%;">'+
            '<div style="font-size: 12px;">'+
                
                '<p>姓名：<span>{{name}}</span></p>'+
                '<p>身份证：<span>{{idCard}}</span></p>'+
                '<p>比对库名称：<span>{{groupName}}</span></p>'+
            '</div>'+
        '</div>'+
    '</div>'+
    '<div style="height: 23px;margin-bottom: 10px">'+
        '<div style="float:left;font-size: 12px;margin-left: -52%;">抓拍图</div>'+
        '<div style="float:left;font-size: 12px;margin-left: -17%;">比对图</div>'+
	  '</div>'+ 
	   '</div>';
	var capture_info_template = '<div onclick="monitorDetail.showLargeImageModal(\'{{captureImg}}\', \'{{captureOriginImg}}\', \'{{beard}}\', \'{{hat}}\', \'{{glasses}}\', \'{{age}}\', \'{{sex}}\')" id="{{captureId}}" captureTime="{{captureTime}}" class="capture-item" style="width:70px;height:90px;margin-bottom:10px;margin-right:10px;float:left;">' +
			'<img style="width:70px;height:70px" alt="" src="{{captureImg}}">' +
			'<div style="text-align:center">{{sourceName}}</div>' +
		'</div>';
	
	var init_capture_show_count = 20;
	var open_camera_num = 0;
	
	_.templateSettings = {
						interpolate: /\{\{(.+?)\}\}/g,
						evaluate: /\{\%(.+?)\%\}/g
						};
	
	var alertInfoTemplate = _.template(alert_info_template);
	var captureInfoTemplate = _.template(capture_info_template);
	var intervalId = void(0);

	var _alertRender = function(){
		var alertList = $('#monitor_detail').data('alertList');
		//console.log(alertList);
		if(alertList && alertList.length>0){
			//console.log(alertList.length);
			var alertItem = alertList.shift(); //出队列 
			var alertTempStr = $('#alertTemp').html(); 
			var alertTemp = _.template(alertTempStr);
			var html = alertTemp(alertItem);
			$('#alert-modal .modalBody').html(html);
			$('#alert-modal').modal('show');
		}else{
			$('#alert-modal').modal('hide');
		}
	}
	var __set_alert_interval = function(){
		var intervalId2 = setInterval(function() {
			var openedCameraIds = getOpenedCameraIds();
			if(openedCameraIds.length > 0) {
				_alertRender();
			}
		}, 1500);
		$('body').data('alert_info_interval_id2', intervalId2);
	}
	var _setVideoHigh = function(){
		$('embed').each(function(index, item){
			var width = $(item).width();
			var height=width*9/16;
			$(item).height(height);
		});
		$('.camera-select').change();
	}	
	var __stopVideoMonitor = function(){
		//console.log('stop.....' + new Date())
		var intervalId2 = $('body').data('alert_info_interval_id2');
		//console.log(intervalId2)
		if(intervalId2){
			//console.log('stop pop alert');
			clearInterval(intervalId2);
			$('body').removeData('alert_info_interval_id2');
		}
		
		//stop video which opened
		$('.four-windows').find('embed').each(function(index, vlcDom){
			if(vlcDom.playlist && vlcDom.playlist.isPlaying){
				//console.log('stop video');
				vlcDom.playlist.stop();
			}
		});
	}
		
	var __startVideoMontor = function(){
		//console.log('start.....' + new Date())
		var intervalId2 = $('body').data('alert_info_interval_id2');
		if(!intervalId2){
			//console.log('start pop alert');
			//__set_alert_interval();
		}
		//start video which stoped
		$('.four-windows').find('embed').each(function(index, vlcDom){
			if(vlcDom.playlist && !vlcDom.playlist.isPlaying){
				//console.log('play video')
				vlcDom.playlist.play();
			}
		});
	};	

	function fetchAlerts(openedCameraIds) {
		//console.log($('#monitor_detail').data('last_alert_capture_time'))
		$.ajax({
			type: 'post',
			url: d_url + '/monitor/fetchAlerts',
			data: JSON.stringify({'sourceIdList': openedCameraIds, 'lastTime' : $('#monitor_detail').data('last_alert_capture_time')}),
			contentType: 'application/json',
			success: function(resp) {
				if(!resp.success) {
					noty({text: resp.errorMessage, layout: 'topCenter', type: 'warning', timeout: 2000});
					return;
				}
				var alertList = $('#monitor_detail').data('alertList') || [];
				var alerts = resp.data;
				if(alerts.length > 0) {
					//set last id
					$('#monitor_detail').data('last_alert_capture_time', alerts[0].captureTimeStr);
					for(var index=alerts.length-1; index>=0; index--){
						var item = alerts[index];
						//render new alert item
						var score = Math.round(item.score*10000)/100;
						var groupName = '未知';
						if(!!item.group){
							groupName = item.group.name;
						}
						var border = 'border1.png';
						if(item.group.type=='white'){
							border = 'border2.png';
						}
						var temp = alertInfoTemplate({'captureImg': item.realCapturePath,
							'faceImg': item.realAssetPath, 'score': score+'%', 'name': item.faceName, 'groupName': groupName,
							'sourceLocation': item.videoSource.location || '无', 'idCard': item.faceIDCard || '无', 
							'captureTime': item.captureTimeStr, 'border' : border})
						$(temp).insertAfter('.alert-container .alert-info');
						//push alert message
						var d = {'captureTime' : item.captureTimeStr, 
								'sourceLocation' : item.videoSource.location || '无', 
								'captureImg' : item.realCapturePath, 
								'faceImg' : item.realAssetPath, 
								'faceName' : item.faceName, 
								'score' : score+'%',
								'idCard': item.faceIDCard || '无'
						}
						alertList.push(d);

					}
					$('#no_alert_msg').hide();
					//remove old alert item
					var alertItems = $('.alert-container .alert_item');
					if(alertItems.length > 20){
						var showRemove = alertItems.length - 20;
						for(var i=0; i<showRemove; i++){
							$('.alert-container .alert_item').last().remove();
						}
					}
					//console.log(alertList)
					$('#monitor_detail').data('alertList', alertList);
				}
			},
			error: function() {
				noty({text: '获取告警信息失败', layout: 'topCenter', type: 'warning', timeout: 2000});
			}
		});
	};
	function fetchCaptures(openedCameraIds) {
		$.ajax({
			type: 'post',
			url: d_url + '/monitor/fetchCaptures',
			data: JSON.stringify({'sourceIdList': openedCameraIds, 'lastTime' : $('#monitor_detail').data('last_capture_time')}),
			contentType: 'application/json',
			success: function(resp) {
				if(!resp.success) {
					noty({text: resp.errorMessage, layout: 'topCenter', type: 'warning', timeout: 2000});
					return;
				}
				
				var MIN_ITEMS = 25;
				var MAX_ITEMS = 100;
				var docHeight = $(document).height();
				var captures = resp.data;
				if(captures && captures.length > 0) {
					//set last capture time
					$('#monitor_detail').data('last_capture_time', captures[0].captureTimeStr);
					for(var index=captures.length-1; index>=0; index--){
						var item = captures[index];
						var captureContainer = $("#" + item.id);
						if(captureContainer){
							captureContainer.remove();
						}
						var html = captureInfoTemplate({'captureId': item.id, 'captureImg': item.realFilePath, 'sourceName': item.source.name, 'captureTime' : item.captureTimeStr,
							'captureOriginImg':item.realOriginFilePath, 'beard':item.beard, 'hat':item.hat, 'glasses':item.glasses, 'sex':item.sex, 'age':item.age});
						$('.capture-container').prepend(html);
					}
					$('.extend-capture').show();

					var item_count = $('.capture-container .capture-item').length;
					var isMoreDisplay = $('#monitor_detail .unfold-link').css('display') != 'none';
					if(isMoreDisplay){
						ITEM_MAX = MIN_ITEMS;
					}else{
						ITEM_MAX = MAX_ITEMS;
					}
					var needRemove = item_count > ITEM_MAX;
					//remove old capture item
					if(needRemove) {
						for(var i=0; i<item_count-ITEM_MAX; i++){
							$('.capture-container .capture-item').last().remove();
						}
					}
				}
				
				if(docHeight != $(document).height()){ //body resize
					$('.camera-select').change();
				}
				
			},
			error: function() {
				noty({text: '获取抓拍信息失败', layout: 'topCenter', type: 'warning', timeout: 2000});
			}
		});
	};
	function _getLastAlertIdAndCaptureTime(cb){
		$.ajax({
			type: 'get',
			url: d_url + '/monitor/fetchLastInfo',
			success: function(resp) {
				if(!resp.success) {
					noty({text: resp.errorMessage, layout: 'topCenter', type: 'warning', timeout: 2000});
					return;
				}
				var info = resp.data;
				$('#monitor_detail').data('last_alert_capture_time', info.last_alert_capture_time);
				$('#monitor_detail').data('last_capture_time', info.last_capture_time);
				cb();
			},
			error: function() {
				noty({text: '获取告警信息失败', layout: 'topCenter', type: 'warning', timeout: 2000});
			}
		});
	};
	function getOpenedCameraIds() {
		var openedCameraIds = [];
		
		$('.camera-select option:selected').each(function(index, dom) {
			var cid = $(dom).attr('cid');
			
			if(cid && $.inArray(cid, openedCameraIds) === -1) {
				openedCameraIds.push(parseInt(cid));
			} 
		});
		
		if(open_camera_num==0 && openedCameraIds.length>0){ // 0 -> n
			open_camera_num = openedCameraIds.length;
			_getLastAlertIdAndCaptureTime(function(){
				//console.log('get last time done');
				fetchAlerts(openedCameraIds);
				fetchCaptures(openedCameraIds);
			});
		}else if(open_camera_num>0 && openedCameraIds.length==0){ // n -> 0
			open_camera_num = 0;
			//reset fetch data
			$('#monitor_detail').removeData('last_alert_capture_time');
			$('#monitor_detail').removeData('last_capture_time');
			$('#monitor_detail').removeData('alertList');
			return openedCameraIds;
		}else{
			return openedCameraIds;
		}
	}
	function init(is_default_page){
		if (!is_default_page) {
			intervalId = setInterval(function() {
				var openedCameraIds = getOpenedCameraIds();
				if(!openedCameraIds){
					return;
				}
				if(openedCameraIds.length > 0) {
					fetchAlerts(openedCameraIds);
					fetchCaptures(openedCameraIds);
				} else {
					$('.alert-container .alert_item').remove();
					$('#no_alert_msg').show();
					$('.capture-container .capture-item').remove();
				}
			}, INTERVAL_TIME * 1000);
		}
		
		var width = $('#picTip').width();
		var height=width*9/16;
		$("#picTip").height(height);
		$('#picTip').css('line-height',height+'px');
		$('#realTime_camero').on('click', '.full-btn', function() {
			var $target = $(this);
			var vlcDom = $target.parents('.camera-container').find('embed')[0];
			vlcDom.video.toggleFullscreen();
			vlcDom.video.fullscreen = true;
		});
		$('#realTime_camero').on('click', '.four-windows-btn', function() {
			var $container = $(this).parents('.camera-container');
			var index = $container.attr('index');
			$(this).parents('.four-windows').find('.camera-container[index!='+index+']').show();
			$container.width('45%');
			$(window).resize();
		});
		$('#realTime_camero').on('click', '.one-window-btn', function() {
			var $container = $(this).parents('.camera-container');
			var index = $container.attr('index');
			$(this).parents('.four-windows').find('.camera-container[index!='+index+']').each(function(index, item){
				var $select = $(item).find('.camera-select');
				$select.val('');
				$(item).hide();
			})
			$container.width('97%');
			$(window).resize();
		});
		$('#realTime_camero').on('change', '.camera-select', function() {
			var $target = $(this);
			var vlcDom = $target.parents('.camera-container').find('embed')[0];
			var newValue = $target.children('option:selected').val();
			
			if(vlcDom && vlcDom.playlist){
				vlcDom.playlist.stop();
				vlcDom.playlist.items.clear();
			}
			//console.log('new value:'+newValue)
			if(vlcDom && vlcDom.video && newValue) {
				vlcDom.video.aspectRatio = '16:9';
				vlcDom.playlist.add(newValue);
				vlcDom.playlist.play();
			}
		});
		$('#monitor_detail').on('click', '.unfold-link', function() {
			var openedCameraIds = getOpenedCameraIds();
			var firstTime = $('.capture-container .capture-item:last').attr('captureTime');
			var $this = $(this);
			$.ajax({
				type: 'post',
				url: d_url + '/monitor/fetchMoreCaptures',
				data: JSON.stringify({'sourceIdList': openedCameraIds, 'firstTime' : firstTime}),
				contentType: 'application/json',
				success: function(resp) {
					if(!resp.success) {
						noty({text: resp.errorMessage, layout: 'topCenter', type: 'warning', timeout: 2000});
						return;
					}
					
					var captures = resp.data;
					if(captures && captures.length > 0) {
						$this.hide();
						for(var index=0; index < captures.length; index++){
							var item = captures[index];
							var html = captureInfoTemplate({'captureId': item.id, 'captureImg': item.realFilePath, 'sourceName': item.source.name, 'captureTime' : item.captureTimeStr,
								'captureOriginImg':item.realOriginFilePath,  'beard':item.beard, 'hat':item.hat, 'glasses':item.glasses, 'sex':item.sex, 'age':item.age});
							$('.capture-container').append(html);
						}
					}
				}
			});
			
		});
		
		/*$('#view_alert_detail_link').click(function() {
			var sourceId = $("#defaultSourceId").val();
			if(!sourceId || sourceId.trim()==''){
				noty({text: '请先在左侧选择一个摄像头', layout: 'topCenter', type: 'warning', timeout: 2000});
				return;
			}
			dface.ajax({
				type: 'get',
				url: d_url + '/monitor/alert?sourceId=' + sourceId,
				success: function(resp) {
					$("#content").empty().html(resp);
				},
				error: function() {
					alert('获取告警历史页面失败');
				}
			});
		});*/
		
		/*$('#view_capture_detail_link').click(function() {
			var sourceId = $("#defaultSourceId").val();
			if(!sourceId || sourceId.trim()==''){
				noty({text: '请先在左侧选择一个摄像头', layout: 'topCenter', type: 'warning', timeout: 2000});
				return;
			}
			dface.ajax({
				type: 'get',
				url: d_url + '/monitor/capture?sourceId=' + sourceId,
				success: function(resp) {
					var $parentMenu = $('ul.sidebar-menu li:eq(0) ul.treeview-menu');
					$parentMenu.find('li a').css('color', '#8AA4AF');
					$parentMenu.find('li:eq(1) a').css('color', '#fff');
					
					$("#content").empty().html(resp);
				},
				error: function() {
					alert('获取抓拍历史页面失败');
				}
			});
		});*/
		
		$('body').data('alert_info_interval_id', intervalId);
		//__set_alert_interval();
		$(window).resize(_setVideoHigh);
		//IE
		if(document.addEventListener){
			document.addEventListener('msvisibilitychange',function(){
				//console.log(document.msVisibilityState);
				if(document.msVisibilityState=='visible'){
					__startVideoMontor();
				}else{
					__stopVideoMonitor();
				}
			});
		}
		//FF
		if(document.addEventListener){
			document.addEventListener('mozvisibilitychange',function(){
				//console.log(document.mozVisibilityState);
				if(document.mozVisibilityState=='visible'){
					__startVideoMontor();
				}else{
					__stopVideoMonitor();
				}
			});
		}
		//chrome
		if(document.addEventListener){
			document.addEventListener('webkitvisibilitychange',function(){
				//console.log(document.webkitVisibilityState);
				if(document.webkitVisibilityState=='visible'){
					__startVideoMontor();
				}else{
					__stopVideoMonitor();
				}
			});
		}
	}
	var _showCameraList = function(){
		var html = $('#video-list').html();
		if(html.trim()==''){
			return;
		}
		$('#video-source-menu').html(html);
		$('#video-source-menu').show();
		$('#video-source-menu a.menu').on('click', function(e){
			clearInterval($('body').data('alert_info_interval_id'));
			var $this = $(this);
			var rtsp = encodeURIComponent($this.attr('value'));
			tunicorn.utils.render(d_url+"/monitor/source/"+$this.attr('cid')+'?rtsp='+rtsp);
			//reset link color
			var $ul = $this.parent().parent();
			$ul.find('a.menu').css('color', 'rgb(138, 164, 175)');
			$this.css('color', 'rgb(255, 255, 255)');
		});
	}
	var _bindSideBarEvent = function(){
		var $sideBar = $('#sidebar-menu');
		var $taskLinks = $sideBar.find('li a.menu[menu="任务列表"]');
		$taskLinks.unbind('click');  
		$taskLinks.bind('click', function(e){
			var vlcDom = $('#realTime_camero embed')[0];
			if(vlcDom && vlcDom.playlist){
				vlcDom.playlist.stop();
				vlcDom.playlist.items.clear();
			}
		});
	}
	function showLargeImageModal(captureFilePath, captureOriginFilePath, beard, hat, glasses, age, sex){
		if(captureOriginFilePath){
			$("#bigImage").attr("src", captureOriginFilePath);	
		}else{
			$("#bigImage").attr("src", captureFilePath);
		}
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
		if(age){
			$("#ageSpan").html(age);
		}
		
		$('#bigImageModal').modal('show');
	};
	return {
		_init : init,
		_setVideoHigh : _setVideoHigh,
		_showCameraList : _showCameraList,
		_bindSideBarEvent : _bindSideBarEvent,
		showLargeImageModal:showLargeImageModal
	}
})()
