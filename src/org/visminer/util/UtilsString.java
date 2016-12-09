package org.visminer.util;

import java.util.ArrayList;
import java.util.List;



import org.bson.Document;
import org.repositoryminer.persistence.handler.CommitAnalysisDocumentHandler;
import org.repositoryminer.utility.StringUtils;

public class UtilsString {
	private CommitAnalysisDocumentHandler typeHandler = new CommitAnalysisDocumentHandler();
	
	public String encodeToCRC32(String input) {
		List<String> encodeList = new ArrayList<>();
		Long data;
		data = StringUtils.encodeToCRC32(input);
		encodeList.add(data.toString());
		return data.toString();
	}
	
	public String getMetricsByCommit(String fileHash, String commitHash) {
		List<String> metricList = new ArrayList<>();
		Document data = new Document();
		long hash = Long.parseLong(fileHash, 10);
		try {
			data = typeHandler.getMetricsMeasures(hash, commitHash);
			//data = typeHandler.getMetricsByHash(hash);
			metricList.add(data.toJson());
			return data.toJson();
		}
		catch (Exception e) {
			return "";
		}
	}
}
