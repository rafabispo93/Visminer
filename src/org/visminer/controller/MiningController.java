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

import org.repositoryminer.codesmell.clazz.BrainClass;
import org.repositoryminer.codesmell.clazz.BrainMethod;
import org.repositoryminer.codesmell.clazz.ComplexMethod;
import org.repositoryminer.codesmell.clazz.GodClass;
import org.repositoryminer.codesmell.clazz.LongMethod;
import org.repositoryminer.codesmell.project.DuplicatedCode;
import org.repositoryminer.metric.clazz.ATFD;
import org.repositoryminer.metric.clazz.CYCLO;
import org.repositoryminer.metric.clazz.LOC;
import org.repositoryminer.metric.clazz.LVAR;
import org.repositoryminer.metric.clazz.MAXNESTING;
import org.repositoryminer.metric.clazz.MLOC;
import org.repositoryminer.metric.clazz.NOA;
import org.repositoryminer.metric.clazz.NOAV;
import org.repositoryminer.metric.clazz.NOM;
import org.repositoryminer.metric.clazz.PAR;
import org.repositoryminer.metric.clazz.TCC;
import org.repositoryminer.metric.clazz.WMC;
import org.repositoryminer.metric.project.NOC;
import org.repositoryminer.metric.project.NOP;
import org.repositoryminer.mining.RepositoryMiner;
import org.repositoryminer.model.Reference;
import org.repositoryminer.parser.java.JavaParser;
import org.repositoryminer.scm.ISCM;
import org.repositoryminer.scm.ReferenceType;
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
			rm.addReference(ref.getPath(),ReferenceType.TAG);
		}
		
//		for (String metric : request.getMetrics()) {
//			rm.addClassMetric(MetricFactory.getMetric(metric));
//		}
		
		rm.addClassMetric(new ATFD());
		rm.addClassMetric(new CYCLO());
		rm.addClassMetric(new LOC());
		rm.addClassMetric(new LVAR());
		rm.addClassMetric(new MAXNESTING());
		rm.addClassMetric(new MLOC());
		rm.addClassMetric(new NOA());
		rm.addClassMetric(new NOAV());
		rm.addClassMetric(new NOM());
		rm.addClassMetric(new PAR());
		rm.addClassMetric(new TCC());
		rm.addClassMetric(new WMC());
		rm.addProjectCodeSmell(new DuplicatedCode());
		
		rm.addProjectMetric(new NOP());
		rm.addProjectMetric(new NOC());
		
		rm.addClassCodeSmell(new BrainClass());
		rm.addClassCodeSmell(new BrainMethod());
		rm.addClassCodeSmell(new ComplexMethod());
		rm.addClassCodeSmell(new GodClass());
		rm.addClassCodeSmell(new LongMethod());
		try {
			rm.mine();
			System.out.println("Terminated!!!!!!!");
			return Response.status(Response.Status.OK).build();
		} catch (IOException e) {
			Logger.getLogger(MiningController.class.getName()).log(Level.SEVERE, null, e);
            throw new WebApplicationException(Response.Status.INTERNAL_SERVER_ERROR);
		}
	}
	
}