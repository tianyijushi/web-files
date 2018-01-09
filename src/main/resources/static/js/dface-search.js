var d_url = tunicorn.contextPath;
var d_search = d_search || {};
d_search = (function(){
	var sourceNameMapping = {};
	var flag = false;
	
	var captures_ALL = [];
	var captures_len = 0;
	var captures_total_page = 1;
	var captures_page_size = 18;
	
	function initPagination(currentPage, totalCount, resultType) {
		var options = {
			alignment: 'center',
	        currentPage: currentPage,
	        totalPages: Math.ceil(totalCount / captures_page_size),
	        numberOfPages: captures_page_size,
	        onPageClicked: function (event, originalEvent, type, page) {
	        	_renderTable(parseInt(page), resultType);
	        }
		};
		$('#table_paginator').bootstrapPaginator(options);
		$("#table_paginator").show();
	}
	
	function initCommon(){
		$("#video-source").on('keyup', function(e) {
			if(!flag) {
				$("#video-source").removeData('source_id');
			} else {
				flag = false;
			}
			
			var currentName = $.trim($('#video-source').val());
			if(_.has(sourceNameMapping, currentName)) {
				$("#video-source").data('source_id', sourceNameMapping[currentName]);
			}
		});
	    $('#modal-source-select').selectpicker({
		    width: '65%'
		});
		initDate();
		initDefaultSourceName();
		initDefaultSourceNameAutoComplete();
	};
	function card_pic_s_common(){
		// adapt to large screen
		var height = $(document).height()-307;
		$('.over1').css('min-height',height + "px");
	};
	
	function searched(){
		doSearch();
		var initSearchPicPath = $("#initSearchPicPath").val();
		if(initSearchPicPath){
			$('#preview').attr('src', url);
			$('#preview').show();
		}
		$("#areaSearchUp").click(function(){
			$("#picUpload").click();
		});
		$("#searchButo").click(function(){
			searchButo();
		})
		$('#picUpload').on('change', function(e){
			if($(this).val()==''){
				return;
			}
			url = window.URL.createObjectURL($('#picUpload')[0].files.item(0));
			$('#preview').attr('src', url);
			$('#preview').show();
			$("#initSearchPicPath").val("");
			searchButo();
		});
		
	}
	
	function searchButo(pageNum){
		if(pageNum) {
			data.pageNum = pageNum - 1;
		}
		var initSearchPicPath = $("#initSearchPicPath").val();
		var score = $('#score').val().trim();
		var num = $('#num').val().trim();
		var fromTime = $("#fromDate").val().trim();
		var toTime = $("#toDate").val().trim();
		var sourceId = $('#initSourceId').val().trim();
		var formData = new FormData();
		if (sourceId){
			formData.append('sourceId', sourceId);
		}
		if (fromTime){
			formData.append('fromTime', fromTime);
		}
		if (toTime){
			formData.append('toTime', toTime);
		}
		formData.append('score', score);
		formData.append('num', num);
		var uploadFile = $('#picUpload')[0].files[0];
		if(initSearchPicPath){
			formData.append('searchPicPath', initSearchPicPath);
		}else{
			if(uploadFile){
				formData.append('searchPic', $('#picUpload')[0].files[0]);
			}
		}
		showMask();			 
		tunicorn.utils.postFormData(d_url+'/search/capture', formData, function(err, result){
			hideMask(); 
			if(err){
				noty({text: "服务器异常!", layout: "topCenter", type: "error", timeout: 2000});
				return;
			}
			if(result.success){
				captures_ALL = result.data;
				captures_len = captures_ALL.length;
				captures_total_page = _getTotalPage(captures_len, captures_page_size);
				_renderTable(1);
				var html='';
				if(captures_len == 0){
					$("#table-show").hide();
					$("#table_paginator").hide();
					noty({text: "当前搜索没有查询到结果!", layout: "topCenter", type: "warning", timeout: 2000});
					return;
				}else{
					$(".noCaptureMsg").hide();
					$("#table-show").show();
					if(captures_len != 0){
						initPagination(1, captures_len);
					}
				}
			}else{
				noty({text: result.errorMessage, layout: "topCenter", type: "error", timeout: 2000});
				return;
			}
		});
	}
	
	//cardno.ftl
	function cardInit(){
		$('.pagefinder a').on('click', function(e){
			var page = $(this).attr('page');
			_renderTable(parseInt(page));
		});
		$("#searchButo").click(function(){
			showAssetImage();
		});
	}
	
	function picInit(){
		$("#picSearchUp").click(function(){
			$("#picUpload").click();
		});
		$("#searchButo").click(function(){
			picSearchButo();
		});
		$('#picUpload').on('change', function(e){
			if($(this).val()==''){
				return;
			}
			url = window.URL.createObjectURL($('#picUpload')[0].files.item(0));
			$('#preview').attr('src', url);
			$('#preview').show();			
			picSearchButo();

		});
	}
	
	function picSearchButo(){
		var score = $('#score').val().trim();
		var num = $('#num').val().trim();
		var searchPic = $('#picUpload').val().trim();
		var fromTime = $("#fromDate").val().trim();
		var toTime = $("#toDate").val().trim();
		var sourceIds = $("#modal-source-select").val();
		var resultType = $("#resultType").val();
		if(score==''){
			noty({text: "阈值不能为空!", layout: "topCenter", type: "warning", timeout: 2000});
			return;
		}
		var regex = /^1|0\.\d+$/;
		if(!regex.test(score)){
			noty({text: "阈值数值应在0-1之间!", layout: "topCenter", type: "warning", timeout: 2000});
			return false;
		}
		if(searchPic==''){
			noty({text: "请先上传图片!", layout: "topCenter", type: "warning", timeout: 2000});
			return;
		}
		var formData = new FormData();
		if (sourceIds){
			formData.append('sourceIds', sourceIds);
		}
		if (fromTime){
			formData.append('fromTime', fromTime);
		}
		if (toTime){
			formData.append('toTime', toTime);
		}
		formData.append('score', score);
		formData.append('num', num);
		formData.append('resultType', resultType);
		var uploadFile = $('#picUpload')[0].files[0];	
		if(uploadFile){
			formData.append('searchPic', $('#picUpload')[0].files[0]);
		}
		var dropImage1 = $("#dropImage1");
		var dropImage2 = $("#dropImage2");
		if(dropImage1 && $(dropImage1).attr("src")){
			formData.append('dropImgs', dropImage1.attr("src"));
		}
		if(dropImage2 && $(dropImage2).attr("src")){
			formData.append('dropImgs', dropImage2.attr("src"));
		}
		showMask();
		tunicorn.utils.postFormData(d_url + '/search/capture', formData, function(err, result){
			hideMask();
			if(err){
				noty({text: "服务器异常!", layout: "topCenter", type: "error", timeout: 2000});
				return;
			}
			if(result.success){
				captures_ALL = result.data;
				captures_len = captures_ALL.length;
				captures_total_page = _getTotalPage();
				var percentScore = Math.round(score * 10000) / 100;
				_renderTable(1, 'picture');
				if(captures_len == 0){
					$("#table-show").hide();
					$("#table_paginator").hide();
					noty({text: "当前搜索没有查询到结果!", layout: "topCenter", type: "warning", timeout: 2000});
					return;
				}else{
					$(".noCaptureMsg").hide();
					$("#table-show").show();
					if(captures_len != 0){
						initPagination(1, captures_len, 'picture');
					}
				}
			}else{
				noty({text: result.errorMessage, layout: "topCenter", type: "error", timeout: 2000});
				return;
			}
		});
	}
	
	function _getTotalPage(){
		if(captures_len % captures_page_size == 0){
			return parseInt(captures_len / captures_page_size);
		}else{
			return parseInt(captures_len / captures_page_size) + 1;
		}
	};
	
	//searched.ftl doSearch
	function doSearch(){
		var score = $('#score').val().trim();
		var num = $('#num').val().trim();
		var initSearchPicPath = $("#initSearchPicPath").val();
		var fromTime = $("#fromDate").val().trim();
		var toTime = $("#toDate").val().trim();
		var sourceId = $('#initSourceId').val().trim();
		var initSourceName = $("#initSourceName").val();
		var formData = new FormData();
		var formData = new FormData();
		if (sourceId){
			formData.append('sourceId', sourceId);
		}
		if (initSourceName){
			formData.append('sourceName', initSourceName);
		}
		if (fromTime){
			formData.append('fromTime', fromTime);
		}
		if (toTime){
			formData.append('toTime', toTime);
		}
		formData.append('score', score);
		formData.append('num', num);
		var uploadFile = $('#picUpload')[0].files[0];
		if(initSearchPicPath){
			formData.append('searchPicPath', initSearchPicPath);
		}else{
			if(uploadFile){
				formData.append('searchPic', $('#picUpload')[0].files[0]);
			}
		}
		$('#trailMap').empty();
		showMask();
		tunicorn.utils.postFormData(d_url+'/search/capture', formData, function(err, result){
			hideMask();
			if(err){
				noty({text: "服务器异常!", layout: "topCenter", type: "error", timeout: 2000});
				return;
			}
			if(result.success){
				captures_ALL = result.data;
				captures_len = captures_ALL.length;
				captures_total_page = _getTotalPage(captures_len, captures_page_size);
				_renderTable(1);
				var html='';
				$("#captureCount").html(captures_len);
				var percentScore = Math.round(score * 10000) / 100;
				if(captures_len == 0){
					noty({text: "当前搜索没有查询到结果!", layout: "topCenter", type: "warning", timeout: 2000});
					return;
				}
			}else{
				noty({text: result.errorMessage, layout: "topCenter", type: "error", timeout: 2000});
				return;
			}
		});
	};
	function _renderTable(page, type){
		var template = $("#template-row").html();
		Mustache.parse(template);
		var template_data = {data : _getTemplateData(page)};
		var rendered = Mustache.render(template, template_data);

		$('#captureList').html(rendered);
		$(".timeago").timeago();
		$('.showLargePic').on('click', function(e){
			var captureFilePath = $(this).attr('capturefilepath');
			$("#bigImage").attr("src", captureFilePath);
			$("#bigCaptureImageModal").modal('show');
		});
		if(type == 'card'){
			dropCardNoImg();
		}else if(type == 'picture'){
			dropImg();
		}
	};
	function _getTemplateData(page){
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
		var pageCapture = captures_ALL.slice(start, end);
		for(var i = 0;i < pageCapture.length;i++){
			var percentScore = Math.round(pageCapture[i].score * 10000) / 100;
			pageCapture[i].newScore = percentScore;
		}
		return pageCapture;
	};
	function initSearched(num){
		$('#num').val(num);
	};	
	//time show
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
	//loading status icorn
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
	//autocomplete
	function initDefaultSourceName(){
		$.ajax({
			url: d_url + "/source/search",
			type: "POST",  
			contentType: 'application/x-www-form-urlencoded',
			data: {'type': 'name', 'value': ''},
			dataType: 'json',
		    success:function(data) {
		    	var result = data.data;
		    	$.each(result, function(index, item) {
		    		sourceNameMapping[item.name] = item.id;
		    	});
		    }
		});
	};
	
	function initDefaultSourceNameAutoComplete() {
		$("#video-source").autocomplete({
			minLength: 0,			 
			source: function(request,response) {
				var value = $.trim($('#video-source').val());
				$.ajax({
					url: d_url + "/source/search",
					type: "POST",  
					contentType: 'application/x-www-form-urlencoded',
					data: {'type': 'name', 'value': value},
					dataType: 'json',
				    success:function(data) {
				    	var result = data.data;
				    	var items = [];
				    	$.each(result, function(index, item) {
				    		items.push({
				    			label: item.name,
			                    id: item.id, 
				    		});
				    	});
				    	response(items);
				    }
				});
			},
			select: function(event, ui) {
				$("#video-source").val(ui.item.label);
				$("#video-source").data('source_id', ui.item.id);
				
				if(event.which==13){
					flag = true;
				}else{
					flag =false;
				}
				// 必须阻止事件的默认行为，否则autocomplete默认会把ui.item.value设为输入框的value值
		        event.preventDefault();
			}
		}).focus(function () {
            $(this).autocomplete("search")});
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
	 function searchAsset(pageNum) {
	    	var idCard = $("#idCard").val();
	    	if(!idCard){
	    		noty({text: '证件号不能为空!', layout: 'topCenter', type: 'warning', timeout: 2000});
	    		return;
	    	}
	    	$.ajax({
				 type: 'GET',
				 url: d_url + '/search/asset?idCard='+idCard,
				 success: function(data) {
					 	if (data.success) {
					 		var assets = data.data;
					 		if(assets && assets.length == 0){
					 			noty({text: '搜索无结果!', layout: 'topCenter', type: 'warning', timeout: 2000});
					    		return;
					 		}
					 		$("#row_asset").empty();
					 		for (var index = 0; index < assets.length; index++) {
					 			var asset = assets[index];
					 			$("#row_asset").append(
					 			'<div class="col-sm-3" id="face_asset_'+ asset.id +  '">' +
								'<div class="thumbnail" style="">' + 
								'<div class="pull-right radio">' +
								'<input type="radio" name="assetRadio" value="'+asset.realFilePath+'">'+
								'</div>' + 
								'<img style="width: 130px;height: 130px" src="' + asset.realFilePath + '" alt="">' +
								'</div>' + 										   
								'</div>'										  
					 			);
					 		}
					 		$("#showAsset").modal({
							  backdrop: false
							});
					 	}else{
					 		noty({text: data.errorMessage, layout: "topCenter", type: "error", timeout: 2000});
					 	}
	        	},
	        	error: function(data) {
	        		//返回500错误页面
	        		$("html").html(data.responseText);
	        	}
			});
	    };
	    function showAssetImage(){
	    	var assetImage = $('input:radio[name="assetRadio"]:checked').val();
	    	if(!assetImage){
	    		noty({text: '请选择一张图片', layout: 'topCenter', type: 'warning', timeout: 2000});
	    		return;
	    	}
	    	$('#showAsset').modal('hide');
	    	$("#uploadImge").css("display","block");
			$("#uploadImge").attr('src', assetImage);
			$("#initSearchPicPath").val(assetImage);
			var score = $('#score').val().trim();
			var num = $('#num').val().trim();
			var initSearchPicPath = $("#initSearchPicPath").val();
			var fromTime = $("#fromDate").val().trim();
			var toTime = $("#toDate").val().trim();
			var sourceIds = $("#modal-source-select").val();
			var resultType = $("#resultType").val();
			if(score==''){
				noty({text: "阈值不能为空!", layout: "topCenter", type: "warning", timeout: 2000});
				return;
			}
			var regex = /^1|0\.\d+$/;
			if(!regex.test(score)){
				noty({text: "阈值数值应在0-1之间!", layout: "topCenter", type: "warning", timeout: 2000});
				return false;
			}
			if(!initSearchPicPath){
				noty({text: "请先上传图片!", layout: "topCenter", type: "warning", timeout: 2000});
				return;
			}
			var formData = new FormData();
			if (sourceIds){
				formData.append('sourceIds', sourceIds);
			}
			if (fromTime){
				formData.append('fromTime', fromTime);
			}
			if (toTime){
				formData.append('toTime', toTime);
			}
			formData.append('score', score);
			formData.append('num', num);
			formData.append('resultType', resultType);
			if(initSearchPicPath){
				formData.append('searchPicPath', initSearchPicPath);
			}
			var dropImage1 = $("#dropImage1");
			var dropImage2 = $("#dropImage2");
			if(dropImage1 && $(dropImage1).attr("src")){
				formData.append('dropImgs', dropImage1.attr("src"));
			}
			if(dropImage2 && $(dropImage2).attr("src")){
				formData.append('dropImgs', dropImage2.attr("src"));
			}
			showMask();
			tunicorn.utils.postFormData(d_url + '/search/capture', formData, function(err, result){
				hideMask();
				if(err){
					noty({text: "服务器异常!", layout: "topCenter", type: "error", timeout: 2000});
					return;
				}
				if(result.success){
					captures_ALL = result.data;
					captures_len = captures_ALL.length;
					captures_total_page = _getTotalPage();
					var percentScore = Math.round(score * 10000) / 100;
					_renderTable(1, 'card');
					if(captures_len == 0){
						$("#table-show").hide();
						$("#table_paginator").hide();
						noty({text: "当前搜索没有查询到结果!", layout: "topCenter", type: "warning", timeout: 2000});
						return;
					}else{
						$(".noCaptureMsg").hide();
						$("#table-show").show();
						if(captures_len != 0){
							initPagination(1, captures_len, 'card');
						}
					}
				}else{
					noty({text: result.errorMessage, layout: "topCenter", type: "error", timeout: 2000});
					return;
				}
			});
	    };
	    
	    function dropImg(){
	    	var dropImg1 = $(".dropImg1")[0], dropImg2 = $(".dropImg2")[0], eleDrags = $(".showLargePic"), lDrags = eleDrags.length, eleDrag = null;
	    	for (var i = 0; i<lDrags; i++) {
	    		eleDrags[i].onselectstart = function() {
	    			return false;
	    		};
	    	  }
	    	for (var i = 0; i < lDrags; i++) {
	    		eleDrags[i].onselectstart = function() {
	    			return false;
	    		};
	    		eleDrags[i].ondragstart = function(ev) {
	    		    ev.dataTransfer.dropEffect = "copy";
	    			ev.dataTransfer.effectAllowed = "copy";
	    			ev.dataTransfer.setData("text", ev.target.innerHTML);
	    			eleDrag = ev.target;
	    			return true;
	    		};
	    		eleDrags[i].ondragend = function(ev) {
	    			ev.dataTransfer.clearData("text");
	    			eleDrag = null;
	    			ev.preventDefault();
	    			ev.stopPropagation();
	    			return false
	    		};
	    	}
	    	dropImg1.ondragover = function(ev) {
	    		ev.preventDefault();
	    		return true;
	    	};

	    	dropImg1.ondragenter = function(ev) {
	    		this.style.color = "#fff";
	    		ev.preventDefault();
	    		return true;
	    	};
	    	dropImg1.ondrop = function(ev) {
	    		if (eleDrag) {
	    			$(dropImg1).html("<img id='dropImage1' style='width:100%;height:100%;' src="+$(eleDrag).attr("src")+">");
	    		}
	    		this.style.color = "#000";
	    		ev.preventDefault();
	    		ev.stopPropagation();
	    		return false;
	    	};
	    	dropImg1.ondragleave = function(ev) {
	    	    this.style.color = "#ddd";
	    		return false;
	    	};
	    	dropImg2.ondragover = function(ev) {
	    		ev.preventDefault();
	    		return true;
	    	};

	    	dropImg2.ondragenter = function(ev) {
	    		this.style.color = "#fff";
	    		ev.preventDefault();
	    		return true;
	    	};
	    	dropImg2.ondrop = function(ev) {
	    		if (eleDrag) {
	    			$(dropImg2).html("<img id='dropImage2' style='width:100%;height:100%;' src="+$(eleDrag).attr("src")+">");
	    		}
	    		this.style.color = "#000";
	    		ev.preventDefault();
	    		ev.stopPropagation();
	    		return false;
	    	};
	    	dropImg2.ondragleave = function(ev) {
	    	    this.style.color = "#ddd";
	    		return false;
	    	};
	    };
	    function dropCardNoImg(){
	    	var dropImg1 = $(".dropImg1")[0], dropImg2 = $(".dropImg2")[0], eleDrags = $(".showLargePic"), lDrags = eleDrags.length, eleDrag = null;
	    	for (var i = 0; i<lDrags; i++) {
	    		eleDrags[i].onselectstart = function() {
	    			return false;
	    		};
	    	  }
	    	for (var i = 0; i < lDrags; i++) {
	    		eleDrags[i].onselectstart = function() {
	    			return false;
	    		};
	    		eleDrags[i].ondragstart = function(ev) {
	    		    ev.dataTransfer.dropEffect = "copy";
	    			ev.dataTransfer.effectAllowed = "copy";
	    			ev.dataTransfer.setData("text", ev.target.innerHTML);
	    			eleDrag = ev.target;
	    			return true;
	    		};
	    		eleDrags[i].ondragend = function(ev) {
	    			ev.dataTransfer.clearData("text");
	    			eleDrag = null;
	    			ev.preventDefault();
	    			ev.stopPropagation();
	    			return false
	    		};
	    	}
	    	dropImg1.ondragover = function(ev) {
	    		ev.preventDefault();
	    		return true;
	    	};

	    	dropImg1.ondragenter = function(ev) {
	    		this.style.color = "#fff";
	    		ev.preventDefault();
	    		return true;
	    	};
	    	dropImg1.ondrop = function(ev) {
	    		if (eleDrag) {
	    			$(dropImg1).html("<img id='dropImage1' style='width:100%;height:100%;' src="+$(eleDrag).attr("src")+">");
	    		}
	    		this.style.color = "#000";
	    		ev.preventDefault();
	    		ev.stopPropagation();
	    		return false;
	    	};
	    	dropImg1.ondragleave = function(ev) {
	    	    this.style.color = "#ddd";
	    		return false;
	    	};
	    	dropImg2.ondragover = function(ev) {
	    		ev.preventDefault();
	    		return true;
	    	};

	    	dropImg2.ondragenter = function(ev) {
	    		this.style.color = "#fff";
	    		ev.preventDefault();
	    		return true;
	    	};
	    	dropImg2.ondrop = function(ev) {
	    		if (eleDrag) {
	    			$(dropImg2).html("<img id='dropImage2' style='width:100%;height:100%;' src="+$(eleDrag).attr("src")+">");
	    		}
	    		this.style.color = "#000";
	    		ev.preventDefault();
	    		ev.stopPropagation();
	    		return false;
	    	};
	    	dropImg2.ondragleave = function(ev) {
	    	    this.style.color = "#ddd";
	    		return false;
	    	};
	};
	return {
		_initCommon :initCommon,
		_initSearched:initSearched,
		_card_pic_s_common:card_pic_s_common,
		searched:searched,
		searchAsset:searchAsset,
		showAssetImage:showAssetImage,
		cardInit:cardInit,
		picInit:picInit
	}
})()