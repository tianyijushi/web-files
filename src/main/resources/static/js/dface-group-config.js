var d_url=tunicorn.contextPath;
var Config=window.Config || {};
(function(){
	Config.list={
			_init_:function(currentPage,totalCount){
				
				//createGroup
				$("#confirmCreateGroup").click(function(){
					Config.list._createGroup();
				});
				
				$(".confirmEditGroup").click(function(){
					var $this = $(this);
					Config.list._editGroup($this);
				});
				
				$(".confirmDelete").click(function(){
					var $this = $(this);
					Config.list._deleteGroup($this);
				});
				
				$(".setgroup").click(function(){
					var $this = $(this);
					Config.list._setUpIndex($this);
				});
				
				$(".lookGroup").click(function(){
					var $this = $(this);
					 Config.list._viewIndex($this);
				});
				
				$("#searchValue").keydown(function(){	
					var event=arguments.callee.caller.arguments[0]||window.event;
			        if(event.keyCode==13){
			        	Config.list._search();
					}
				});
				$("#iconSearch").click(function(){
					Config.list._search();
				});
				
				$('#cameras').selectpicker({
			    	width: '100%'
			    });
				//people-manage
				$('#group_list_container').on('click', '.people-manage', function() {
		        	var groupId = $(this).parents('tr').attr('gid');
		        
		        	$.ajax({
						 type: 'get',
						 url: d_url + '/group/user/manage?groupId=' + groupId,
						 success: function(data) {
						 	$("#content").html(data);
			        	},
			        	error: function(data) {
			        		$("html").html(data.responseText);
			        	}
					});
		        });
				
				 $("#createGroupModal").on("hidden.bs.modal", function() {
						$("#name").val("");
						$("#alertLevel").val("");
						$("#type").val("");
						$("#comment").val("");
						$("#maxCount").val("");
						$(this).removeData("bs.modal");
		        });
				 
				 $('#group_list_container').on('click', 'a.view-detail', function() {
						var groupId = $(this).attr('gid');						
						$.ajax({
							 type: 'get',
							 url: d_url + '/group/user/search?pageNum=0&name=&idCard=&sex=&criminalRecord=&idType=&groupId=' + groupId,
							 success: function(data) {
							 	var $parentMenu = $('ul.sidebar-menu > li:eq(1) ul.treeview-menu');
								$parentMenu.find('li a').css('color', '#8AA4AF');
								$parentMenu.find('li:eq(1) a').css('color', '#fff');
							 
							 	$("#content").html(data);
				        	},
				        	error: function(data) {
				        		$("html").html(data.responseText);
				        	}
						});
					});
				 Config.list._initPagination(currentPage, totalCount || 1);
			},
			_createGroup:function(){
				var name = $("#name").val();
				var alert = $("#alertLevel").val();
				var type = $("#type").val();
				var comment = $("#comment").val();
				var maxCount = $("#maxCount").val();
				if (name == "") {
					$('#errorMsg').text("请输入比对库名称");
					return;
				}
				if (alert == "") {
					$('#errorMsg').text("请选择告警级别");
					return;
				}
				if (type == "") {
					$('#errorMsg').text("请选择类型");
					return;
				}
				if (maxCount == "") {
					$('#errorMsg').text("请输入最大包含人员数量");
					return;
				}
				var regular = /^[0-9]*[1-9][0-9]*$/;
				//var regular = /^\d+$/;
				if(!regular.test(maxCount)){
					$('#errorMsg').text("包含人员数量请输入正整数");
					return;
				}
				
				var data = {"name":name, "alertLevel":alert, "maxCount":maxCount, "comment":comment, "type":type};
		    	$.ajax({
					 type: 'POST',
					 url: d_url + '/group/create',
					 contentType : 'application/json',
					 data: JSON.stringify(data),
					 dataType: 'json', 
					 success: function(data) {
					 	if (data.success) {
					 		$('#createGroupModal').modal('hide');
					 		setTimeout(function(){
					 			$.ajax({
									 type: 'GET',
									 url: d_url + '/group/config',
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
					 		$('#errorMsg').text(data.errorMessage);
					 	}
		        	},
		        	error: function(data) {
		        		//返回500错误页面
		        		$("html").html(data.responseText);
		        	}
				});
		    },
		    _editGroup:function($this){
		    	var eid = $this.attr('eid');
				var alert = $("#alertLevel_edit_" + eid).val();
				var type = $("#type_edit_" + eid).val();
				var comment = $("#comment_edit_" + eid).val();
				var maxCount = $("#maxCount_edit_" + eid).val();
				if (alert == "") {
					$('#errorMsg_' + eid).text("请选择告警级别");
					return;
				}
				if (type == "") {
					$('#errorMsg_' + eid).text("请选择类型");
					return;
				}
				if (maxCount == "") {
					$('#errorMsg_' + eid).text("请输入最大包含人员数量");
					return;
				}
				var regular = /^[0-9]*[1-9][0-9]*$/;
				//var regular = /^\d+$/;
				if(!regular.test(maxCount)){
					$('#errorMsg_' + eid).text("包含人员数量请输入正整数");
					return;
				}
				var data = {"alertLevel":alert, "maxCount":maxCount, "comment":comment, "type":type};
		    	$.ajax({
					 type: 'PUT',
					 url: d_url +　'/group/' + eid,
					 contentType : 'application/json',
					 data: JSON.stringify(data),
					 dataType: 'json', 
					 success: function(data) {
					 	if (data.success) {
					 		$('#editGroupModal_' + eid).modal('hide');
					 		setTimeout(function(){
					 			$.ajax({
									 type: 'GET',
									 url: d_url　+　'/group/config',
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
					 		$('#errorMsg_' + eid).text(data.errorMessage);
					 	}
		        	},
		        	error: function(data) {
		        		//返回500错误页面
		        		$("html").html(data.responseText);
		        	}
				});
		    },
		    _deleteGroup:function($this){
		    	var did=$this.attr("did")
				var data = {"status":"deleted"};
		    	$.ajax({
					 type: 'PUT',
					 url: d_url + '/group/' + did,
					 contentType : 'application/json',
					 data: JSON.stringify(data),
					 dataType: 'json', 
					 success: function(data) {
					 	if (data.success) {
				 			$('#deleteGroup_' + did).modal('hide');
				 			noty({text: '删除成功', layout: 'topCenter', type: 'success', timeout: 2000});
					 		setTimeout(function(){
					 			$.ajax({
									 type: 'GET',
									 url: d_url +　'/group/config',
									 success: function(data) {
									 	$("#content").html(data);
						        	},
						        	error: function(data) {
						        		//返回500错误页面
						        		$("html").html(data.responseText);
						        	}
								});
					 		}, 500);
					 	} else {
					 		$('#del_errorMsg_' + did).text("无法删除:" + data.errorMessage);
					 	}
		        	},
		        	error: function(data) {
		        		//返回500错误页面
		        		$("html").html(data.responseText);
		        	}
				});
		    },
		    _setUpIndex:function($this) {
		    	var sid=$this.attr('sid');
		    	$.ajax({
					type: 'POST',
					url: d_url + '/group/' + sid + '/index',
					contentType: 'application/x-www-form-urlencoded',
					data: {'groupId': sid},
					dataType: 'json', 
					success: function(data) {
						if (data.success) {
							$this.prop('disabled', true);
							noty({text: '正在入库，这需要几分钟', layout: 'topCenter', type: 'warning', timeout: 2000});
							return;
						} else {
							noty({text: data.errorMessage, layout: 'topCenter', type: 'warning', timeout: 2000});
							return;
						}
		        	},
		        	error: function(data) {
		        		noty({text: '入库失败', layout: 'topCenter', type: 'error', timeout: 2000});
		        	}
				});
		    },
		    _viewIndex:function($this) {
		    	var vid=$this.attr("vid")
		    	$.ajax({
					type: 'POST',
					url: d_url + '/group/' + vid + '/index/status',
					contentType: 'application/x-www-form-urlencoded',
					data: {'groupId': vid},
					dataType: 'json', 
					success: function(data) {
						noty({text: data.data, layout: 'topCenter', type: 'warning', timeout: 2000});
						return;
		        	},
		        	error: function(data) {
		        		noty({text: '查看是否入库失败', layout: 'topCenter', type: 'error', timeout: 2000});
		        	}
				});
		    },
		    _search:function(pageNum) {
		    	var searchValue = $("#searchValue").val();		    	
		    	var page = 0;
		    	if (pageNum) {
		    		page = pageNum -1;
		    	}
		    	$.ajax({
					 type: 'GET',
					 url: d_url + '/group/config?name='+searchValue + '&pageNum=' + page,
					 success: function(data) {
					 	$("#content").html(data);
		        	},
		        	error: function(data) {
		        		//返回500错误页面
		        		$("html").html(data.responseText);
		        	}
				});		    
		    },
		    _initPagination:function(currentPage, totalCount) {
				var options = {
					alignment: 'center',
			        currentPage: currentPage,
			        totalPages: Math.ceil(totalCount / dface.constants.PAGINATION_ITEMS_PER_PAGE),
			        numberOfPages: dface.constants.PAGINATION_ITEMS_PER_PAGE,
			        onPageClicked: function (event, originalEvent, type, page) {
			        	Config.list._doPaginationClicked(page);
			        }
				};				
				$('#table_paginator').bootstrapPaginator(options);
				$("#table_paginator").show();
			},
			_doPaginationClicked:function(pageNum) {
				Config.list._search(pageNum);
			}
	}
	window.Config=Config;
})()