package com.tunicorn.dface;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
//import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
//import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;
import org.springframework.boot.web.servlet.ServletComponentScan;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@SpringBootApplication
//@MapperScan("com.tunicorn.dface.*mapper")
@ServletComponentScan
public class WebFilesApplication extends WebMvcConfigurerAdapter {
	public static void main(String[] args) {
		SpringApplication.run(WebFilesApplication.class, args);
	}
	
	/*public void addInterceptors(InterceptorRegistry registry) {  
		registry.addInterceptor(new LoginInterceptor()).addPathPatterns("/**").excludePathPatterns("/js/**")
			.excludePathPatterns("/fonts/**")
			.excludePathPatterns("/css/**")
			.excludePathPatterns("/image/**")
			.excludePathPatterns("/login")
			.excludePathPatterns("/user/**")
			.excludePathPatterns("/userManual/**");
	}*/

	/*@Bean
	public MultipartConfigElement multipartConfigElement() { 
		String size = ConfigUtils.getInstance().getConfigValue("file.upload.size");
		String total = ConfigUtils.getInstance().getConfigValue("file.upload.total.size");
		//String location = ConfigUtils.getInstance().getConfigValue("file.upload.storage");

		MultipartConfigFactory factory = new MultipartConfigFactory();
		factory.setMaxFileSize(size); //KB,MB， file size
		factory.setMaxRequestSize(total);  //total size of files
		//factory.setLocation(location);  //file path to storage
		return factory.createMultipartConfig();
	}*/
}
