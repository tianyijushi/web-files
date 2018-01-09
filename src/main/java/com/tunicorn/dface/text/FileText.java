package com.tunicorn.dface.text;

import java.io.File;

import com.tunicorn.dface.Constant;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class FileText {
	private static volatile JSONArray jsonArray = new JSONArray();
	public static JSONArray search(String path){
		File tmp = new File(path);
		if (tmp.isDirectory()) {
			Thread thread = new Thread() {
				@Override
				public void run() {
					File[] tmps = tmp.listFiles();
					for (int i = 0; i < tmps.length; i++) {
						if (tmps[i].isDirectory()) {
							System.out.println(tmps[i].getPath());
							JSONObject jsonObject = new JSONObject();
							jsonObject.put("path", tmps[i].getPath());
							jsonObject.put("folder", tmps[i].getName());
							jsonObject.put("list", search(tmps[i].getPath()));
							jsonArray.add(jsonObject);
						}
					}
				}
			};
			thread.start();
		}
		return jsonArray;
		
	}

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		JSONObject jsonObject = new JSONObject();
//		JSONArray jsonArray = new JSONArray();
		jsonObject.put("path", Constant.ROOT_FILE_PATH);
		jsonObject.put("folder", "dface");
		File dir = new File(Constant.ROOT_FILE_PATH);
		if (dir.exists()) {
			jsonArray = search(Constant.ROOT_FILE_PATH);
			/*File[] tmp = dir.listFiles();
			for (int i = 0; i < tmp.length; i++) {
				if (tmp[i].isDirectory()) {
					// System.out.println(tmp[i].getPath());
					// System.out.println(tmp[i].getAbsolutePath());
					File f = tmp[i];
					System.out.println(tmp[i].getName());
				} else {
					
				}
			}*/
		}
		jsonObject.put("list", jsonArray);
		System.out.println(jsonObject.toString());
	}

}
