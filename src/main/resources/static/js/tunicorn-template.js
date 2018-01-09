var template =  template || {};

(function(parent, $){
	var baseTemplate = parent.baseTemplate = function(){
        return {
        	baseModalTemplate : function(){/*
        	    <div id="{{modalId}}" aria-labelledby="myModalLabel" aria-hidden="true" class="modal fade" tabindex="-1" role="dialog" >
					<div class="modal-dialog" role="document">
					    <div class="modal-content">
					        <div class="modal-header">
					            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
					            <h4 class="modal-title" id="myModalLabel" >{{title}}</h4>
					        </div>
					        
					        <div class="modal-body">
					            {{body}}
					        </div>
					        
						    <div class="modal-footer" style="border-top-color: #ffffff">
						        <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
						        <button type="button" class="btn btn-success" id="{{eventId}}">确定</button>
						    </div>
					   </div>   
					</div> 
				</div>  
				
        	 */},
        	deleteModalTemplate : function(){/*
        	    <div id="confrim_delete_dialog" aria-labelledby="delete_label" aria-hidden="true" class="modal fade"  tabindex="-1" role="dialog" >
					<div class="modal-dialog">
						<div class="modal-content">
							<div class="modal-header">
								<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
								<h4 class="modal-title" id="delete_label">确认删除</h4>
							</div>
							<div class="modal-body" style="padding:0px">							
								<p style="border-bottom: 1px solid #f4f4f4;padding: 15px;">您确定要删除吗？<b>（一旦删除将不可恢复，请谨慎操作！）</b></p>
								<div class="modal-footer" style="border: none" >
									<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
									<button type="button" class="btn btn-success" data-dismiss="modal" id="confrim_delete">确定</button>
								</div>
							</div>
						</div>
					</div>
				</div>
				<script type="text/javascript">
					$("#confrim_delete").click(function(){
					    $.ajax({
							url : "{{{deleteURL}}}",
							type : "DELETE",
							success : function(data){
								if(data && data.success){
									noty({text: "删除操作成功！", layout: "topCenter", type: "success", timeout: 2000});
					            	setTimeout(function(){
										$.get("{{{callBackURL}}}", function(data, status){
									    	$("#content").html(data);
									    });
					            	},500);
								}else{
									noty({text: data.errorMessage, layout: "topCenter", type: "warning", timeout: 2000});
								}
							},complete : function(){
								setTimeout(function(){
									$.get("{{{callBackURL}}}", function(data, status){
								    	$("#confrim_delete_dialog").remove();
								    });
				            	},500);
							}
						});
					});
				</script>
        	 */},
	    	 hereDoc : function(func){
	        	return func.toString().split(/\n/).slice(1, -1).join('\n');
	    	 }
        };
    }();
	
	
    var modal = parent.modal = function(){
        return {
        	createModal : function(title, body, modalId, eventId){
        		
        	},
        	getModal : function(modalId){
        		
        	},
        	getModalWithData : function(modalId, data){
        		
        	},getDeleteModal : function(deleteURL, callBackURL){
        		var delTmpDoc = template.baseTemplate.deleteModalTemplate;
        		var delTmp = template.baseTemplate.hereDoc(delTmpDoc);
        		var template_data = { 
        				deleteURL : deleteURL,
        				callBackURL : callBackURL
        		};
        		var rendered = Mustache.render(delTmp, template_data);
        		return rendered;
        	},showDeleteModal : function(deleteURL, callBackURL){
        		var temp = modal.getDeleteModal(deleteURL, callBackURL);
        		$('#confrim_delete_dialog').remove();
        		$('body').append($(temp));
        		$('#confrim_delete_dialog').modal('show');
        	}
        };
    }();
})(template, jQuery);
