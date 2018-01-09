var tunicorn =  tunicorn || {};
tunicorn.contextPath='/dfacec';
tunicorn.intervalTime = 600;//单位秒
(function() {
	$.ajaxSetup({  
        contentType: "application/json;charset=utf-8",
        cache: false,  
        complete: function(XHR, TS) {
            var sessionStatus = XHR.getResponseHeader("sessionStatus");  
            var loginPath = XHR.getResponseHeader("loginPath");
            
            if (911 == XHR.status && "timeout" == sessionStatus) {
               alert('您的会话已经过期，请重新登陆后继续操作！');
               window.location.replace(loginPath);
            }  
        }
    });
	
	var dface = {};
	dface.ajax = function(options) {
		if(!$.isPlainObject(options)) return;
		if(!options.url) return;
		
		var hasParam = options.url.indexOf('?') > 0;
		var url = options.url + (hasParam ? '&ts=' : '?ts=') + Math.round(new Date().getTime() / 1000);
		options.url = url;
		
		$.ajax(options);
	};
	
	dface.constants = {
		PAGINATION_ITEMS_PER_PAGE: 20
	};
	
	window.dface = dface;
})();

(function(parent, $){
    var utils = parent.utils = function(){
        return {
            serialize2JsonString : function(s){
                var json = {};
                var arr = s.split('&');
                for (var i in arr){
                    var kv = arr[i].split('=');
                    json[kv[0]] = kv[1] ? decodeURIComponent(kv[1]) : '';
                }
                return JSON.stringify(json);
            },get : function(url, cb){
            	$.ajax({
	      		  type: "GET",
	      		  url: url,
	      		  success: cb,
	      		  error: function(data) {
	            	 //console.log(data.responseText);
	          	 }
	          	});
            	//$.get(url,cb);
            },render : function(url){
                $('#content').load(url);
            },post : function(url, data, cb){
                if (typeof data=='string'){
                    data = utils.serialize2JsonString(data)
                }else if (typeof data=='object'){
                    data = JSON.stringify(data);
                }
                $.ajax({
                    type: 'POST',
                    url: url,
                    data: data,
                    contentType: "application/json; charset=utf-8",
                    success: function(result){
                        cb(null, result);
                    },
                    error: function(xhr, errMsg, errObject){
                    	//console.log(xhr.responseText);
                    }
                });
            },postForm : function($form, cb){
                var url = $form.attr("action");
                var data = $form.serialize();
                utils.post(url, data, cb);
            },postFormData : function(url, $formData, cb){
            	$.ajax({        
            	    type: 'POST',   
            	    url: url,      
            	    data: $formData,     
            	    contentType: false,      
            	    processData: false,      
            	    success: function (result) {      
            	    	cb(null, result);      
            	    },      
            	    error: function (err) {      
            	        cb(err, null);      
            	    }      
            	});
            }
        }
    }();
})(tunicorn, jQuery);