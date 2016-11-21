package org.visminer.controller;

import static com.mongodb.client.model.Projections.*;
import java.util.ArrayList;
import java.util.List;
import org.bson.Document;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.repositoryminer.persistence.handler.CommitAnalysisDocumentHandler;

@Path("get-metrics")
public class MetricController {
	private CommitAnalysisDocumentHandler typeHandler = new CommitAnalysisDocumentHandler();
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("get-byCommit")
	public String getMetricsByCommit(@QueryParam("idCommit") String idCommit, @QueryParam("fileHash") String fileHash) {
		List<String> metricList = new ArrayList<>();
		Document data = new Document();
		long hash = Long.parseLong(fileHash, 10);
		System.out.println(idCommit);
		data = typeHandler.getMetricsMeasures(hash, idCommit);
		metricList.add(data.toJson());
		System.out.println(metricList);
		return metricList.toString();
	}
	
}
