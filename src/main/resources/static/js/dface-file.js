var Click=new Array();
    function shift_select(){
    	console.info("111");  
		$('ul.imglist li').click(function (e){
			Click.push($("ul.imglist li").index($(this)))
			if(e.shiftKey){
			    var iMin = Math.min(Click[Click.length-2],Click[Click.length-1])
				var iMax = Math.max(Click[Click.length-2],Click[Click.length-1])
				for(i=iMin;i<=iMax;i++){
					if($("ul.imglist li:eq("+i+")").attr('choosed')==0){
						$("ul.imglist li:eq("+i+")").addClass("red")  //
						$($("ul.imglist li:eq("+i+")").find("input").get(0)).remove();
						if($("ul.imglist li:eq("+i+")").attr("class").indexOf("red")>=0){
				    		delPath = $($("ul.imglist li:eq("+i+")").find("span").get(0)).html();
		        			dl = '<input type="hidden" name="delefile" value="'+delPath+'"/>';
		        			$("ul.imglist li:eq("+i+")").append(dl);
				    	}else{
				    		$($("ul.imglist li:eq("+i+")").find("input").get(0)).remove();
				    	}
					}
				}
			}else{
				if($(this).attr('choosed')==0){
			    	$(this).toggleClass("red");
			    	if($(this).attr("class").indexOf("red")>=0){
			    		delPath = $($(this).find("span").get(0)).html();
	        			dl = '<input type="hidden" name="delefile" value="'+delPath+'"/>';
	        			$(this).append(dl);
			    	}else{
			    		$($(this).find("input").get(0)).remove();
			    	}
				}
			}
		});
	}
document.onselectstrat=function(event){   א
	  event = window.event||event;
	  event.returnValue = false;
	}
$(function(){
	console.log(222);
		shift_select();
//	    $('ul.imglist li').click(function(){
//	    	if($(this).attr('choosed')==0){//判断是否可选
//	    		$(this).toggleClass('red'); //选中变色,下面是变色过的业务
//	        	if($(this).attr("class").indexOf("red")>=0){
//	        		delPath = $($(this).find("span").get(0)).html();
//	        		dl = '<input type="hidden" name="delefile" value="'+delPath+'"/>';
//	        		$(this).append(dl);
//	        		//alert($("input[name='delefile']").val());
//	        	}else{
//	        		$($(this).find("input").get(0)).remove();
//	        		//alert($("input[name='delefile']").val());
//	        	}
//			}
//    });
    
    $("#deleteButton").click(function(){
    	var paths = new Array();
    	$("input[name='delefile']").each(function(i, el) {
    		var pathJson={};
    		pathJson.path = $(this).val();
		    paths[i] =pathJson
		  });
		if(paths.length<1){
			noty({text: "请选择图片！", layout: "topCenter", type: "error", timeout: 2000});
			return;
		}
    	var formData = new FormData();
		formData.requestId = new Date().getTime();
		formData.paths = paths;
		tunicorn.utils.post("/files/files/moveFiles", formData, function(err, result){
        	if(err){
				noty({text: "服务器异常!", layout: "topCenter", type: "error", timeout: 2000});
				return;
			}
			if(result.success){
				var list_folders = result.data;
				noty({text: "移动成功！", layout: "topCenter", type: "warning", timeout: 2000});
				getFiles($("#parentPath").val());
			}else{
				noty({text: result.errorMessage, layout: "topCenter", type: "error", timeout: 2000});
				return;
			}
        });
    });
    //取消选择
    $("#cancelButton").click(function(){
    	$('ul.imglist').find("li").each(function(){
    		$($(this).find("input").get(0)).remove();
    		if($(this).attr("class").indexOf("red")>=0){
    			$(this).toggleClass('red'); //选中变色,下面是变色过的业务
    		}
    	});
    });
    
//    $("refuse").bind("contextmenu", function(){
//            return false;
//        })
    $("refuse").mousedown(function(e) {
    	$("table td").unbind(event,mousedown);
        //右键为3
        if (3 == e.which) {
        	alert('ok');
        } else if (1 == e.which) {
           
        }
    });
});