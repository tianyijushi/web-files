package com.tunicorn.dface.vo;

/**
 * 图片列表元素对象
 * @author weixiaokai
 * @date 2017年12月29日 上午10:27:01
 */
public class PicVO {
	
	private String name;
	private String path;
	private boolean can_choose;
	
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getPath() {
		return path;
	}
	public void setPath(String path) {
		this.path = path;
	}
	public boolean isCan_choose() {
		return can_choose;
	}
	public void setCan_choose(boolean can_choose) {
		this.can_choose = can_choose;
	}

	
	
}
