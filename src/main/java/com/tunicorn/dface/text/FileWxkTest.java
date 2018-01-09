package com.tunicorn.dface.text;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import com.tunicorn.dface.Constant;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class FileWxkTest {
	
	private static JSONArray jsonArray = new JSONArray();

	public static String dir2json(String dir_path) {
		HashMap<String, Object> dirMap = new HashMap<String, Object>();
		File root = new File(dir_path);
//		dir2map(root, dirMap);
//		String json = dirMap.get(root.getName()).toString();
		
		/*JSONObject jsonObject = new JSONObject(); dirToJson(root,
		jsonObject); 
		String json = jsonObject.toString();*/
		ArrayList<HashMap<String, Object>> dirList = new ArrayList<>();
		dir2List(root, dirList);
		JSONArray jsonArray = new JSONArray();
		
		for (int i = 0; i < dirList.size(); i++) {
			if (dirList.get(i).get("farther").equals(dir_path)) {
				JSONObject jsonObject = new JSONObject();
				jsonObject.put("text", dirList.get(i).get("text"));
				jsonObject.put("path", dirList.get(i).get("path"));
				jsonArray.add(jsonObject);
			}
			ArrayList<HashMap<String, Object>> tmpList =  dirList;
			for (int j = 0; j < tmpList.size(); j++) {
				if (tmpList.get(j).get("farther").equals(dirList.get(i).get("path"))) {
					
				}
			}
		}
		return  JSONArray.fromObject(dirList).toString();
	}


	/**
	 * 
	 * @param node
	 *            文件节点
	 * @param dirMap
	 *            表示文件所在目录的map
	 */
	public static void dir2map(File node, HashMap<String, Object> dirMap) {
		// 是文件，保存文件名和最后修改时间戳
		/*
		 * if (node.isFile()) { dirMap.put(node.getName(), node.lastModified());
		 * }
		 */
		// 是目录，建立下一层map，并填充
		if (node.isDirectory()) {
			HashMap<String, Object> subDir = new HashMap<String, Object>();
			dirMap.put(node.getName(), subDir);
			for (String filename : node.list()) {
				dir2map(new File(node, filename), subDir);// 填充
			}
		}

	}
	
	public static void dir2List(File node, ArrayList<HashMap<String, Object>> dirList) {
		// 是文件，保存文件名和最后修改时间戳
		/*
		 * if (node.isFile()) { dirMap.put(node.getName(), node.lastModified());
		 * }
		 */
		// 是目录，建立下一层map，并填充
		if (node.isDirectory()) {
			HashMap<String, Object> subDir = new HashMap<String, Object>();
			subDir.put("text", node.getName());
			subDir.put("path", node.getPath());
			subDir.put("farther", node.getParent());
			dirList.add(subDir);
//			dirMap.put(node.getName(), subDir);
			for (String filename : node.list()) {
				dir2List(new File(node, filename), dirList);// 填充
			}
		}

	}
	
	public static void dirToJson(File node, JSONObject jsonObject) {
		/*
		 * if (node.isFile()) { JSONObject jsonObject = new JSONObject();
		 * jsonObject.put("text", node.getName()); jsonArray.add(jsonObject); }
		 */

		if (node.isDirectory()) {
			JSONObject json2 = new JSONObject();
			jsonObject.put(node.getName(), json2);
//			jsonArray
			System.out.println(node.getParent());
			System.out.println(node.getName());
			
			for (String filename : node.list()) {
				dirToJson(new File(node, filename), json2);
			}
		}
	}

	public static void main(String[] args) {
		String static_root = Constant.ROOT_FILE_PATH;
		// String static_root= Starter.prop.getProperty("static_root");
		String json = dir2json(static_root);
		System.out.println(json);
	}

}
