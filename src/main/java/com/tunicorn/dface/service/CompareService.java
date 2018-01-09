package com.tunicorn.dface.service;

import org.springframework.stereotype.Service;

import com.tunicorn.common.api.RestAPIResponse;
import com.tunicorn.common.entity.UploadFile;
//import com.tunicorn.dface.bo.OneToOneCompareBO;
import com.tunicorn.dface.param.OneToOneCompareRequestParam;
import com.tunicorn.dface.utils.ServiceUtils;

@Service
public class CompareService extends BaseService {

	/*public RestAPIResponse callOneToOneCompare(OneToOneCompareBO csBO) {
		OneToOneCompareRequestParam params = new OneToOneCompareRequestParam();

		String imagePath1 = "";
		UploadFile file1 = DynamicFaceStorageUtils.getUploadFile(csBO.getImage1(), 1, 1, true);
		imagePath1 = file1.getPath();

		String imagePath2 = "";
		UploadFile file2 = DynamicFaceStorageUtils.getUploadFile(csBO.getImage2(), 1, 1, true);
		imagePath2 = file2.getPath();

		params.setImg_url1(imagePath1);
		params.setImg_url2(imagePath2);

		return ServiceUtils.oneToOneCompare(params);
	}*/
}
