var d_url=tunicorn.contextPath;
var searchCapture=searchCapture || {};
searchCapture=(function(){
	var sourceNameMapping = {};
	var flag = false;
	function init(){
		$("#video-source").keyup(function() {
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
		initDate();
		initDefaultSourceNameAutoComplete();
		initDefaultSourceName();
	};
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
		});
	};
	function showCaptureLargeImageModal(captureFilePath){
		$("#bigImage").attr("src", captureFilePath);
		$("#bigCaptureImageModal").modal('show');
	}
    function searchAsset(pageNum) {
    	var idCard = $("#idCard").val();
    	//var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
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
    	$("#picUploader").find("div").eq(0).hide();
		$(".preview img").attr('src', assetImage);
		$(".preview").show();
		$("#initSearchPicPath").val(assetImage);
    }
	function initDate() {
		var current = moment();
		$("#captureTime").val(current.format('YYYY-MM-DD'));
		$('.form_datetime1').datetimepicker({
		    language: 'zh-CN',
		    autoclose:true ,
		    minView:2,
		    endDate : new Date()
		})
		
	};
	return {
		_init:init,
		showCaptureLargeImageModal:showCaptureLargeImageModal,
		searchAsset:searchAsset,
		showAssetImage:showAssetImage
	}
})()
