package org.visminer.controller;

import java.util.ArrayList;
import java.util.List;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.repositoryminer.persistence.handler.ReferenceDocumentHandler;
@Path("tags")
public class ReferenceController {
	
	private ReferenceDocumentHandler referenceHandler = new ReferenceDocumentHandler();
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("get-tags")
	public String getTags(@QueryParam("repositoryId") String repositoryId) {
		List<String> referenceList = new ArrayList<>();
		referenceHandler.getByRepository(repositoryId)
			.forEach(reference->referenceList.add(reference.toJson()));
		return referenceList.toString();
	}
}
