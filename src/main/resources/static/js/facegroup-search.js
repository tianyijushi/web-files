var prefix_url=tunicorn.contextPath, captures_ALL = [], captures_page_size = 10, captures_current_page=1, captures_total_page=1, captures_len=0,
	_getTotalPage = function(){
		if(captures_len % captures_page_size == 0){
			return parseInt(captures_len / captures_page_size);
		}else{
			return parseInt(captures_len / captures_page_size) + 1;
		}
	}, _getTemplateData = function(page){
		captures_current_page = page;
		if(page < 1){
			page = 1;
		}else if(page > captures_total_page){
			page = captures_total_page;
		}
		var start = (page-1) * captures_page_size;
		var end = start + captures_page_size;
		if(end > captures_len){
			end = captures_len;
		}
		return captures_ALL.slice(start, end);
	},_renderTable = function(page){
		var template = $("#template-row").html();
		Mustache.parse(template);
		var template_data = {data : _getTemplateData(page)};
		var rendered = Mustache.render(template, template_data);

		$('#result-num').text('共'+captures_len+'条');
		$('#capture-table tbody').html(rendered);
	},initPagination = function(currentPage, totalCount) {
		var options = {
				alignment: 'center',
		        currentPage: currentPage,
		        totalPages: Math.ceil(totalCount / captures_page_size),
		        numberOfPages: captures_page_size,
		        onPageClicked: function (event, originalEvent, type, page) {
		        	_renderTable(parseInt(page));
		        }
			};
			$('#table_paginator').bootstrapPaginator(options);
			$("#table_paginator").show();
	},_initSearchEvents = function(){
		var initSearchPicPath = $("#initSearchPicPath").val();
		if(initSearchPicPath){
			$("#picUploader").find("div").eq(0).hide();
			$(".preview img").attr('src', initSearchPicPath);
			$(".preview").show();
		}
		//trigger picture upload dialog open
		$('#picUploader').on('click', function(e){
			$('#searchPic').click();
		});
		//picture changed
		$('#searchPic').on('change', function(e){
			if($(this).val()==''){
				return;
			}
			$('#picUploader .default').hide();
			url = window.URL.createObjectURL($('#searchPic')[0].files.item(0));
			$('.preview img').attr('src', url);
			$('#picUploader .preview').show();
		});
		//page button
		$('.pagefinder a').on('click', function(e){
			var page = $(this).attr('page');
			_renderTable(parseInt(page));
		});
		//loading
		function showMask(){
			 var top = ($(window).height() - $(".loading_1").height())/2;   
		     var left = ($("#content").offsetWidth - $(".loading_1").width())/2;   
		     var scrollTop = $(document).scrollTop();   
		     var scrollLeft = $(document).scrollLeft();   
			  $(".loading").css({"top":top + scrollTop,"left":left + scrollLeft,"display":"block"});
			  $(".mask").height(document.body.scrollHeight);
			  $(".mask").width(document.body.offsetlWidth);
			  $(".mask").fadeTo(200, 0.2);
		  
		}
		function hideMask(){
			$(".loading").css("display","none");
		    $(".mask").fadeOut(200);
		   
		} 
		
		//search button clicked
		$('#search').on('click', function(e){
			var score = $('#score').val().trim();
			var num = $('#num').val().trim();
			var facegroup = $('.facegroup');  
			var searchPic = $('#searchPic').val().trim();
			var initSearchPicRealPath = $("#initSearchPicRealPath").val();
			if(score==''){
				noty({text: "阈值不能为空!", layout: "topCenter", type: "warning", timeout: 2000});
				return;
			}
			var regex = /^1|0\.\d+$/;
			if(!regex.test(score)){
				noty({text: "阈值数值应在0-1之间!", layout: "topCenter", type: "warning", timeout: 2000});
				return false;
			}
			if(facegroup.val()==''){
				noty({text: "请选择一个底库!", layout: "topCenter", type: "warning", timeout: 2000});
				return;
			}
			if(searchPic=='' && !initSearchPicRealPath){
				noty({text: "请先上传图片!", layout: "topCenter", type: "warning", timeout: 2000});
				return;
			}
			var formData = new FormData();
			formData.append('score', score);
			formData.append('num', num);
			formData.append('groupIds', facegroup.val());
			formData.append('groupNames', facegroup.find('option:selected').text());
			var uploadFile = $('#searchPic')[0].files[0];
			if(uploadFile){
				formData.append('searchPic', $('#searchPic')[0].files[0]);	
			}else{
				if(initSearchPicRealPath){
					formData.append('searchPicRealPath', initSearchPicRealPath);
				}
			}
			showMask();
			tunicorn.utils.postFormData(prefix_url+'/search/group', formData, function(err, result){
				hideMask();
				if(err){
					noty({text: "服务器异常!", layout: "topCenter", type: "error", timeout: 2000});
					return;
				}
				if(result.success){
					captures_ALL = result.data;
					captures_len = captures_ALL.length;
					captures_total_page = _getTotalPage();
					_renderTable(1);
					if(captures_len == 0){
						$("#table-show").hide();
						$("#table_paginator").hide();
						noty({text: "当前搜索没有查询到结果!", layout: "topCenter", type: "warning", timeout: 2000});
						return;
					}else{
						$(".noCaptureMsg").hide();
						$("#table-show").show();
						initPagination(1, captures_len);
					}
				}else{
					noty({text: result.errorMessage, layout: "topCenter", type: "error", timeout: 2000});
					return;
				}
			});
		});
	};
