var d_url=tunicorn.contextPath;
var deployControl=window.deployControl || {};
deployControl=(function(){
	var canDeleteDeploy = $("#canDeleteDeploy").val();
	var canExecuteDeploy = $("#canExecuteDeploy").val();
	var canEditDeploy = $("#canEditDeploy").val();
	var deploy_item_template = '';
	deploy_item_template += '<tr class="captureTable" did="{{deployId}}">' +
	                        	'<td class="deploy-name"><p class="newline" title="{{deployName}}">{{deployName}}</p></td>' +
	                        	'<td class="source-name" cid="{{sourceId}}"><p class="newline" title="{{sourceName}}">{{sourceName}}</p></td>' +
	                        	'<td class="deploy-type" tname="{{deployType}}">{{deployTypeStr}}</td>' +
	                        	'<td class="deploy-level" levelid="{{deployLevel}}">{{deployLevel}}级</td>'+
	                        	'<td class="deploy-common" recurrence="{{recurrence}}">{{deployRecurrenceType}}</td>'+
	                        	'<td class="group-name" gid="{{faceGroupIds}}">{{groupName}}</td>' +
	                        	'<td class="deploy-start-time">{{startTime}}</td>' +
	                        	'<td class="deploy-end-time">{{endTime}}</td>' +
	                        	'<td class="deploy-time" week="{{weeks}}" time="{{times}}">'+
	                        	'{{deployTime}}'+
	                        	'</td>'+
	                        	'<td class="status">{{deployStatus}}</td>';
	                            if(canExecuteDeploy == 'true' || canEditDeploy == 'true' || canDeleteDeploy == 'true'){
	                            	deploy_item_template +=  '<td>';
		                        	if(canExecuteDeploy == 'true'){
		                        		deploy_item_template += '<button style="display:{{showPlay}};" title="执行" type="button" class="btn btn-sm btn-success glyphicon glyphicon-play start-btn"></button>' +' '+
		                        		'<button style="display:{{showStop}};" title="停止" type="button" class="btn btn-sm btn-danger glyphicon glyphicon-stop stop-btn"></button>' +' '+
		                        		'<input  type="button" class="btn" style="display:{{showBlock}};width:34px;height:30px;background-color:#fff;border:none;cursor: default;outline: none;box-shadow: none;">' +' ';
		                        	}
									if(canEditDeploy == 'true'){
										deploy_item_template += '<button title="编辑" type="button" class="btn btn-sm btn-success glyphicon glyphicon-pencil edit-btn"></button>' +' ';
									}
									if(canDeleteDeploy == 'true'){
										deploy_item_template += '<button title="删除" type="button" class="btn btn-sm btn-danger glyphicon glyphicon-trash delete-btn" ></button>' ;
									}
									deploy_item_template +=  '</td>';
	                            }
								deploy_item_template += '</tr>';
	
	_.templateSettings = {
		interpolate: /\{\{(.+?)\}\}/g,
		evaluate: /\{\%(.+?)\%\}/g
	};
	
	var deployItemTemplate = _.template(deploy_item_template);
	function init(currentPage,totalCount){
		initVideoSource();
		$("#modal-source-select").change(function(){
			initVideoSource();
		});
		if(totalCount != "0"){
			initPagination(currentPage,totalCount);
		};
		$('#search-btn').click(function() {
			doDeploySearch(1);
		});
		$('#create-btn').click(function() {
			$('#deployModalLabel').text('新建布控');
			$('#deployModel').attr('did', '0');
			$("#commonDeployLi").show();
			$("#cycleDeployLi").show();
			$('#deploy-name').val('');
			$('#deploy-name-cycle').val('');
			$('#modal-type-select').val($('#modal-type-select').find('option:eq(0)').val());
			$('#modal-source-select').val($('#modal-source-select').find('option:eq(0)').val());
			$('#modal-type-select-cycle').val($('#modal-type-select-cycle').find('option:eq(0)').val());
			$('#modal-source-select-cycle').val($('#modal-source-select-cycle').find('option:eq(0)').val());
			$('.modal-group-select').selectpicker('val', $('.modal-group-select').find('option:eq(0)').val())
			$('.modal-group-select').selectpicker('refresh');
			$('.modal-group-select-cycle').selectpicker('val', $('.modal-group-select-cycle').find('option:eq(0)').val())
			$('.modal-group-select-cycle').selectpicker('refresh');
			
			$(".dateInput").prop('checked', false);
			
			var timesInput1 = $("#timesInput1");
			var timesInput2 = $("#timesInput2");
			if(timesInput1){
				timesInput1.remove();
			}
			if(timesInput2){
				timesInput2.remove();
			}
			$(".startTime").val('');
			$(".endTime").val('');
			$("#commonDeployLia").click();
			
			var dateData = getInitDate();
			$('#fromDate').val(dateData['startDate']);
			$('#toDate').val(dateData['endDate']);
			initVideoSource();
			$('#deployModel').modal('show');
		});
		
		$('#modal-cancel-btn').click(function() {
			$('#deployModel').modal('hide');
		});
		
		$('#modal-save-btn').click(function() {
			saveDeploy();
		});
		
		$('#modal-save-btn-cycle').click(function() {
			saveRecurrenceDeploy();
		});
		
		$('#deploy-container').on('click', '.edit-btn', function(e) {
			var $target = $(this);
			var $parent = $target.parents('tr');
			
			var status = $parent.find('.status').text().trim();
			if(status=='进行中'){
				noty({text: "进行中的布控不可编辑!", layout: "topCenter", type: "warning", timeout: 2000});
				return;
			}
			
			$('#deployModalLabel').text('编辑布控');
			$('#deployModel').attr('did', $parent.attr('did'));
			$(".dateInput").prop('checked', false);
			var recurrence = $parent.find('.deploy-common').attr("recurrence");
			if(recurrence == "0"){
				$("#commonDeployLi").show();
				$("#cycleDeployLi").hide();
				$("#commonDeployLia").click();
				$('#deploy-name').val($parent.find('.deploy-name').text());
				$('#modal-type-select').val($parent.find('.deploy-type').attr('tname'));
				$('#modal-source-select').val($parent.find('.source-name').attr('cid'));
				$("#deploy-level").val($parent.find('.deploy-level').attr('levelid'));
				var gid = $parent.find('.group-name').attr('gid').substring(1).split(',');
				$('.modal-group-select').selectpicker('val', gid);
				$('.modal-group-select').selectpicker('refresh');
				$('.modal-group-select-cycle').selectpicker('val', gid);
				$('.modal-group-select-cycle').selectpicker('refresh');
				
				$('#fromDate').val($parent.find('.deploy-start-time').text());
				$('#toDate').val($parent.find('.deploy-end-time').text());

				initVideoSource();
			}else if(recurrence == "1"){
				var timesInput1 = $("#timesInput1");
				var timesInput2 = $("#timesInput2");
				if(timesInput1){
					timesInput1.remove();
				}
				if(timesInput2){
					timesInput2.remove();
				}
				$("#commonDeployLi").hide();
				$("#cycleDeployLi").show();
				$("#cycleDeployLia").click();
				$('#deploy-name-cycle').val($parent.find('.deploy-name').text());
				$('#modal-type-select-cycle').val($parent.find('.deploy-type').attr('tname'));
				$("#deploy-level-cycle").val($parent.find('.deploy-level').attr('levelid'));
				$('#modal-source-select-cycle').val($parent.find('.source-name').attr('cid'));
				var gid = $parent.find('.group-name').attr('gid').substring(1).split(',');
				var weeks = $parent.find('.deploy-time').attr('week').substring(1).split(',');
				if(weeks){
					for(var i = 0; i < weeks.length; i++){
						$(".dateInput[value='" + weeks[i] + "']").prop("checked", true);
					}
				}
				var times = $parent.find('.deploy-time').attr('time').substring(1).split(',');
				if(times){
					for(var j = 0; j < times.length; j++){
						var time = times[j];
						var tempTime = time.split("-");
						if(j == 0){
						$("#startTimeInput0").val(tempTime[0]);
						$("#endTimeInput0").val(tempTime[1]);
						}
						if(j == 1){
							$("#add-time").click();
							$("#startTimeInput1").val(tempTime[0]);
							$("#endTimeInput1").val(tempTime[1]);
						}
						if(j == 2){
							$("#add-time").click();
							$("#startTimeInput2").val(tempTime[0]);
							$("#endTimeInput2").val(tempTime[1]);
						}
					}
				}
				$('.modal-group-select-cycle').selectpicker('val', gid);
				$('.modal-group-select-cycle').selectpicker('refresh');
			}
			$('#deployModel').modal('show');
		});
		$('.modal-group-select').selectpicker({
	    	width: '100%'
	    });
		$('.modal-group-select-cycle').selectpicker({
	    	width: '100%'
	    });
		
		$('#deploy-container').on('click', '.delete-btn', function(e) {
			var $target = $(this);
			var $parent = $target.parents('tr');
			
			var status = $parent.find('.status').text().trim();
			if(status=='进行中'){
				noty({text: "进行中的布控不可删除，请先停止该布控!", layout: "topCenter", type: "warning", timeout: 2000});
				return; 
			} 
			$('#user_confrim_label').attr('did', $parent.attr('did'));
			$('#user_confrim_label').attr('action', 'delete');
			$('#user_confrim').modal('show'); 
		});

		$('#deploy-container').on('click', '.stop-btn', function(e) {
			var $target = $(this);
			var $parent = $target.parents('tr');
			
			$('#user_confrim_label').attr('did', $parent.attr('did'));
			$('#user_confrim_label').attr('action', 'stop');
			$('#user_confrim').modal('show');
		});
		
		$('#deploy-container').on('click', '.start-btn', function(e) {
			var $target = $(this);
			var $parent = $target.parents('tr');
			
			var status = $parent.find('.status').text('已创建');
			var data = {
				id : $parent.attr('did'),
				action : 'start'
			}
			
			$.ajax({
				type: 'post',
				url: d_url + '/deploy/action',
				data: JSON.stringify(data),
				contentType: 'application/json',
				context : $target,
				success: function(resp) {
					if(!resp.success) {
						noty({text: resp.errorMessage, layout: "topCenter", type: "warning", timeout: 2000});
						return;
					}
					noty({text: "更新布控状态成功!", layout: "topCenter", type: "warning", timeout: 2000});
					this.hide();
				},
				error: function() {
					noty({text: "保存布控信息失败!", layout: "topCenter", type: "warning", timeout: 2000});
				}
			});
		});
		
		$("#add-time").on("click",function(){
			var timeDivs = $(".times");
			var timesLength = timeDivs.length;
			if(timesLength == 3){
				noty({text: "最多选择3个时间段!", layout: "topCenter", type: "warning", timeout: 2000});
				return;
			}
			var html='<div class="times " id="timesInput' + timesLength + '">'+
	                	'<span class="control-label col-sm-3  text-right lh" >时间段</span>'+
	                    '<div class="col-sm-8 deployTime" >'+
	                        '<div style="float: left" class="form-group input-group date form_datetime3 col-sm-5" data-date="2016-11-1T05:25:07Z" data-date-format="hh:ii:ss" >'+
			                    '<input id="startTimeInput' + timesLength + '" placeholder="请选择" class="form-control startTime" readonly size="16" type="text">'+
			                    '<span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>'+
			                '</div>'+
			                '<div style="float: left;line-height: 34px" class="form-group glyphicon glyphicon-minus"></div>'+
			                '<div style="float: left" class=" input-group date form_datetime4 col-sm-5 delete-padding" data-date="2016-11-1T05:25:07Z" data-date-format="hh:ii:ss" >'+
			                    '<input id="endTimeInput' + timesLength + '" placeholder="请选择" class="form-control endTime" readonly size="16" type="text" >'+
			                    '<span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>'+
			                '</div>'+
			                '<div class="delete-time" onclick="deployControl.deleteTimeDiv(this)"><button class="btn btn-sm btn-danger glyphicon glyphicon-trash"></button></div>'+
	                     '</div>'+
	                '</div>';
			           
	        $("#time-box").append(html);
	        initTime();
		})
		
		$(".delete-time").on("click",function(){
			var timeDivs = $(".times");
			if(timeDivs.length == 1){
				noty({text: "至少选择1个时间段!", layout: "topCenter", type: "warning", timeout: 2000});
				return;
			}
			$(this).parents(".times").remove();
		})
		initDate();
		$('#confrim').on('click', function(e){
			var did = $('#user_confrim_label').attr('did');
			var action = $('#user_confrim_label').attr('action');
			var $parent = $('#deploy-table .captureTable[did='+did+']');
			if(action=='stop'){
				var data = {
					id : did,
					action : 'stop'
				};
				$.ajax({
					type: 'post',
					url: d_url + '/deploy/action',
					data: JSON.stringify(data),
					contentType: 'application/json',
					context : $parent,
					success: function(resp) {
						if(!resp.success) {
							noty({text: resp.errorMessage, layout: "topCenter", type: "warning", timeout: 2000});
							return;
						}
						noty({text: "更新布控成功!", layout: "topCenter", type: "warning", timeout: 2000});
						$('#user_confrim').modal('hide');
						this.find('.status').text('已停止');
						this.find('.start-btn').css('display', 'inline-block'); 
						this.find('.stop-btn').hide();
					},
					error: function() {
						noty({text: "保存布控信息失败!", layout: "topCenter", type: "warning", timeout: 2000});
					}
				});
			}else if(action=='delete'){
				var data = {
					id : did,
					action : 'delete'
				};
				$.ajax({
					type: 'post',
					url: d_url + '/deploy/action',
					data: JSON.stringify(data),
					contentType: 'application/json',
					context : $parent,
					success: function(resp) {
						if(!resp.success) {
							noty({text: resp.errorMessage, layout: "topCenter", type: "warning", timeout: 2000});
							return;
						}
						noty({text: "更新布控成功!", layout: "topCenter", type: "warning", timeout: 2000});
						$('#user_confrim').modal('hide');
						this.remove(); 
					},
					error: function() {
						noty({text: "保存布控信息失败!", layout: "topCenter", type: "warning", timeout: 2000});
					}
				});
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
	function doPaginationClicked(pageNum) {
		doDeploySearch(pageNum);
	};
	function deleteTimeDiv(_this){
		var timeDivs = $(".times");
		if(timeDivs.length == 1){
			noty({text: "至少选择1个时间段!", layout: "topCenter", type: "warning", timeout: 1000});
			return;
		}
		$(_this).parents(".times").remove();
	};
	function initVideoSource() {
		var startTime = $('#startTime');
		var endTime = $('#endTime');
		var type = $('#modal-source-select').find("option:selected").attr('type');
		if (type == 'online') {
			startTime.css('display','block');
			endTime.css('display','block');
		} else {
			startTime.css('display','none');
			endTime.css('display','none');
		}
	};
	function doDeploySearch(pageNum) {
		var page = 0;
    	if (pageNum) {
    		page = pageNum -1;
    	}
		var searchData = {'deployName': $.trim($('#name-input').val()), 'deployStatus': $.trim($('#status-select').val()), 
				'deployType': $.trim($('#type-select').val()), 'faceGroupId': parseInt($.trim($('#group-select').val())),
				'pageNum': page, 'level':$("#level-select").val()};
		$.ajax({
			type: 'post',
			url: d_url + '/deploy/searchDeploy',
			data: JSON.stringify(searchData),
			contentType: 'application/json',
			success: function(resp) {
				if(!resp.success) {
					alert('获取布控信息异常');
					return;
				}
				
				var currentPage = resp.data.currentPage;
				var totalCount = resp.data.totalCount;
				initPagination(currentPage, totalCount || 1);
				var alerts = resp.data.deploys;
				$('#deploy-table').find('tr.captureTable:not(".tableHeader")').remove();
				
				$.each(alerts, function(index, item) {
					var groupName = '';
					var faceGroupIds = '';
					var deployRecurrenceType = '普通布控';
					var deployTime = '';
					if(item.faceGroups!=null && item.faceGroups.length>0){
						for(var i=0;i<item.faceGroups.length;i++){
							groupName += item.faceGroups[i].name+" , ";
						}
						var newGroupName = groupName.substring(0,groupName.length - 2);
						for(var i=0; i<item.faceGroups.length; i++){
							faceGroupIds += ',' + item.faceGroups[i].id
						}
					}
					
					if(item.status=='stoped'){
						var showBlock = 'none';
						var showPlay = 'inline-block';
						var showStop = 'none';
					}else if(item.status=='inprogress'){
						var showBlock = 'none';
						var showPlay = 'none';
						var showStop = 'inline-block';
					}else{
						var showPlay = 'none';
						var showStop = 'none';
						var showBlock = 'inline-block';
					}
					if(item.recurrence == "1"){
						deployRecurrenceType = "周期布控";
					}
					var weeks = '';
					var times = '';
					if(item.weeks && item.weeks.length > 0){
						for(var i = 0;i < item.weeks.length;i++){
							deployTime += item.weeks[i].weekStr;
							weeks += "," + item.weeks[i].week;
							deployTime += "&nbsp;&nbsp;";
						}
					}
					deployTime += '<br />';
					if(item.times && item.times.length > 0){
						for(var j = 0;j < item.times.length;j++){
							deployTime += item.times[j].startTime + "-" + item.times[j].endTime;
							deployTime += "<br />";
							times += "," + item.times[j].startTime + "-" + item.times[j].endTime;
						}
					}
					$('#deploy-table').find('tbody').append(deployItemTemplate({'deployId': item.id, 'deployName': item.name, 'sourceName': item.source.name, 
															'deployTypeStr': item.typeStr, 'groupName': newGroupName,
															'startTime': item.startTimeStr || '', 'endTime': item.endTimeStr || '', 'deployStatus': item.statusStr,
															'faceGroupIds': faceGroupIds, 'sourceId': item.source.id, 'deployType': item.type,'showBlock':showBlock, 'showPlay' : showPlay, 
															'showStop' : showStop, 'deployLevel':item.level, 'deployRecurrenceType':deployRecurrenceType, 'deployTime':deployTime,
															'recurrence':item.recurrence, 'weeks':weeks, 'times':times}));
				});
			},
			error: function() {
				alert('获取布控信息失败');
			}
		});
	};
	function getInitDate() {
		var current = moment();
		return {'startDate': current.format('YYYY-MM-DD HH:mm:ss'), 'endDate': current.add(1, 'M').format('YYYY-MM-DD HH:mm:ss')};
	};
	
	
	function initDate() {
		$('.datetimepicker').remove();
		var dateData = getInitDate();
		$("#toDate").val(dateData['endDate']);
		$("#fromDate").val(dateData['startDate']);
		
		
		//时间段显示
		$('.form_datetime1').datetimepicker({
			format: 'yyyy-mm-dd hh:ii:ss',
			language: 'zh-CN',
		    todayBtn : "linked",
		    autoclose:true ,
		    pickerPosition: "top-right",
		    startDate : new Date()
		}).on('changeDate',function(e){
		    var startTime = e.date;
		    $('.form_datetime2').datetimepicker('setStartDate',startTime);
		});
		
		$('.form_datetime2').datetimepicker({
		    language: 'zh-CN',
		    format: 'yyyy-mm-dd hh:ii:ss',
		    todayBtn : "linked",
		    pickerPosition: "top-right",
		    autoclose:true, //选择日期后自动关闭
		    startDate : new Date()
		}).on('changeDate',function(e){
		    var endTime = e.date;
		    $('.form_datetime1').datetimepicker('setEndDate',endTime);
		});
		
		

		
		$('.form_datetime3').datetimepicker({
			format: 'hh:ii:ss',
			language: 'zh-CN',
		    todayBtn : "linked",
		    startView:1,
		    autoclose:true ,
		    pickerPosition: "top-right",
		}).on('changeDate',function(e){
		    var startTime = e.date;
		    $('.form_datetime4').datetimepicker('setStartDate',startTime);
		});
		
		$('.form_datetime4').datetimepicker({
		    language: 'zh-CN',
		    format: 'hh:ii:ss',
		    todayBtn : "linked",
		    startView: 1,
		    pickerPosition: "top-right",
		    autoclose:true, //选择日期后自动关闭
		    startDate : $(".startTime").val()
		}).on('changeDate',function(e){
		    var endTime = e.date;
		    $('.form_datetime3').datetimepicker('setEndDate',endTime);
		});
	};
	
	function initTime(){
		$('.form_datetime3').datetimepicker({
			format: 'hh:ii:ss',
			language: 'zh-CN',
		    todayBtn : "linked",
		    startView:1,
		    autoclose:true ,
		    pickerPosition: "top-right",
		}).on('changeDate',function(e){
		    var startTime = e.date;
		    $('.form_datetime4').datetimepicker('setStartDate',startTime);
		});
		
		$('.form_datetime4').datetimepicker({
		    language: 'zh-CN',
		    format: 'hh:ii:ss',
		    todayBtn : "linked",
		    startView: 1,
		    pickerPosition: "top-right",
		    autoclose:true, //选择日期后自动关闭
		    startDate : $(".startTime").val()
		}).on('changeDate',function(e){
		    var endTime = e.date;
		    $('.form_datetime3').datetimepicker('setEndDate',endTime);
		});
	}
	function saveDeploy() {
		var name = $.trim($('#deploy-name').val());
		if(name==''){
			noty({text: "布控名称不能为空!", layout: "topCenter", type: "warning", timeout: 2000});
			return;
		}
		var startTimeStr = $.trim($('#fromDate').val());
		if(startTimeStr.split(':').length == 2) {
			startTimeStr += ':00';
		}
		var endTimeStr = $.trim($('#toDate').val());
		if(endTimeStr.split(':').length == 2) {
			endTimeStr += ':00';
		}
		var groups = $('#modal-group-select').val();
		if(groups && groups.length>5){
			noty({text: "最多选择5个比对库!", layout: "topCenter", type: "warning", timeout: 2000});
			return;
		}else if(!groups || groups.length==0){
			noty({text: "至少选择1个比对库!", layout: "topCenter", type: "warning", timeout: 2000});
			return;
		}
		//handle offline
		var type = $('#modal-source-select').find("option:selected").attr('type');
		if (type == 'offline') {
			startTimeStr = '';
			endTimeStr = '';
		} 
		var deployLevel = $("#deploy-level").val();
		var data = {'id': parseInt($('#deployModel').attr('did')), 'name': name, 'type': $.trim($('#modal-type-select').val()),
					'faceGroupIds': groups, 'startTimeStr': startTimeStr,
					'endTimeStr':endTimeStr, 'sourceId': parseInt($.trim($('#modal-source-select').val())),
					'level':deployLevel, 'recurrence':"0"};
		
		$.ajax({
			type: 'post',
			url: d_url + '/deploy/saveDeploy',
			data: JSON.stringify(data),
			contentType: 'application/json',
			success: function(resp) {
				if(!resp.success) {
					noty({text: resp.errorMessage, layout: "topCenter", type: "warning", timeout: 2000});
					return;
				}
				noty({text: "保存布控成功!", layout: "topCenter", type: "warning", timeout: 2000});
				$('#deployModel').modal('hide');
            	setTimeout(function(){
            		tunicorn.utils.render(d_url + '/deploy/control');
            	},500);
				//$('#table_paginator li.active a').click();
			},
			error: function() {
				noty({text: "保存布控信息失败!", layout: "topCenter", type: "warning", timeout: 2000});
			}
		});
	};
	
	function saveRecurrenceDeploy() {
		var name = $.trim($('#deploy-name-cycle').val());
		if(name==''){
			noty({text: "布控名称不能为空!", layout: "topCenter", type: "warning", timeout: 2000});
			return;
		}
		var groups = $('#modal-group-select-cycle').val();
		if(groups && groups.length>5){
			noty({text: "最多选择5个比对库!", layout: "topCenter", type: "warning", timeout: 2000});
			//return;
		}else if(!groups || groups.length==0){
			noty({text: "至少选择1个比对库!", layout: "topCenter", type: "warning", timeout: 2000});
			//return;
		}
		var deployLevel = $("#deploy-level-cycle").val()
		
		var weeks =[]; 
		$('input[name="date"]:checked').each(function(){ 
			weeks.push($(this).val()); 
		});
		if(weeks.length == 0){
			noty({text: "选择布控周期!", layout: "topCenter", type: "warning", timeout: 2000});
			return;
		}
		var times = [];
		$(".deployTime").each(function(){
			var time = {};
			var startTime = $(this).find(".startTime").val(); 
			var endTime = $(this).find(".endTime").val();
			if(startTime && endTime){
				time.startTime = startTime;
				time.endTime = endTime;
				times.push(time);
			}
		});
		if(times.length == 0){
			noty({text: "至少填写一个时间段!", layout: "topCenter", type: "warning", timeout: 2000});
			return;
		}
		//handle offline
		var data = {'id': parseInt($('#deployModel').attr('did')), 'name': name, 'type': $.trim($('#modal-type-select-cycle').val()),
					'faceGroupIds': groups, 'sourceId': parseInt($.trim($('#modal-source-select-cycle').val())),
					'recurrence':"1", 'level':deployLevel, 'weeks':weeks, 'times':times};
		
		$.ajax({
			type: 'post',
			url: d_url + '/deploy/saveDeploy',
			data: JSON.stringify(data),
			contentType: 'application/json',
			success: function(resp) {
				if(!resp.success) {
					noty({text: resp.errorMessage, layout: "topCenter", type: "warning", timeout: 2000});
					return;
				}
				noty({text: "保存布控成功!", layout: "topCenter", type: "warning", timeout: 2000});
				$('#deployModel').modal('hide');
            	setTimeout(function(){
            		tunicorn.utils.render(d_url + '/deploy/control');
            	},500);
				//$('#table_paginator li.active a').click();
			},
			error: function() {
				noty({text: "保存布控信息失败!", layout: "topCenter", type: "warning", timeout: 2000});
			}
		});
	};
	return {
		_init:init,
		deleteTimeDiv:deleteTimeDiv
	}
})();
