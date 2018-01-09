<style type="text/css">
    
    table {
    background-color: #FFF;
    border: none;
    color: #565;
    font: 12px arial;
}

table caption {
    font-size: 24px;
    border-bottom: 0px solid #B3DE94;
    border-top: 0px solid #B3DE94;
}

table, td, th {
    margin: 0;
    padding: 0;
    vertical-align: middle;
    text-align:left;
}

tbody td, tbody th {
    background-color: #fff;
    border-bottom: 0px solid #B3DE94;
    border-top: 0px solid #FFFFFF;
    padding: 9px;
}


tfoot td, tfoot th {
    font-weight: bold;
    padding: 4px 8px 6px 9px;
    text-align:center;
}

thead th {
    font-size: 14px;
    font-weight: bold;
    line-height: 19px;
    padding: 0 8px 2px;
    text-align:center;
}

tbody tr.odd th,tbody tr.odd td { /*odd就是偶数行*/
    background-color: #fff;
    border-bottom: 0px solid #67BD2A;
}

td+td+td, /*第三个td以及之后的td元素*/
col.price{ /*类样式*/
    text-align:right;
}

tbody tr td:hover , tbody tr th:hover  { /*tr也有hover样式*/
    background-color: #67BD2A;
    color:#fff;
}
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
</style>
<link href="${springMacroRequestContext.contextPath}/css/bootstrap-slider.css" rel="stylesheet">
<div class="" id="refuse">
	<input id="parentPath" type="hidden" value="${path}"/>
	&nbsp;&nbsp;&nbsp;&nbsp;<input id="ex1" data-slider-id='ex1Slider' type="text" data-slider-min="1.0" data-slider-max="2.0" data-slider-step="0.1" data-slider-value="1.0"/>
	<br/>
     <table class="tables" >
     <#assign text>${files}</#assign>
     <#assign json=text?eval />  
     <#assign m=0>
     	<#list json as item>  
     		<#if (m%10) == 0>
		 	<tr class="trs">
			</#if>
			
			<td class="tds  <#if item.can_choose=="1"> gray</#if>" choosed="${item.can_choose}">
				<span style="display:none">${item.path}</span>
				<div class="">
					<img name="imgPic" width="90" height="90" src="/files/files/getPic?path=${item.path}">
					<div class="timeStyle">
						<div class="timeWord">文件名</div>
						<span>
							<#if item.name?length lt 10>
							    ${item.name}
							<#else>
							    ${item.name?substring(0,10)}...
							</#if>
						</span>
					</div>
				</div>
			</td>
				<#assign m=m+1>
				<#if (m%10) == 0>
				</tr>
				</#if>
				
			</#list>
			</td>
		</tr>
      </table>
    <#if m == 0>
    	<div style="width:100%;height:100px;line-height:100px;vertical-align: middle;text-align:center;">
			当前目录下没有任何图片！
		</div>
	</#if>
	<#if m gt 0>
	<div style="width:100%;height:100px;line-height:100px;vertical-align: middle;text-align:center;">
		<button id="deleteButton" class="btn btn-warning" >批量删除</button>
	</div>
	</#if>
</div>
<script type="text/javascript" src="${springMacroRequestContext.contextPath}/js/jquery.min.js"></script>
<script type="text/javascript" src="${springMacroRequestContext.contextPath}/js/dface-file.js"></script>
<script type="text/javascript" src="${springMacroRequestContext.contextPath}/js/bootstrap-slider.min.js"></script>
<script type="text/javascript">
$(function(){
	// With JQuery 使用JQuery 方式调用  
	$('#ex1').slider({  
	    formatter: function (value) {  
	        return 'Current value: ' + value;  
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
	});  
});
</script>