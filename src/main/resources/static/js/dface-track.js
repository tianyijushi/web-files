var d_url=tunicorn.contextPath;
var Track=window.Track || {};
(function(){
	Track.list={
			_init_:function(currentPage,totalCount){
				Track.list._initDate();
				$("#search-btn").click(function(){
			   		Track.list._searchTaskWithName(1);
			   	});
				if(totalCount != "0"){
		    		Track.list._initPagination(currentPage, totalCount); 
		    	}
				$("#user-name").keydown(function(){
			   		var event=arguments.callee.caller.arguments[0]||window.event;
			   		if(event.keyCode==13){
			   			Track.list._searchTaskWithName(1);
			   		}
			   	});
			   	$("#fromDate").keydown(function(){
			   		var event=arguments.callee.caller.arguments[0]||window.event;
			   		if(event.keyCode==13){
			   			Track.list._searchTaskWithName(1);
			   		}
			   	})	
			},
			_initDate:function() {
				$('.datetimepicker').remove();	
				var current = moment();
				var hiddenTimer=$('#hiddenTimer').val();
				if(!hiddenTimer){
					$("#fromDate").val(current.format('YYYY-MM-DD'));
				}else{
					$("#fromDate").val(hiddenTimer);
				}		
				$('.form_datetime1').datetimepicker({
				    language: 'zh-CN',
				    autoclose:true ,
				    minView:2,
				    endDate : new Date()
				})	
			},
			_showMask:function(){
				 var top = ($(window).height() - $(".loading_1").height())/2;   
			     var left = ($("#content").offsetWidth - $(".loading_1").width())/2;   
			     var scrollTop = $(document).scrollTop();   
			     var scrollLeft = $(document).scrollLeft();   
				  $(".loading").css({"top":top + scrollTop,"left":left + scrollLeft,"display":"block"});
				  $(".mask").height(document.body.scrollHeight);
				  $(".mask").width(document.body.offsetlWidth);
				  $(".mask").fadeTo(200, 0.2);	  
			},
			_hideMask:function (){
				$(".loading").css("display","none");
			    $(".mask").fadeOut(200);
			},
			_searchTaskWithName:function(pageNum) {
				var userName = $("#user-name").val();
				var createTime = $("#fromDate").val();
				if (pageNum) {
					page = pageNum -1;
				}
				Track.list._showMask();
				$.ajax({
					 type: 'GET',
					 url: d_url + '/userTrack/search?pageNum='
							 + page +"&userName=" + userName+ "&createTime=" + createTime,
					 success: function(data) {
						 Track.list._hideMask();
						$("#content").html(data);
			    	},
			    	error: function(data) {
			    		//返回500错误页面
			    		Track.list._hideMask();
			    		$("html").html(data.responseText);
			    	}
				});
			},
			_initPagination:function (currentPage, totalCount) {
	    		var options = {
	    			alignment: 'center',
	    	        currentPage: currentPage,
	    	        totalPages: Math.ceil(totalCount / dface.constants.PAGINATION_ITEMS_PER_PAGE),
	    	        numberOfPages: dface.constants.PAGINATION_ITEMS_PER_PAGE,
	    	        onPageClicked: function (event, originalEvent, type, page) {
	    	        	Track.list._doPaginationClicked(page);
	    	        }
	    		};
	    		
	    		$('#table_paginator').bootstrapPaginator(options);
	    		$("#table_paginator").show();
	    	},
	    	_doPaginationClicked:function (pageNum) {
	    		Track.list._searchTaskWithName(pageNum)
	    	}
			  
	}
	window.Track=Track;
})()