package com.tunicorn.dface.param;

import java.io.Serializable;

import org.apache.commons.lang3.StringUtils;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.tunicorn.common.api.param.IRequestParam;

public class OneToOneCompareRequestParam implements IRequestParam, Serializable {
	private static final long serialVersionUID = -4266166260295585093L;

	private String img_url1;
	private String img_url2;

	public String getImg_url1() {
		return img_url1;
	}

	public void setImg_url1(String img_url1) {
		this.img_url1 = img_url1;
	}

	public String getImg_url2() {
		return img_url2;
	}

	public void setImg_url2(String img_url2) {
		this.img_url2 = img_url2;
	}

	public String convertToJSON() {
		ObjectNode node = mapper.createObjectNode();

		if (StringUtils.isNotBlank(img_url1)) {
			node.put("img_url1", img_url1);
		}

		if (StringUtils.isNotBlank(img_url2)) {
			node.put("img_url2", img_url2);
		}

		return node.toString();
	}
}
