package com.tunicorn.dface.aop;

import java.lang.reflect.Method;

import javax.servlet.http.HttpServletRequest;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.tunicorn.common.Constant;
import com.tunicorn.dface.annotation.Log;
//import com.tunicorn.dface.mapper.AuditLogMapper;
//import com.tunicorn.dface.vo.AuditLogVO;
//import com.tunicorn.dface.vo.UserVO;

@Aspect
@Configuration
public class UserActionLogAspect {
	
//	@Autowired
//	AuditLogMapper auditLogMapper;
	
	@Pointcut("execution(* com.tunicorn.dface.controller..*.*(..))")
    public void excudeService() {}
	
	@After("excudeService()")
    public void doAfter(JoinPoint joinPoint) throws Throwable {
		MethodSignature signature = (MethodSignature) joinPoint.getSignature();
		Method method = signature.getMethod();
		Log operation = method.getAnnotation(Log.class);
		/*if (operation != null) {
			HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
			Object obj = request.getSession().getAttribute(Constant.SESSION_USER);
			if (obj != null) {
				UserVO currentUser = (UserVO) obj; 
				AuditLogVO audit = new AuditLogVO();
				audit.setUserId(currentUser.getId());
				audit.setAction(operation.action());
				audit.setParameters("");
//				auditLogMapper.insertLog(audit);
			}
		}*/
	}
}
