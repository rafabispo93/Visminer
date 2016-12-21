package org.visminer.controller;

import java.util.ArrayList;
import java.util.List;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import org.bson.Document;
import org.json.JSONObject;
import org.repositoryminer.model.Reference;
import org.repositoryminer.persistence.handler.ReferenceDocumentHandler;
import org.repositoryminer.scm.ReferenceType;

import com.mongodb.client.model.Projections;
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
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("get-tags-reference")
	public String getTagReference(@QueryParam("tag") String tag, @QueryParam("repositoryId") String repositoryId) {
		JSONObject infoToPut = new JSONObject();
		Document r = referenceHandler.findByNameAndType(tag, ReferenceType.TAG, repositoryId, Projections.include("_id"));
		String id = r.get("_id").toString();
		Document doc = referenceHandler.findById(id,
				Projections.fields(Projections.include("commits"), Projections.slice("commits", 1)));

		String lastCommit = ((List<String>) doc.get("commits")).get(0);
		infoToPut.put("commit", lastCommit);
		return infoToPut.toString();
	}
}
