package com.tunicorn.dface.param;

import java.io.Serializable;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.tunicorn.common.api.param.IRequestParam;

public class ModelingRequestParam implements IRequestParam, Serializable {
	private static final long serialVersionUID = -4144862422330694120L;
	
	private long faceGroupId;
	
	public ModelingRequestParam(long faceGroupId) {
		this.faceGroupId = faceGroupId;
	}
	
	public long getFaceGroupId() {
		return faceGroupId;
	}

	public void setFaceGroupId(long faceGroupId) {
		this.faceGroupId = faceGroupId;
	}

	public String convertToJSON() {
		try {
			return mapper.writeValueAsString(this);
		} catch (JsonProcessingException e) {}
		
		return "";
	}
}
