var Role=window.Role || {};
var d_url=tunicorn.contextPath;
(function(){
	Role.list={
		_init_:function(currentPage,totalCount){
			$('#base_role').on('change', function(e){
				$('#privileges option').prop('selected', false);
				var roleId = $(this).val();
				if (roleId != ''){
					dface.ajax({
						type: 'get',
						dataType: 'json', 
						url: d_url+'/role/'+roleId+'/privileges',
						success: function(resp) {
							if (!resp.success){
								noty({text: resp.errorMessage, layout: 'topCenter', type: 'error', timeout: 2000});
								return;
							}
							var data = resp.data;
							$.each(data, function(index, item){
								var $option = $('#privileges option[value='+ item.id +']');
								$option.prop('selected', true);
							});
						},
						error: function() {
							alert('获取角色权限失败');
						}
					});
				}
			});
			
			$("#role_create").click(function(){
				var rid = $("#rid").val();
			 	var name = $("#name").val();
			 	var privileges = $("#privileges").val();
			 	if (name == "") {
			 		noty({text: '请输入名称', layout: 'topCenter', type: 'error', timeout: 2000});
			 		return;
			 	}
			 	if (privileges==null) {
			 		noty({text: '请选择权限', layout: 'topCenter', type: 'error', timeout: 2000});
			 		return; 
			 	}
			 	var data = {'name':name, 'privilegeIds':privileges};
			 	if(rid.trim() != ''){
			 		var url = d_url + '/role/'+rid+'/update';
			 	}else{
			 		var url = d_url + '/role/create';
			 	}
			 	$.ajax({
					type: 'POST',
					url: url,
					contentType : 'application/json',
					dataType: 'json', 
					data: JSON.stringify(data),
					success: function(data) {
						if (!data.success) {
							noty({text: data.errorMessage, layout: 'topCenter', type: 'warning', timeout: 2000});
							return;
						}else{
							noty({text: "保存角色成功", layout: 'topCenter', type: 'success', timeout: 2000});
							$('#createRoleModal').modal('hide');
							setTimeout(function(){
								tunicorn.utils.render(d_url + '/role');
							}, 500);
							return;
						} 
		        	},
		        	error: function(data) {
		        		noty({text: '保存角色失败', layout: 'topCenter', type: 'error', timeout: 2000});
		        	}
				});
			 });
			 
			if(totalCount != "0"){
				Role.list._initPagination(currentPage, totalCount);
			}

				$('#roleSearch').on('click', function(e){
					 var roleSearchName = $('#roleSearchName').val().trim();
					 if (roleSearchName == ''){
						 noty({text: '请输入组织名', layout: 'topCenter', type: 'warning', timeout: 2000});
						 return;
					 }
					 Role.list._doRoleSearch(1);
				 });
				 
				$("#roleCreateShow").on('click', function(e){
					 $('#createRoleModalLabel').text('创建角色');
					 $('#rid').val("");
					 $('#name').val("");
					 $('#base_role').val("");
					 $('#privileges option').prop('selected', false);
					 $('#createRoleModal').modal('show');
				 });
				
				$("#roleTable .view").on('click', function(e){
					 var roleId = $(this).attr('rid');
					 dface.ajax({
						type: 'get',
						dataType: 'json', 
						url: d_url + '/role/'+roleId+'/privileges',
						success: function(resp) {
							if (!resp.success){
								noty({text: resp.errorMessage, layout: 'topCenter', type: 'error', timeout: 2000});
								return;
							}
							var data = resp.data;
							var html = '<ul>';
							$.each(data, function(index, item){
								html += '<li>' + item.name + '</li>';
							});
							html += '</ul>';
							$("#viewRoleModal .modal-body").html(html);
							$('#viewRoleModal').modal('show');
						},
						error: function() {
							alert('获取角色权限失败');
						}
					});
				 });
				
				$("#roleTable .edit").on('click', function(e){
					 var roleId = $(this).attr('rid');
					 $('#rid').val(roleId);
					 var $tr = $(this).parents('.captureTable');
					 var name = $tr.find('.name').text();
					 $('#createRoleModalLabel').text('编辑角色');
					 $('#name').val(name);
					 $('#base_role').val("");
					 
					 $('#privileges option').prop('selected', false);
					 dface.ajax({
						type: 'get',
						dataType: 'json', 
						url: d_url + '/role/'+roleId+'/privileges',
						success: function(resp) {
							if (!resp.success){
								noty({text: resp.errorMessage, layout: 'topCenter', type: 'error', timeout: 2000});
								return;
							}
							var data = resp.data;
							$.each(data, function(index, item){
								var $option = $('#privileges option[value='+ item.id +']');
								$option.prop('selected', true);
							});
						},
						error: function() {
							alert('获取角色权限失败');
						}
					});
					 
					 $('#createRoleModal').modal('show');
				 });
				
				$("#roleTable .del").on('click', function(e){
				 	var roleId = $(this).attr("rid");
				 	$("#deleteRoleModalLabel").attr('roleId', roleId);
					$("#deleteRoleModal").modal('show');
				 });
				
				 $('#role_delete').on('click', function(e){
					 var roleId = $("#deleteRoleModalLabel").attr('roleId');
					 $.ajax({
							type: 'DELETE',
							url: d_url + '/role/'+ roleId,
							dataType: 'json', 
							success: function(data) {
								if (!data.success) {
									noty({text: data.errorMessage, layout: 'topCenter', type: 'error', timeout: 2000});
									return;
								}else{
									noty({text: "删除成功", layout: 'topCenter', type: 'success', timeout: 2000});
									$("#deleteRoleModal").modal('hide');
									$('.captureTable[rid='+roleId+']').remove();
								} 
				        	},
				        	error: function(data) {
				        		noty({text: '删除失败', layout: 'topCenter', type: 'error', timeout: 2000});
				        	}
						});
				 });
		},	
		_initPagination:function(currentPage, totalCount) {
			var options = {
					alignment: 'center',
			        currentPage: currentPage,
			        totalPages: Math.ceil(totalCount / dface.constants.PAGINATION_ITEMS_PER_PAGE),
			        numberOfPages: dface.constants.PAGINATION_ITEMS_PER_PAGE,
			        onPageClicked: function (event, originalEvent, type, page) {
			        	Role.list._doRoleSearch(page);
			        }
				};
				
				$('#table_paginator').bootstrapPaginator(options);
				$("#table_paginator").show();
		},
		_doRoleSearch:function(pageNum){
				 var roleSearchName = $('#roleSearchName').val().trim();
				 var data = {'name': roleSearchName};
				 if(pageNum) {
					data.pageNum = pageNum - 1;
			}
			dface.ajax({
				type: 'get',
				url: d_url + '/role',
				data: data,
				success: function(resp) {
					$("#content").html(resp);
				},
				error: function() {
					alert('搜索角色页面失败');
				}
			});
		 }
	}
	window.Role=Role;
})()