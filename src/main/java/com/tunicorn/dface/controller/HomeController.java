package com.tunicorn.dface.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.tunicorn.dface.Constant;
import com.tunicorn.dface.vo.User;


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
        String endPath = request.getSession().getAttribute("endPath")==null?Constant.ROOT_FILE_ENDPATH:request.getSession().getAttribute("endPath").toString();//移动的目标路径
        if (endPath.isEmpty()) {
			endPath = Constant.ROOT_FILE_ENDPATH;
		}
        model.addAttribute("endPath", endPath);
        request.getSession().setAttribute("endPath", endPath);
        return "home/main";
    }
}