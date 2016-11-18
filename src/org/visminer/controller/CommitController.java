package org.visminer.controller;

import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.repositoryminer.persistence.handler.CommitDocumentHandler;
@Path("commits")
public class CommitController {
	private CommitDocumentHandler commitHandler = new CommitDocumentHandler();
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("get-commits")
	public String getCommits(@QueryParam("repositoryId") String repositoryId) {
		List<String> commitList = new ArrayList<>();
		//commitHandler.getAllByRepository(repositoryId)
			//.forEach(commit->commitList.add(commit.toJson()));		
		
		return commitList.toString();	
	}
}
