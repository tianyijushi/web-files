package com.tunicorn.dface.utils;

import java.util.Map;

import org.apache.commons.lang3.StringUtils;

public class DefaultConfigUtils {
	private static Map<String, String> defaultConfigMap = null;
	private static boolean initStatus = false;
	
	public static final String APP_LIMIT_ITEM_NAME = "app_limit";
	public static final String STORAGE_LIMIT_ITEM_NAME = "storage_limit";
	public static final String RATE_LIMIT_ITEM_NAME = "rate_limit";
	public static final String FACEGROUP_ASSET_LIMIT_ITEM_NAME = "face_group_asset_limit";
	
	private static final int APP_LIMIT_DEFAULT_VALUE = 1;
	private static final int RATE_LIMIT_DEFAULT_VALUE = 20;
	private static final long STORAGE_LIMIT_DEFAULT_VALUE = 104857600;
	private static final int FACEGROUP_ASSET_LIMIT_DEFAULT_VALUE = 1000;
	
	public static void init(Map<String, String> mapping) {
		if(!initStatus) {
			defaultConfigMap = mapping;
			initStatus = true;
		}
	}
	
	private static String getDefaultConfig(String configName) {
		if(defaultConfigMap != null) {
			return defaultConfigMap.get(configName);
		}
		
		return null;
	}
	
	public static int getDefaultAppLimit() {
		String value = getDefaultConfig(APP_LIMIT_ITEM_NAME);
		return StringUtils.isBlank(value) ? APP_LIMIT_DEFAULT_VALUE : Integer.parseInt(value);
	}
	
	public static int getDefaultRateLimit() {
		String value = getDefaultConfig(RATE_LIMIT_ITEM_NAME);
		return StringUtils.isBlank(value) ? RATE_LIMIT_DEFAULT_VALUE : Integer.parseInt(value);
	}
	
	public static long getDefaultStorageLimit() {
		String value = getDefaultConfig(STORAGE_LIMIT_ITEM_NAME);
		return StringUtils.isBlank(value) ? STORAGE_LIMIT_DEFAULT_VALUE : Long.parseLong(value);
	}
	
	public static int getDefaultFaceGroupAssetLimit() {
		String value = getDefaultConfig(FACEGROUP_ASSET_LIMIT_ITEM_NAME);
		return StringUtils.isBlank(value) ? FACEGROUP_ASSET_LIMIT_DEFAULT_VALUE : Integer.parseInt(value);
	}
}
