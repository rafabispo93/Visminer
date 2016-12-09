package org.visminer.controller;


import java.util.ArrayList;
import java.util.List;
import java.util.Set;

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
		data = commitHandler.findById(commitId);
		commitList.add(data.toJson());
		return commitList.toString();	
	}
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("get-all-commits")
	public String getAllCommits(@QueryParam("repositoryId") String repository, @QueryParam("commitsId") List<String> commitsId) {
		List<String> commitList = new ArrayList<>();
		List<Document> data = new ArrayList<Document>();
		data = commitHandler.findByIdColl(repository, commitsId, null);
		
		for (Document commit : data) {
			commitList.add(commit.toJson());
		}
		return commitList.toString();	
	}
}
