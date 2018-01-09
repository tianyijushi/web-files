<!-- 弹框 -->
<div class="modal fade" id="bigCaptureImageModal" tabindex="-1" role="dialog" aria-labelledby="bigImageModalLabel">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header" style='height: 44px;'>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				<h4 class="modal-title pull-left" id="bigImageModalLabel">浏览大图</h4>
			</div>
			<div align="center" class="modal-body">
				<img style="width: 300px;height: 300px" id="bigImage" src="" alt="">
			</div>
			<div class="modal-footer" style="border-top-color: #fff;padding: 0px 15px 15px 15px;">
				<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
			</div>
		</div>
	</div>
</div>
<div class="modal fade" id="bigMapImageModal" tabindex="-1" role="dialog" aria-labelledby="bigMapModalLabel">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header" style='height: 44px;'>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				<h4 class="modal-title pull-left" id="bigMapModalLabel">浏览大图</h4>
			</div>
			<div align="center" class="modal-body">
				<img style="width: 100%;height: 100%" id="bigMapImage" src="" alt="">
			</div>
			<div class="modal-footer" style="border-top-color: #fff;padding: 0px 15px 15px 15px;">
				<button type="button" class="btn btn-default" id="mapZoomBig">放大</button>
				<button type="button" class="btn btn-default" id="mapZoomSmall">缩小</button>
				<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
			</div>
		</div>
	</div>
</div>
<script id="template-row" type="text/x-tmpl">
	{{#data}}
        <div class="col-sm-2 cardPic">
	       	<div class="timeStyle">
				<div class="timeWord">{{newScore}}%</div><span class="timeago" title="{{captureTimeStr}}"></span>
			</div>
			<img  class="tablePic showLargePic" capturefilepath="{{realFilePath}}" src="{{realFilePath}}" />
       	</div>
	{{/data}}
</script>
<script type="text/javascript" src="${springMacroRequestContext.contextPath}/js/mustache.js"></script>

 