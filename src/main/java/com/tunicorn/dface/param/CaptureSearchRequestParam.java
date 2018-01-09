package com.tunicorn.dface.param;

import java.io.Serializable;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.tunicorn.common.api.param.IRequestParam;

public class CaptureSearchRequestParam implements IRequestParam, Serializable {
	private static final long serialVersionUID = -4144862422330694120L;

	private String img_path;
	private int result_count;
	private float threshold;
	// private String capture_time = "";
	private String capture_from_time = "";
	private String capture_to_time = "";
	private String sourceid = "";
	private String sourceIds = "";

	public String getImg_path() {
		return img_path;
	}

	public void setImg_path(String img_path) {
		this.img_path = img_path;
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

	public String getCapture_from_time() {
		return capture_from_time;
	}

	public void setCapture_from_time(String capture_from_time) {
		this.capture_from_time = capture_from_time;
	}

	public String getCapture_to_time() {
		return capture_to_time;
	}

	public void setCapture_to_time(String capture_to_time) {
		this.capture_to_time = capture_to_time;
	}

	public String getSourceid() {
		return sourceid;
	}

	public void setSourceid(String sourceid) {
		this.sourceid = sourceid;
	}

	public String getSourceIds() {
		return sourceIds;
	}

	public void setSourceIds(String sourceIds) {
		this.sourceIds = sourceIds;
	}

	public String convertToJSON() {
		try {
			return mapper.writeValueAsString(this);
		} catch (JsonProcessingException e) {
		}

		return "";
	}
}
