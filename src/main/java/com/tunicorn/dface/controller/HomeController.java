package com.tunicorn.dface.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.tunicorn.dface.Constant;
import com.tunicorn.dface.vo.User;

//import com.tunicorn.dface.vo.UserVO;

@Controller
@EnableAutoConfiguration
@RequestMapping("/home")
public class HomeController extends BaseController {
	private static Logger logger = Logger.getLogger(HomeController.class);

	@RequestMapping(value = "/index", method = RequestMethod.GET)
    public String homepage(HttpServletRequest request, HttpServletResponse resp, Model model) {
		User user = new User(request.getRemoteAddr());
        request.getSession().setAttribute("user", user);
        model.addAttribute("main", "test");
        return "dashboard/main";
    }
	/*@RequestMapping(value = "", method = RequestMethod.GET)
	public String list(HttpServletRequest request, Model model,
			@RequestParam(value = "page", required = false) Long page) {
		UserVO loginUser = getCurrentUser(request);
		Boolean canViewUserManagePage = loginUser.getCanViewUserManagePage();
		if (canViewUserManagePage == null || !canViewUserManagePage) {
			logger.error("notice error 403");
			return "error/403";
		}
		if (page == null) {
			page = 1L;
		}

		Boolean canViewNoticeCenterPage = loginUser.getCanViewNoticeCenterPage();
		boolean haveNoAnyPrivilege = false;

		if (canViewNoticeCenterPage == null || !canViewNoticeCenterPage) {
			haveNoAnyPrivilege = true;
		}
		model.addAttribute("haveNoAnyPrivilege", haveNoAnyPrivilege);

		model.addAttribute("page", page);
		model.addAttribute("totalPage", 0);
		model.addAttribute("total", 0);
		return "notice/list";
	}*/
}
