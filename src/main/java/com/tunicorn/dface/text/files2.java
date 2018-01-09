package com.tunicorn.dface.text;

import java.io.File;
import java.util.HashMap;

import com.tunicorn.dface.Constant;

public class files2 {
	public static void main(String[] args) {  
        String static_root=Constant.ROOT_FILE_PATH;  
       // String static_root= Starter.prop.getProperty("static_root");  
        String json=dir2json(static_root);  
        System.out.println(json);  
    }  
  
    public static String  dir2json(String dir_path){  
        HashMap<String ,Object> dirMap=new HashMap<String ,Object>();  
        File root=new File(dir_path);  
        dir2map(root,dirMap);  
        String json = dirMap.get(root.getName()).toString();  
		return json;  
    }  
  
    public static boolean shouldSkip(String filename){  
        return filename.startsWith(".");  
    }  
  
    /** 
     * 
     * @param node 文件节点 
     * @param dirMap 表示文件所在目录的map 
     */  
    public static void dir2map(File node,HashMap<String ,Object> dirMap){  
        //跳过隐藏文件等  
        if(shouldSkip(node.getName())){  
            return;  
        }  
        //是文件，保存文件名和最后修改时间戳  
        if(node.isFile()){  
            dirMap.put(node.getName(),node.lastModified());  
        }  
        //是目录，建立下一层map，并填充  
        if(node.isDirectory()){  
            HashMap<String ,Object> subDir=new HashMap<String ,Object>();  
            dirMap.put(node.getName(),subDir);  
            for(String filename:node.list()){  
                dir2map(new File(node,filename),subDir);//填充  
            }  
        }  
  
    }  
  
}
