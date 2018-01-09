package com.tunicorn.dface.entity;

import java.io.Serializable;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class DateEntity implements Serializable {
	private static final long serialVersionUID = 5715994179368303180L;
	
	private int year = 0;
	private int month = 0;
	private int day = 0;
	private int hours = 0;
	private int minutes = 0;
	private int seconds = 0;
	
	public int getYear() {
		return year;
	}
	public void setYear(int year) {
		this.year = year;
	}
	public int getMonth() {
		return month;
	}
	public void setMonth(int month) {
		this.month = month;
	}
	public int getDay() {
		return day;
	}
	public void setDay(int day) {
		this.day = day;
	}
	public int getHours() {
		return hours;
	}
	public void setHours(int hours) {
		this.hours = hours;
	}
	public int getMinutes() {
		return minutes;
	}
	public void setMinutes(int minutes) {
		this.minutes = minutes;
	}
	public int getSeconds() {
		return seconds;
	}
	public void setSeconds(int seconds) {
		this.seconds = seconds;
	}
	
	public String getMinutesStr() {
		if (minutes < 10) {
			return "0" + minutes;
		}else{
			return String.valueOf(minutes);
		}
	}
	public String getTime() {
		return this.getHours() + ":" + this.getMinutesStr();
	}
	public Date getDate(){
		SimpleDateFormat format =  new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");  
	    String time = String.format("%s-%s-%s %s:%s:%s", this.getYear(), this.getMonth(), this.getDay(), 
	    		this.getHours(), this.getMinutes(), this.getSeconds());  
	    Date date;
		try {
			date = format.parse(time);
		    return date;
		} catch (ParseException e) {
			e.printStackTrace();
		}   
		return null;
	}
}
