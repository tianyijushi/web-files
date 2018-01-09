package com.tunicorn.dface.text;

import java.io.File;

import com.tunicorn.dface.Constant;

public class ReadDirectory {

	        // 文件所在的层数
	        private int fileLevel;
//	        private static 

	        /**
	         * 生成输出格式
	         * @param name 输出的文件名或目录名
	         * @param level 输出的文件名或者目录名所在的层次
	         * @return 输出的字符串
	         */
	        public String createPrintStr(String name, int level) {
	                // 输出的前缀
	                String printStr = "";
	                // 按层次进行缩进
	                for (int i = 0; i < level; i ++) {
	                        printStr  = printStr + "  ";
	                }
	                printStr = printStr + "- " + name;
	                return printStr;
	        }

	        /**
	         * 输出初始给定的目录
	         * @param dirPath 给定的目录
	         */
	        public void printDir(String dirPath){
	                // 将给定的目录进行分割
	                String[] dirNameList = dirPath.split("\\\\");
	                // 设定文件level的base
	                fileLevel = dirNameList.length;
	                // 按格式输出
	                for (int i = 0; i < dirNameList.length; i ++) {
	                        System.out.println(createPrintStr(dirNameList[i], i));
	                }
	        }

	        /**
	         * 输出给定目录下的文件，包括子目录中的文件
	         * @param dirPath 给定的目录
	         */
	        public void readFile(String dirPath) {
	                // 建立当前目录中文件的File对象
	                File file = new File(dirPath);
	                // 取得代表目录中所有文件的File对象数组
	                File[] list = file.listFiles();
	                // 遍历file数组
	                for (int i = 0; i < list.length; i++) {
	                        if (list[i].isDirectory()) {
	                                System.out.println(createPrintStr(list[i].getName(), fileLevel));
	                                fileLevel ++;
	                                // 递归子目录
	                                readFile(list[i].getPath());
	                                fileLevel --;
	                        } else {
	                                System.out.println(createPrintStr(list[i].getName(), fileLevel));
	                        }
	                }
	        }
	        
	        public static void main(String[] args) {
	                ReadDirectory rd = new ReadDirectory();
	                String dirPath = Constant.ROOT_FILE_PATH;
	                rd.printDir(dirPath);
	                rd.readFile(dirPath);
	        }
}
