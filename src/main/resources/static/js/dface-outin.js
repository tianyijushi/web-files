var d_url=tunicorn.contextPath;
var outin=outin || {};
outin=(function(){
	var PAGE_SIZE = 8;
	var DETAIL_PAGE_SIZE = 10;
	var tpmStr = '{% _.forEach(items, function(item){ %}'+
					'<tr class="tabelCenter data">'+
						'<td >{{item.group.name}}</td>'+
						'<td >{{item.group.typeStr}}</td>'+
						'<td >{{item.faceName}}</td>'+
						'<td >{{item.firstTimeStr}}</td>'+
						'<td >{{item.lastTimeStr}}</td>'+
						'<td >{{item.total}}</td>'+
						'<td class="text-center">'+
						'<a href="/dfacec/outIn/detail" faceGroupId="{{item.group.id}}" faceName="{{item.faceName}}" '+
						' class="glyphicon glyphicon-search detail"></a></td>'+
					'</tr>'+
				'{% }); %}';
	_.templateSettings = {
			interpolate: /\{\{(.+?)\}\}/g,
			evaluate: /\{\%(.+?)\%\}/g
		};
	var compiled = _.template(tpmStr);
	
	function initPagination(currentPage, totalCount) {
		var options = {
			alignment: 'center',
	        currentPage: currentPage,
	        totalPages: Math.ceil(totalCount / PAGE_SIZE),
	        numberOfPages: PAGE_SIZE,
	        onPageClicked: function (event, originalEvent, type, page) {
	        	var data = warpQuery(page);
	            doQuery(data, render);
	        }
		};
		
		$('#table_paginator').bootstrapPaginator(options);
		$("#table_paginator").show();
	}
	
	function warpQuery(pageNum){
		var faceGroupIds = $('#faceGroupIds').val();
		var fromDate = $('#fromDate').val();
		var toDate = $('#toDate').val();
		var name = $('#name').val();
		if(pageNum){
			pageNum -= 1;
		}else{
			pageNum = 0;
		}
		
		$('#track-table').attr('fromDate', fromDate);
		$('#track-table').attr('toDate', toDate);
		return {
			'faceName': name,
			'faceGroupIds': faceGroupIds,
			'captureStartTime' : fromDate, 
			'captureEndTime' : toDate,
			'pageNum' : pageNum,
			"perPage": PAGE_SIZE
		}
	}
	
	function doQuery(data, cb){
		var url = d_url + '/outIn/time';
		tunicorn.utils.post(url, data, cb);
	}
	
	function render(err, json){
		if (json.success){
			var html = compiled({'items': json.data.list});
		}else{
			var html = '';
		}
		if(html.trim()==''){
			html = '<tr class="data">'+
		    		'<td colspan="7" style="text-align:center;">当次查询没有任何结果!</td>'+
		        	'</tr>';
		}
		$('#track-table tbody tr.data').remove();
		$('#track-table tbody').append(html);
		if(json.data.totalCount>0){
			initPagination(json.data.currentPage, json.data.totalCount);
		}else{
			initPagination(1, 1);
		}
		
	}

	function initDate() {
		var current = moment();
		$("#toDate").val(current.format('YYYY-MM-DD HH:mm:ss'));
	    $("#fromDate").val(current.subtract(2, 'days').format('YYYY-MM-DD HH:mm:ss'));

		//时间段显示
		$('.form_datetime1').datetimepicker({
		    language: 'zh-CN',
		    autoclose:true ,
		    endDate : new Date()
		}).on('changeDate',function(e){
		    var d=e.date;  
		    $('.form_datetime2').datetimepicker('setStartDate',d);
        	var end=d.setDate(d.getDate()+2);
        	var end1=new Date();
        	if(end>end1){
        		$("#toDate").val(moment(end1).format('YYYY-MM-DD HH:mm:ss'));
        		$('.form_datetime2').datetimepicker('setEndDate',end1);
        	}else{
        		var newdata=moment(d);
        		$("#toDate").val(newdata.format('YYYY-MM-DD HH:mm:ss'));
        		$('.form_datetime2').datetimepicker('setEndDate',d);
        	} 
		});
		$('.form_datetime2').datetimepicker({
		    language: 'zh-CN',
		    autoclose:true, //选择日期后自动关闭
		    startDate:$("#fromDate").val(),
		    endDate : new Date()
		}).on('changeDate',function(e){
		    var d=e.date;  
		    $('.form_datetime1').datetimepicker('setEndDate',d);
		    var end=d.setDate(d.getDate()-2);
		    var newdata=moment(d);
    		$("#fromDate").val(newdata.format('YYYY-MM-DD HH:mm:ss'));
		});
		
	};
	
	function init(currentPage, totalCount){
		$('#faceGroupIds').selectpicker({
            width:"100%"
        });
		$('#query').on('click', function(e){
            var data = warpQuery(1);
            doQuery(data, render);
        });
		$('#track-table').on('click', 'a.detail', function(e){
			e.preventDefault();
			var $this = $(this);
			var url = $this.attr('href');
			var faceGroupId = $this.attr('facegroupid');
			var faceName = $this.attr('facename');
			var captureStartTime = $('#track-table').attr('fromDate');
			var captureEndTime = $('#track-table').attr('toDate');
			var data = {
				faceGroupId : faceGroupId,
				faceName : faceName,
				captureStartTime : captureStartTime,
				captureEndTime : captureEndTime,
				perPage : DETAIL_PAGE_SIZE
			}
			$.ajax({
      		  type: "GET",
      		  url: url,
      		  data: data,
      		  success: function(html){
      			  $('#content').html(html);
      		  },
      		  error: function(data) {
            	 console.log(data.responseText);
          	 }
          	});
		});
		initDate();
		
		if(totalCount>0){
			initPagination(currentPage, totalCount);
		}
		
	};
	
	function initDetail(currentPage, totalCount){
		if(totalCount>0){
			var options = {
				alignment: 'center',
		        currentPage: currentPage,
		        totalPages: Math.ceil(totalCount / DETAIL_PAGE_SIZE),
		        numberOfPages: PAGE_SIZE,
		        onPageClicked: function (event, originalEvent, type, page) {
		        	var $this = $('#track-table');
		        	var url = $this.attr('url');
					var faceGroupId = $this.attr('facegroupid');
					var faceName = $this.attr('facename');
					var captureStartTime = $this.attr('fromDate');
					var captureEndTime = $this.attr('toDate');
					var data = {
						faceGroupId : faceGroupId,
						faceName : faceName,
						captureStartTime : captureStartTime,
						captureEndTime : captureEndTime,
						pageNum : page-1,
						perPage : DETAIL_PAGE_SIZE
					}
					$.ajax({
		      		  type: "GET",
		      		  url: url,
		      		  data: data,
		      		  success: function(html){
		      			  $('#content').html(html);
		      		  },
		      		  error: function(data) {
		            	 console.log(data.responseText);
		          	 }
		          	});
		        }
			};
			$('#table_paginator').bootstrapPaginator(options);
			$("#table_paginator").show();
		}
		
	};
	return {
		_init:init,
		_initDetail : initDetail
	}
})()