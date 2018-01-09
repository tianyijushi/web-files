package com.tunicorn.dface.param;

import java.io.Serializable;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.tunicorn.common.api.param.IRequestParam;

public class GroupSearchRequestParam implements IRequestParam, Serializable {
	private static final long serialVersionUID = -4144862422330694120L;
	
	private String img_path;
	private String model_name;
	private int result_count;
	private float threshold;

	public String getImg_path() {
		return img_path;
	}
	public void setImg_path(String img_path) {
		this.img_path = img_path;
	}
	public String getModel_name() {
		return model_name;
	}
	public void setModel_name(String model_name) {
		this.model_name = model_name;
	}
	public int getResult_count() {
		return result_count;
	}
	public void setResult_count(int result_count) {
		this.result_count = result_count;
	}
	public float getThreshold() {
		return threshold;
	}
	public void setThreshold(float threshold) {
		this.threshold = threshold;
	}
	public String convertToJSON() {
		try {
			return mapper.writeValueAsString(this);
		} catch (JsonProcessingException e) {}
		
		return "";
	}
}
