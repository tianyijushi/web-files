package com.tunicorn.dface;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

import com.tunicorn.dface.utils.ConfigUtils;

public class Constant {
	public static final String ROOT_FILE_PATH = ConfigUtils.getInstance().getConfigValue("root.file.path");

}
