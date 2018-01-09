package com.tunicorn.dface.text;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.sql.Time;
import java.util.ArrayList;
import java.util.List;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class FilesUtils {
	
	public static void main(String[] args) {
		String path = "D:\\mnt\\storage4\\dface";
//		getFolders(path);
		System.out.println(getFolders(path).toString());
		
		String path1 = "D:\\mnt\\storage4\\dface\\333";
//		getFiles(path1);
		
		String[] path2 = new String[]{"D:\\downloads\\pic\\333\\5.jpg"};
//		deleteFile(path2);
	}
	
	/**
	 * 
	 * TODO:获取文件夹树结构
	 * 
	 * @param path
	 * @return
	 */
	public static JSONObject getFolders(String path){
		File file = new File(path);
		JSONObject json = new JSONObject();
		search(file, json);
		return json;
	}
	/**
	 * 
	 * TODO:递归算法
	 * 
	 * @param file
	 * @param json
	 */
	public static void search(File file,JSONObject json){
		if (file.exists()) {
			JSONArray jsonArray = new JSONArray();
			File[] tmp = file.listFiles();
			for (int i = 0; i < tmp.length; i++) {
				if (tmp[i].isDirectory()) {
					JSONObject json1 = new JSONObject();
//					json1.put("name", tmp[i].getName());
//					json1.put("time", tmp[i].lastModified());
//					json1.put("path1", tmp[i].getPath());
					search(new File(file, tmp[i].getName()), json1);
					jsonArray.add(json1);
				}
			}
			json.put("name", file.getName());
			json.put("time", file.lastModified());
			json.put("path", file.getPath());
			json.put("nodes", jsonArray);
		}
	}
	
	/**
	 * 
	 * TODO:获取某个路径下的图片列表
	 * 
	 * @param path
	 */
	public static void getFiles(String path){
		JSONArray jsonArray = new JSONArray(); //返回值
		List<String> lstr = new ArrayList<String>();
		File file = new File(path);
		if (file.exists()) {
			File[] tmpFiles = file.listFiles();
			for (int i = 0; i < tmpFiles.length; i++) {
				if (tmpFiles[i].isFile() && !(tmpFiles[i].getName().endsWith(".txt"))) {
					JSONObject jsonObject = new JSONObject();
					jsonObject.put("name", tmpFiles[i].getName());
					jsonObject.put("path", tmpFiles[i].getPath());
					jsonArray.add(jsonObject);
				}else if(tmpFiles[i].getName().endsWith(".txt")){//读取txt种子文件
					File txtFile = tmpFiles[i];
					BufferedReader reader = null;
					try {
						reader = new BufferedReader(new FileReader(txtFile));
						while (reader.readLine()!=null) {
							lstr.add(reader.readLine());
						}
					} catch (Exception e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
					
				}
			}
		}
		for (int i = 0; i < jsonArray.size(); i++) {
			if (lstr.contains(jsonArray.getJSONObject(i).get("name"))) {
				jsonArray.getJSONObject(i).put("can_choose", false);
			}else {
				jsonArray.getJSONObject(i).put("can_choose", true);
			}
		}
		System.out.println(jsonArray.toString());
	}
	
	/**
	 * 
	 * TODO:删除文件
	 * 
	 * @param paths
	 */
	public static void deleteFile(String[] paths){
		for (int i = 0; i < paths.length; i++) {
			File file = new File(paths[i]);
			file.delete();
		}
	}
	

}
