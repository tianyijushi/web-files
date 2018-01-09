package com.tunicorn.dface.service;

import org.springframework.stereotype.Service;
import com.tunicorn.dface.bo.PageBO;

@Service
public class BaseService {

	private static int PAGE_SIZE = 8;
	
	public PageBO WarpPage(Integer page, Integer total, Integer pageSize){
		if(pageSize==null){
			pageSize = PAGE_SIZE;
		}
		PageBO pageBO= new PageBO();
		int totalPage = 0;
		if(total % pageSize == 0){
			totalPage = total / pageSize;
		}else{
			totalPage = total / pageSize + 1;
		}
		if(totalPage == 0){
			totalPage = 1;
		}
		if(page==null || page<1){
			page = 1;
		}
		if(page > totalPage){
			page = totalPage;
		}
		pageBO.setPage(page);
		pageBO.setSkip((page-1)*pageSize);
		pageBO.setStep(pageSize);
		pageBO.setTotal(total);
		pageBO.setTotalPage(totalPage);
		return pageBO;
	}
	
	public PageBO WarpPage(Integer page, Integer total){
		return WarpPage(page, total, null);
	}

}
