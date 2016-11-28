package org.visminer.controller;

import java.io.IOException;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.repositoryminer.mining.RepositoryMiner;
import org.repositoryminer.model.Reference;
import org.repositoryminer.parser.java.JavaParser;
import org.repositoryminer.scm.ISCM;
import org.repositoryminer.scm.SCMFactory;
import org.repositoryminer.scm.SCMType;
import org.visminer.model.MiningRequest;
import org.visminer.util.MetricFactory;

@Path("mining")
public class MiningController {

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("get-references")
	public List<Reference> getReferences(@QueryParam("scm") String scmCode, @QueryParam("path") String path) {
		SCMType scmType = SCMType.valueOf(scmCode);
		ISCM scm = SCMFactory.getSCM(scmType);
		
		scm.open(path);
		List<Reference> references = scm.getReferences();
		scm.close();
		
		return references;
	}
	
	@PUT
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("mine")
	public Response mine(MiningRequest request) {
		RepositoryMiner rm = new RepositoryMiner();
		rm.setName(request.getName());
		rm.setDescription(request.getDescription());
		rm.setPath(request.getPath());
		rm.setScm(request.getScm());
		
		rm.addParser(new JavaParser());
		
		for (Reference ref : request.getReferences()) {
			rm.addReference(ref.getPath(),null);
		}
		
		for (String metric : request.getMetrics()) {
			rm.addClassMetric(MetricFactory.getMetric(metric));
		}
		
		try {
			rm.mine();
			return Response.status(Response.Status.OK).build();
		} catch (IOException e) {
			Logger.getLogger(MiningController.class.getName()).log(Level.SEVERE, null, e);
            throw new WebApplicationException(Response.Status.INTERNAL_SERVER_ERROR);
		}
	}
	
}