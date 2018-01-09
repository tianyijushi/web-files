<style type="text/css">
.red {
	background-color: #F00;
}
.gray {
	background-color: #CCCCCC;
}
#ex1Slider{
	width:500px;
}
#ex1Slider .slider-selection {
	background: #BABABA;
}

###############ul li 布局############################
ul{list-style:none;}
ul.imglist{ margin:0 auto; width:98%; overflow:hidden}
ul.imglist li{cursor:pointer; float:left; padding:4px 8px; width:106px; list-style-type:none;margin-left:5px; margin-right:5px;}
ul.imglist li img{ display:block; width:90px; height:90px}
ul.imglist li span{ display:block; width:100%;  background:#F6F6F6;white-space:nowrap}

</style>
<link href="${springMacroRequestContext.contextPath}/css/bootstrap-slider.css" rel="stylesheet">
<div class="" id="refuse">
	<input id="parentPath" type="hidden" value="${path}"/>
	&nbsp;&nbsp;&nbsp;&nbsp;<input id="ex1" data-slider-id='ex1Slider' type="text" data-slider-min="1.0" data-slider-max="2.0" data-slider-step="0.1" data-slider-value="1.0"/>
	<br/>
     <div>
     	<ul class="imglist">
     <#assign text>${files}</#assign>
     <#assign json=text?eval />  
     <#assign m=0>
     <#if json??>
     
     	<#list json as item> 
     		<li class='<#if item.can_choose=="1"> gray</#if>' choosed="${item.can_choose}">
     			<span style="display:none">${item.path}</span>
     			<img name="imgPic" width="90" height="90" src="/files/files/getPic?path=${item.path}">
     			<span style="font-size:6px">文件名:<br/>
					<#if item.name?length lt 10>
					    ${item.name}
					<#else>
					  	${item.name?substring(0,10)}...
					</#if>
				</span>
     		</li>
			<#assign m=m+1>
			</#list>
		</#if>
		</ul>
      </div>
    <#if m == 0>
    	<div style="width:100%;height:100px;line-height:100px;vertical-align: middle;text-align:center;">
			当前目录下没有任何图片！
		</div>
	</#if>
	<#if m gt 0>
	<div style="width:100%;height:100px;line-height:100px;vertical-align: middle;text-align:center;">
		<button id="deleteButton" class="btn btn-warning" >批量删除</button>
		<button id="cancelButton" class="btn btn-warning" >取消选中</button>
	</div>
	</#if>
</div>
<script type="text/javascript" src="${springMacroRequestContext.contextPath}/js/dface-file.js"></script>
<script type="text/javascript">

	// With JQuery 使用JQuery 方式调用  
	$('#ex1').slider({  
	    formatter: function (value) {  
	        return '显示倍数: ' + value;  
	    }  
	}).on('slide', function (slideEvt) {  
	    //当滚动时触发  
	    //console.info(slideEvt);  
	    //获取当前滚动的值，可能有重复  
	    // console.info(slideEvt.value);  
	}).on('change', function (e) {  
	    //当值发生改变的时候触发  
	    //console.info(e);  
	    //获取旧值和新值  
	    console.info(e.value.oldValue + '--' + e.value.newValue);  
	    $("[name='imgPic']").css("width",90*e.value.newValue+"px");
	    $("[name='imgPic']").css("height",90*e.value.newValue+"px");
	    $("ul.imglist li").css("width",(90*e.value.newValue+16)+"px")
	});  

	// Without JQuery
	var slider = new Slider('#ex1', {
		formatter: function(value) {
			return '显示倍数: ' + value;
		}
	});
</script>