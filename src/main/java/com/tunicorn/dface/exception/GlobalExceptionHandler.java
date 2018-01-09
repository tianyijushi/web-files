package com.tunicorn.dface.exception;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.NoHandlerFoundException;

@ControllerAdvice
public class GlobalExceptionHandler {
	
	private static Logger logger = Logger.getLogger(GlobalExceptionHandler.class);
	
	@ResponseStatus(HttpStatus.NOT_FOUND)
	@ExceptionHandler(NoHandlerFoundException.class)
	public ModelAndView handleNotFound(NoHandlerFoundException exception, HttpServletRequest request) {
		logger.error(exception.getMessage());
	    return new ModelAndView("error/404");
	}
	
	@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
	@ExceptionHandler(RuntimeException.class)
	public ModelAndView handleInternalError(RuntimeException exception, HttpServletRequest request) {
		logger.error(exception.getMessage());
		return new ModelAndView("error/500");
	}
}
