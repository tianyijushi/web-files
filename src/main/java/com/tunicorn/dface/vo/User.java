package com.tunicorn.dface.vo;

import com.tunicorn.dface.entity.DateEntity;

public class User {
	
	private String ipAddress;
	private String date;
	
	public User(String ipAddress){
		this.ipAddress = ipAddress;
		this.date = new DateEntity().getTime();
	}
	
	public String getIpAddress() {
		return ipAddress;
	}
	public void setIpAddress(String ipAddress) {
		this.ipAddress = ipAddress;
	}
	public String getDate() {
		return date;
	}
	public void setDate(String date) {
		this.date = date;
	}

}
