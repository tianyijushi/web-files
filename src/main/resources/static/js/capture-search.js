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

		if(captures_current_page>1){
			$('.perpage').attr('page', captures_current_page-1);
			$('.perpage').css('display', 'inline-block');
		}else{
			$('.perpage').hide();
		}
		if(captures_current_page<captures_total_page){
			$('.nextpage').attr('page', captures_current_page+1);
			$('.nextpage').css('display', 'inline-block');;
		}else{
			$('.nextpage').hide();
		}
		$('.pagenum').text(captures_current_page +'/'+captures_total_page);
		$('#result-num').text('共'+captures_len+'条');
		$('#capture-table tbody').html(rendered);
	},_initSearchEvents = function(){
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
			$("#initSearchPicPath").val("");
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
			var initSearchPicPath = $("#initSearchPicPath").val();
			var searchPic = $('#searchPic').val().trim();
			var captureTime = $("#captureTime").val().trim();
			var sourceId = $('#video-source').data('source_id');
			var sourceName = $("#video-source").val().trim();
			if(!sourceId && sourceName){
				noty({text: "请输入有效视频源!", layout: "topCenter", type: "warning", timeout: 2000});
				return;
			}
			if(score==''){
				noty({text: "阈值不能为空!", layout: "topCenter", type: "warning", timeout: 2000});
				return;
			}
			var regex = /^1|0\.\d+$/;
			if(!regex.test(score)){
				noty({text: "阈值数值应在0-1之间!", layout: "topCenter", type: "warning", timeout: 2000});
				return false;
			}
			if(searchPic=='' && !initSearchPicPath){
				noty({text: "请先上传图片!", layout: "topCenter", type: "warning", timeout: 2000});
				return;
			}
			var formData = new FormData();
			if (sourceId){
				formData.append('sourceId', sourceId);
			}
			if (captureTime){
				formData.append('captureTime', captureTime);
			}
			formData.append('score', score);
			formData.append('num', num);
			var uploadFile = $('#searchPic')[0].files[0];
			if(initSearchPicPath){
				formData.append('searchPicPath', initSearchPicPath);
			}else{
				if(uploadFile){
					formData.append('searchPic', $('#searchPic')[0].files[0]);
				}
			}
			showMask();
			tunicorn.utils.postFormData(prefix_url+'/search/capture', formData, function(err, result){
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
						noty({text: "当前搜索没有查询到结果!", layout: "topCenter", type: "warning", timeout: 2000});
						return;
					}
				}else{
					noty({text: result.errorMessage, layout: "topCenter", type: "error", timeout: 2000});
					return;
				}
			});
		});
	};
