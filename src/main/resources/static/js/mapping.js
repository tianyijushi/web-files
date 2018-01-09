$(function(){	
	var prefix_url=tunicorn.contextPath, base_url = prefix_url+'/deploy/mapping/';
	$('.add_more').click(function(){
		var index = $(this).parents('form').attr('index');
		if($('.server_id').eq(index).val()==''){
			noty({text: "先选择一个服务器!", layout: "topCenter", type: "warning", timeout: 2000});
			return;
		}
		$.get(base_url+'modal?type=source', function(html){
			$('#camera_select .modal-body').html(html);
			$('#camera_list').attr('index', index);
			$('#camera_select').modal('show');		
		});
	});
	function cameraHoverEvent(){
		$(this).parent().find('img.delete').css('display','block');
	};
	function cameraBlurEvent(){
		$(this).parent().find('img.delete').css('display','none');
	};
	
	function deleteEvent(){
		var index = $(this).parents('form').attr('index');
		$('#delete_camera_id').attr('index', index);
		var camera_index = $(this).attr('index');
		$('#delete_camera_id').attr('camera_index', camera_index);
		$('#delete_camera').modal('show');
	}
	$('.cameras img.delete').on('click',deleteEvent);
	
	$('.cameras img.camera, .cameras img.delete').hover(cameraHoverEvent, cameraBlurEvent);
	

	
	//add
	$('#camera_select_confrim').click(function(){
		var sid  = $('#camera_list').val();
		var text = $('#camera_list').find("option:selected").text();
		if(sid==''){
			noty({text: "必须选择一个视频源!", layout: "topCenter", type: "warning", timeout: 2000});
			return;
		}
		var type = $('#camera_list').find("option:selected").attr('type');
		if (type=='offline'){
			var icon = 'harddisk.png';
		}else{
			var icon = 'camera.png';
		}
		var index = parseInt($('#camera_list').attr('index'));
		var current_form = $('.mapping_form').eq(index);
		var size=current_form.find('.cameras').find('div').size();
		if(size>1){
			var camera_index1=current_form.find('.cameras').children('div:nth-last-child(2)').children('.camera').attr('index');
			var camera_index = parseInt(camera_index1) + 1;
		}else{
			var camera_index=0;
		}
		
		$(".mapping_form").append('<input style="display:none;"  class="camera_id" name="cameraIds" type="hidden"  value="'+sid+'"/>')
		var form = new FormData(current_form[0]);		
		$.ajax({
			url:base_url,
			type:"POST",
			data:form,
			processData:false,
			contentType:false,
			success:function(data){
				if(data && data.success){
	            	noty({text: "保存成功！", layout: "topCenter", type: "success", timeout: 2000});	
	    			var html = '<div>'+
				    			'<img index="'+camera_index+'" src="'+prefix_url+'/image/'+icon+'" title="'+text+'" class="camera">'+
				    			'<img src="/dfacec/image/remove.png" index="'+camera_index+'" class="delete" style="display: none;"><br>'+
				    			'<span class="camera_name" title="'+text+'">'+text+'</span><br>'+
				    			'</div>';
	    			setTimeout(function(){
	            		$('#content').load('/dfacec/deploy/mapping');
	            	},500);
				    current_form.find('.add_more').before(html); 
				    current_form.find('.cameras').find('div').eq(camera_index).find('img.camera,img.delete').hover(cameraHoverEvent, cameraBlurEvent);
				    current_form.find('.cameras').find('div').eq(camera_index).find('img.delete').on('click',deleteEvent)
				}else{
	               noty({text: data.errorMessage, layout: "topCenter", type: "error", timeout: 2000});
	            }
				$('#camera_select').modal('hide');	
			},
			error:function(){
				noty({text: "服务器异常!", layout: "topCenter", type: "warning", timeout: 2000});
				return false;
			}
			
		})		
	})
	
	$('#delete_camera').on('hidden.bs.modal', function(e){
		$('#content').load('/dfacec/deploy/mapping');
	});
	
	
	//delete
	$('#delete_camera_confrim').click(function(){
		var index = parseInt($('#delete_camera_id').attr('index'));
		var camera_index = parseInt($('#delete_camera_id').attr('camera_index'));
		var current_form = $('.mapping_form').eq(index);
		var camera_id = current_form.find('.cameras').find('div').eq(camera_index).children('.camera_id');
		camera_id.val('');
		var form = new FormData(current_form[0]);	
		$.ajax({
			url:base_url,
			type:"POST",
			data:form,
			processData:false,
			contentType:false,
			success:function(data){
				if(data && data.success){
	            	noty({text: "删除成功！", layout: "topCenter", type: "success", timeout: 2000});	
	            	
	            	/*setTimeout(function(){
	            		$('#content').load('/dfacec/deploy/mapping');
	            	},500);  */
				}else{
	               noty({text: data.errorMessage, layout: "topCenter", type: "error", timeout: 2000});
	            }
				$('#delete_camera').modal('hide');	
			},
			error:function(){
				noty({text: "服务器异常!", layout: "topCenter", type: "warning", timeout: 2000});
				return false;
			}			
		})			
	})
	
	//edit server
	$('.serverWord .edit').on('click', function(e){
		var index = $(this).parents('form').attr('index');
		tunicorn.utils.get(base_url+'/modal?type=server', function(html){
			$('#server_select .modal-body').html(html);
			$('#server_list').attr('index', index);
			$('#server_select').modal('show');
		});
	});
	
	$('#server_select_confrim').click(function(){
		var sid = $('#server_list').val();
		var selected = $('#server_list').find("option:selected");
		var text = selected.text();
		var ip = selected.attr('ip');
		if(sid==''){
			noty({text: "必须选择一个服务器!", layout: "topCenter", type: "warning", timeout: 2000});
			return;
		}
		
		var index = parseInt($('#server_list').attr('index'));
		$('.mapping_form').eq(index).children('.server_id').val(sid);
		var server =  $('.mapping_form').eq(index).children('.serverWord');
		server.find('.server_name').text(text+'('+ip+')');
		$('#server_select').modal('hide');
	})
	
	
})
