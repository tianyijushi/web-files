package com.tunicorn.dface;


import com.tunicorn.dface.utils.ConfigUtils;

public class Constant {
	public static final String ROOT_FILE_PATH = ConfigUtils.getInstance().getConfigValue("root.file.path");
	public static final String ROOT_FILE_ENDPATH = ConfigUtils.getInstance().getConfigValue("root.file.endPath");

}
