package com.tunicorn.dface.utils;

import java.io.IOException;
import java.util.Properties;

import org.apache.log4j.Logger;

public class ConfigUtils {
	private static final String CONFIG_PROPERTIES_FILE = "/application.properties";
    private static ConfigUtils instance;
    private static Logger logger = Logger.getLogger(ConfigUtils.class);

    private Properties properties;

    private ConfigUtils() {
        init();
    }

    public static synchronized ConfigUtils getInstance() {
        if (instance == null) {
            instance = new ConfigUtils();
        }

        return instance;
    }

    private void init() {
        properties = new Properties();
        
        try {
        	properties.load(ConfigUtils.class.getResourceAsStream(CONFIG_PROPERTIES_FILE));
        } catch (IOException e) {
            logger.error("Error occurs while loading application.properties.", e);
        }
    }

    public String getConfigValue(String configName) {
        return properties.getProperty(configName, "");
    }
}
