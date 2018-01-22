package com.tunicorn.dface.controller;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.aspectj.weaver.NewFieldTypeMunger;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.tunicorn.common.entity.AjaxResponse;
import com.tunicorn.dface.Constant;
import com.tunicorn.dface.text.files2;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

/**
 * @author weixiaokai
 * @date 2017年12月28日 下午12:05:35
 */
@Controller
@EnableAutoConfiguration
@RequestMapping("/files")
public class FilesController extends BaseController {
	private static Logger logger = Logger.getLogger(FilesController.class);
	/**
	 * @auther weixiaokai
	 * @date 2017年12月28日 下午12:05:20
	 * @return
	 */
	@RequestMapping(value = "/listFolders", method = RequestMethod.POST)
	@ResponseBody
	public AjaxResponse listFolders(HttpServletRequest request, @RequestBody String requestJson) {
		// getFolders(Constant.ROOT_FILE_PATH).toString();
		return AjaxResponse.toSuccess(getFolders(Constant.ROOT_FILE_PATH));
	}

	/**
	 * 
	 * @auther weixiaokai
	 * @date 2017年12月29日 上午9:03:58
	 * @param path
	 * @return
	 */
	public static JSONObject getFolders(String path) {
		File file = new File(path);
		JSONObject json = new JSONObject();
		search(file, json);
		return json;
	}

	/**
	 * 
	 * @auther weixiaokai
	 * @date 2017年12月29日 上午9:04:16
	 * @param file
	 * @param json
	 */
	public static void search(File file, JSONObject json) {
		if (file.exists()) {
			JSONArray jsonArray = new JSONArray();
			File[] tmp = file.listFiles();
			for (int i = 0; i < tmp.length; i++) {
				if (tmp[i].isDirectory()) {
					JSONObject json1 = new JSONObject();
					// json1.put("name", tmp[i].getName());
					// json1.put("time", tmp[i].lastModified());
					// json1.put("path1", tmp[i].getPath());
					search(new File(file, tmp[i].getName()), json1);
					jsonArray.add(json1);
				}
			}
			json.put("text", file.getName());
			json.put("time", file.lastModified());
			json.put("path", file.getPath());
			json.put("nodes", jsonArray);
		}
	}

	@RequestMapping(value = "/getFiles", method = RequestMethod.POST)
	@ResponseBody
	public AjaxResponse getFiles(HttpServletRequest request, @RequestBody String requestJson) {
		// getFolders(Constant.ROOT_FILE_PATH).toString();
		JSONObject jsonObject = JSONObject.fromObject(requestJson);
		String path = jsonObject.getString("path");
		return AjaxResponse.toSuccess(getFiles(path));
	}

	@RequestMapping(value = "/getPicFiles", method = RequestMethod.POST)
	public String homepage(HttpServletRequest request, HttpServletResponse resp, Model model,
			@RequestBody String requestJson) {
		JSONObject jsonObject = JSONObject.fromObject(requestJson);
		String path = jsonObject.getString("path");
		model.addAttribute("files", getFiles(path).toString());
		model.addAttribute("path", path);
		return "files/pic";
	}

	/**
	 * 获取某个路径下的图片列表
	 * 
	 * @auther weixiaokai
	 * @date 2017年12月29日 上午9:06:24
	 * @param path
	 */
	public static JSONArray getFiles(String path) {
		JSONArray jsonArray = new JSONArray(); // 返回值
		List<String> lstr = new ArrayList<String>();
		File file = new File(path);
		if (file.exists()) {
			File[] tmpFiles = file.listFiles();
			for (int i = 0; i < tmpFiles.length; i++) {
				if (tmpFiles[i].isFile() && !(tmpFiles[i].getName().endsWith(".txt"))) {
					JSONObject jsonObject = new JSONObject();
					jsonObject.put("name", tmpFiles[i].getName());
					try {
						jsonObject.put("path", URLEncoder.encode(tmpFiles[i].getPath(), "UTF-8"));
					} catch (UnsupportedEncodingException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
					jsonArray.add(jsonObject);
				} else if (tmpFiles[i].getName().endsWith(".txt")) {// 读取txt种子文件
					File txtFile = tmpFiles[i];
					BufferedReader reader = null;
					try {
						reader = new BufferedReader(new FileReader(txtFile));
						String s = null;
						while ((s = reader.readLine())!=null) {
							lstr.add(s);
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
				jsonArray.getJSONObject(i).put("can_choose", "1");//不可选
			} else {
				jsonArray.getJSONObject(i).put("can_choose", "0");//可选
			}
		}
		return jsonArray;
	}

	/**
	 * 删除文件
	 * 
	 * @auther weixiaokai
	 * @date 2017年12月29日 上午9:14:31
	 * @param request
	 * @param requestJson
	 * @return
	 */
	@RequestMapping(value = "/deleteFiles", method = RequestMethod.POST)
	@ResponseBody
	public AjaxResponse deleteFile(HttpServletRequest request, @RequestBody String requestJson) {
		JSONObject jsonObject = JSONObject.fromObject(requestJson);
		JSONArray jsonArray = jsonObject.getJSONArray("paths");
		for (Object json : jsonArray) {
			String path = null;
			try {
				path = URLDecoder.decode(((JSONObject) json).getString("path"),"UTF-8");
			} catch (UnsupportedEncodingException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				AjaxResponse.toFailure(1, "该文件已经被删除");
			}
			File file = new File(path);
			file.delete();
		}
		return AjaxResponse.toSuccess("删除成功");
	}

	/**
	 * 
	 * @auther weixiaokai
	 * @date 2017年12月29日 上午11:17:15
	 * @param request
	 * @param response
	 * @param path
	 * @throws IOException
	 */
	@RequestMapping(value = "/getPic", method = RequestMethod.GET)
	public void getPic(HttpServletRequest request, HttpServletResponse response,
			@RequestParam(value = "path", required = true) String path) throws IOException {
		ServletOutputStream out = null;
		FileInputStream ips = null;
		try {
			ips = new FileInputStream(new File(URLDecoder.decode(path, "UTF-8")));
			response.setContentType("multipart/form-data");
			out = response.getOutputStream();
			// 读取文件流
			int len = 0;
			byte[] buffer = new byte[1024 * 10];
			while ((len = ips.read(buffer)) != -1) {
				out.write(buffer, 0, len);
			}
			out.flush();
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			out.close();
			ips.close();
		}
	}
	
	@RequestMapping(value = "/moveFiles", method = RequestMethod.POST)
	@ResponseBody
	public AjaxResponse moveFiles(HttpServletRequest request, @RequestBody String requestJson) {
		String endPath = request.getSession().getAttribute("endPath")==null?Constant.ROOT_FILE_ENDPATH:request.getSession().getAttribute("endPath").toString();//移动的目标路径
        if (endPath.isEmpty()) {
			endPath = Constant.ROOT_FILE_ENDPATH;
		}
		JSONObject jsonObject = JSONObject.fromObject(requestJson);
		JSONArray jsonArray = jsonObject.getJSONArray("paths");
		for (Object json : jsonArray) {
			String path = null;
			try {
				path = URLDecoder.decode(((JSONObject) json).getString("path"),"UTF-8");
			} catch (UnsupportedEncodingException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				AjaxResponse.toFailure(1, "该文件已经被转移");
			}
			File file = new File(path);
			file.getName();
			if(file.renameTo(new File(endPath+file.getName()))){
				logger.info("文件移动成功！从"+path+"移动到"+endPath+file.getName());
			}else{
				logger.info("文件移动失败！原地址"+path);
				//AjaxResponse.toSuccess("转移失败");
			}
		}
		return AjaxResponse.toSuccess("移动成功");
	}
	
	@RequestMapping(value = "/setPath", method = RequestMethod.POST)
	@ResponseBody
	public AjaxResponse setPath(HttpServletRequest request, @RequestBody String requestJson) {
		
		JSONObject jsonObject = JSONObject.fromObject(requestJson);
		String  endPath = jsonObject.getString("endPath");
		File file = new File(endPath);
		if (!file.exists()) {
			if (!file.mkdirs()) {//创建文件夹,true成功,false失败
				return AjaxResponse.toFailure(1, "目录创建失败");
			}
		}
		request.getSession().setAttribute("endPath", file.getPath()+file.separator);
		logger.info("文件路径设置为:"+file.getPath());
		return AjaxResponse.toSuccess("移动成功");
	}
}
