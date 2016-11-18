package org.visminer.controller;

import java.util.ArrayList;
import java.util.List;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.repositoryminer.persistence.handler.RepositoryDocumentHandler;
@Path("repository")
public class RepositoryController {
	
	private RepositoryDocumentHandler repositoryHandler = new RepositoryDocumentHandler();
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("get-repositories")
	public String getRepositories() {
		List<String> repositoryList = new ArrayList<>();
		repositoryHandler.findAll(null)
			.forEach(repository->repositoryList.add(repository.toJson()));
		return repositoryList.toString();
	}
	

}
