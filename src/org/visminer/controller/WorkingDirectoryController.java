package org.visminer.controller;

import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.bson.Document;
import org.repositoryminer.persistence.handler.WorkingDirectoryDocumentHandler;

@Path("wDirectories")
public class WorkingDirectoryController {
	private WorkingDirectoryDocumentHandler directoryHandler = new WorkingDirectoryDocumentHandler();
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("get-by-id")
	public String getDirectory(@QueryParam("fileHash") String fileHash) {
		List<String> metricList = new ArrayList<>();
		Document data = new Document();
		System.out.println(fileHash);
		data = directoryHandler.findById(fileHash, null);
		metricList.add(data.toJson());
		return metricList.toString();
	}
}
