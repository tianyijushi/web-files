<#if menus??>
	<#list menus as item>
      	<#if item.subMenus?size gt 0>
			<li class="treeview">
				<#if (item.url)??>
					<a url="${springMacroRequestContext.contextPath}${item.url}" href="javascript:void(0)"  data-title="${item.name}">
				  
				   		<span >${item.name}</span><i class="fa fa-angle-left pull-right"></i>
					</a>
				<#else>	
					<a href="javascript:void(0)" data-title="${item.name}" >
				   		
				   		<span >${item.name}</span><i class="fa fa-angle-left pull-right"></i>
					</a>
				</#if>
				<ul class="treeview-menu sidebarList" style="max-height:300px;overflow-y:auto">
					<#list item.subMenus as sub>
					   <li>
						  <a style="margin-left: 15px;" url="${springMacroRequestContext.contextPath}${sub.url}" href="javascript:void(0)" title='${sub.name}' data-title="${sub.name}" menu="${item.name}" submenu="${sub.name}" class="menu" onclick="changeMenu(this)">
							${sub.name}
						  </a>
					   </li>
					</#list>
				</ul>
			</li>
		<#else>
			<li class="treeview">
        	<#if (item.url)??>
				<a url="${springMacroRequestContext.contextPath}${item.url}"  href="javascript:void(0)" data-title="${item.name}" class="menu" onclick="changeMenu(this)">
			   		
			   		<span>${item.name}</span><i class="fa"></i>
				</a>
			<#else>
				<a href="javascript:void(0)"  data-title="${item.name}" class="menu">
			   		
			   		<span>${item.name}</span><i class="fa"></i>
				</a>
			</#if>
			</li>
		</#if>
	</#list>
</#if>	 
<script type="text/javascript">
	(function(){
		$(".sidebarList").niceScroll({ 
    	    cursorcolor: "#ccc",//#CC0071 光标颜色 
    	    cursoropacitymax: 1, //改变不透明度非常光标处于活动状态（scrollabar“可见”状态），范围从1到0 
    	    touchbehavior: false, //使光标拖动滚动像在台式电脑触摸设备 
    	    cursorwidth: "5px", //像素光标的宽度 
    	    cursorborder: "0", //     游标边框css定义 
    	    cursorborderradius: "5px",//以像素为光标边界半径 
    	    autohidemode: true //是否隐藏滚动条 
    	});
	})()
</script>