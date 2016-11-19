package org.visminer.controller;


import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.bson.Document;
import org.repositoryminer.persistence.handler.CommitDocumentHandler;
@Path("commits")
public class CommitController {
	private CommitDocumentHandler commitHandler = new CommitDocumentHandler();
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("get-commit")
	public String getCommits(@QueryParam("commitId") String commitId) {
		List<String> commitList = new ArrayList<>();
		Document data = new Document();
		System.out.println(commitId);
		data = commitHandler.findById(commitId);
		commitList.add(data.toJson());
		System.out.println(commitList);
		return commitList.toString();	
	}
}
