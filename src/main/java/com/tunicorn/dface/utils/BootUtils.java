package com.tunicorn.dface.utils;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;

import com.tunicorn.util.EncryptSourceUtils;

public class BootUtils {
	private static Logger logger = Logger.getLogger(BootUtils.class);
	private static String baseDir;
	static {
		String configDir = EncryptSourceUtils.class.getResource("/application.properties").getPath();
		baseDir = configDir.substring(0, configDir.lastIndexOf("/")) + "/";
	}
	public static void generateMenuConfig (String templateName) {
		String filePath = baseDir + "menu_template/" + "top_menu_" + templateName + ".json";
		logger.info("menu template:" + filePath);
		try {
			byte[] data = readFile(new File(filePath));
			writeFile(new File(baseDir + "top_menu.json"), data);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	private static byte[] readFile(File file) throws IOException {  
	    long len = file.length();  
	    byte data[] = new byte[(int)len];  
	    FileInputStream fin = new FileInputStream(file);  
	    int r = fin.read(data);  
	    if (r != len)  {
	    	fin.close();  
	    	throw new IOException("Only read " + r +" of " + len + " for " + file);  
	    }
	    fin.close();  
	    return data;  
	}  
	  
	private static void writeFile(File file, byte data[]) throws IOException {  
		FileOutputStream fout = new FileOutputStream(file);  
	    fout.write(data);  
	    fout.close();  
	}  

	public static void main(String[] args) {
		if (args != null && args.length > 0) {
			String templateName = args[0];
			logger.info("Template name:" + templateName);
			if (StringUtils.isNotEmpty(templateName.trim())) {
				generateMenuConfig(templateName);
			}
		}
		EncryptSourceUtils.encrpyt();
	}
}
