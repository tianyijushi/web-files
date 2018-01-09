package com.tunicorn.dface.utils;

import java.util.HashMap;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.tunicorn.common.api.Message;
import com.tunicorn.common.api.RestAPIResponse;
import com.tunicorn.common.api.param.IRequestParam;
import com.tunicorn.dface.param.CaptureSearchRequestParam;
import com.tunicorn.dface.param.GroupSearchRequestParam;
import com.tunicorn.dface.param.ModelingRequestParam;
import com.tunicorn.dface.param.OneToOneCompareRequestParam;
import com.tunicorn.util.HttpClientUtils;
import com.tunicorn.util.JsonUtil;
import com.tunicorn.util.MessageUtils;

public class ServiceUtils { 
	private static Logger logger = Logger.getLogger(ServiceUtils.class);
	
	public static RestAPIResponse captrueSearch(CaptureSearchRequestParam params) {
		String url = ConfigUtils.getInstance().getConfigValue("dface.search.capture.url");
		return callCoreService(url, params, "dface_capture_search_service");
	}
	
	public static RestAPIResponse groupSearch(GroupSearchRequestParam params) {
		String url = ConfigUtils.getInstance().getConfigValue("dface.search.group.url");
		return callCoreService(url, params, "dface_group_search_service");
	}
	
	public static RestAPIResponse modeling(ModelingRequestParam params) {
		String url = ConfigUtils.getInstance().getConfigValue("dface.modeling.url");
		return callCoreService(url, params, "dface_modeling_service");
	}
	
	public static RestAPIResponse oneToOneCompare(OneToOneCompareRequestParam params) {
		String url = ConfigUtils.getInstance().getConfigValue("dface.compare.url");
		return callCoreService(url, params, "dface_compare_service");
	}
	
	private static RestAPIResponse callCoreService(String uri, IRequestParam params, String apiErrMsgTag) {
		String url = uri;
		
		Map<String, String> headers = new HashMap<String, String>();
		headers.put("Content-Type", "application/json");
		String jsonData = params.convertToJSON();
		logger.info(url);
		logger.info(jsonData);
		String retValue = HttpClientUtils.post(url, headers, jsonData);
		logger.info("The response from backend Face server:" + retValue);
		
		if(StringUtils.isBlank(retValue)) {
			Message message = MessageUtils.getInstance().getMessage(String.format("%s_error", apiErrMsgTag));
			return new RestAPIResponse(message.getCode(), message.getMessage());
		}
		
		ObjectNode node = JsonUtil.toObjectNode(retValue);
		if(node == null) {
			Message message = MessageUtils.getInstance().getMessage(String.format("invalid_%s_return", apiErrMsgTag));
			return new RestAPIResponse(message.getCode(), message.getMessage());
		}
		return new RestAPIResponse(node);
	}
}
