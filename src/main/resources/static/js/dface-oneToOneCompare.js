var d_url = tunicorn.contextPath;
var oneToOneCompare = oneToOneCompare || {};
oneToOneCompare = (function(){
	
    var canvas1 = document.getElementById('preview1');
    var context1 = canvas1.getContext('2d');
    var canvas2 = document.getElementById('preview2');
    var context2 = canvas2.getContext('2d');
    var canvas = null;
    var context = null;
    
    function init(){
    	var compareUrl = d_url + '/monitor/oneToOneCompare';
    	var formData;
    	
    	$('#picSearchUp1').click(function(){
    		canvas = canvas1;
            context = context1;
    		$('#picUpload1').click();
    	});
    	
    	$('#picSearchUp2').click(function(){
    		canvas = canvas2;
            context = context2;
    		$('#picUpload2').click();
    	});

    	$('#picUpload1').change(function(){
    		$("#compare-score").html("");
    		formData = new FormData();
    		var _file = $(this)[0];
    		var files = _file.files;

      		var file = files[0];
      		formData.append('image1', file);
    		
    		show_file_image($(this));
			
			if($('#picUpload2')[0].files.length > 0){
		         if ($('#picUpload2')[0].files[0].size > 5*1024*1024){
		        	 noty({text: "比对图片大于5M", layout: "topCenter", type: "warning", timeout: 1000});
		             return false;
		         }else{
		        	 formData.append('image2', $('#picUpload2')[0].files[0]); 
		         }
				doCompare();
			}
    		
    	});
    	
    	$('#picUpload2').change(function(){
    		$("#compare-score").html("");
    		formData = new FormData();
    		var _file = $(this)[0];
    		var files = _file.files;
  
      		var file = files[0];
      		formData.append('image2', file);
    	
    		show_file_image($(this));
			if($('#picUpload1')[0].files.length > 0){
		         if ($('#picUpload1')[0].files[0].size > 5*1024*1024){
		        	 noty({text: "比对图片大于5M", layout: "topCenter", type: "warning", timeout: 1000});
		             return false;
		         }else{
		        	 formData.append('image1', $('#picUpload1')[0].files[0]); 
		         }
				doCompare();
			}
    		
    	});
    	
    	function doCompare(){
    		showMask();
    		$.ajax({
		        type: "POST",
		        url: compareUrl,
				data : formData, 
				processData : false, 
				contentType : false,
		        success: function (resp) {
		        	hideMask();
		        	var result = null;
		        	if(resp.data && resp.data.score){
		        		result = resp.data.score;
		        	}
		        	if(!result && result != 0){
		        		noty({text: "比对失败", layout: "topCenter", type: "warning", timeout: 1000});
		        		return;
		        	}
		        	noty({text: "比对成功", layout: "topCenter", type: "success", timeout: 1000});
		        	$("#compare-score").html(Math.round(result * 100) / 100);
		        },
		        error: function (message) {
		        	hideMask();
		        	noty({text: "比对失败", layout: "topCenter", type: "error", timeout: 1000});
		        }
		    });
    	}
     };
     
     var show_file_image = function($this){
         var _this = $this[0], _file = _this.files[0];
         var fileType = _file.type;
         var fileSize = _file.size;
         if (fileSize>5*1024*1024){
             __drawFromUrl(d_url + '/image/too_big_tip.png');
             return false;
         }
         if (_this.value==''){
             return false;
         }
         if(/image\/\w+/.test(fileType)) {
             var fileReader = new FileReader();
             fileReader.readAsDataURL(_file);
             fileReader.onload = function (event) {
                 var result = event.target.result;   //返回的dataURL
                 __drawFromUrl(result);
             }
         }
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
	
	function __drawFromUrl(imgurl) {
	    context.clearRect(0, 0, canvas.width, canvas.height);
	    var image = new Image();
	    image.onload = function () {  //创建一个image对象，给canvas绘制使用
	        scale = 1;
	        if (this.width > canvas.width || this.height > canvas.height) {
	            scale_width = canvas.width / this.width;
	            scale_height = canvas.height / this.height;
	            scale = scale_width < scale_height ? scale_width : scale_height;
	         }
	         offset_x = (canvas.width - this.width * scale) / 2;
	         offset_y = (canvas.height - this.height * scale) / 2;
	         context.clearRect(0,0,canvas.width,canvas.height);
	         context.drawImage(this, offset_x, offset_y, this.width * scale, this.height * scale);
	     };
	     image.src = imgurl;
	    }
	return {
		_init:init,
	}
})();
