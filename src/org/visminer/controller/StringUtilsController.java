package org.visminer.controller;

import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.bson.Document;
import org.repositoryminer.utility.StringUtils;

@Path("stringUtils")
public class StringUtilsController {
	private StringUtils util = new StringUtils();
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("encodeToCRC32")
	public String encodeToCRC32(@QueryParam("input") String input) {
		List<String> encodeList = new ArrayList<>();
		Long data;
		System.out.println(input);
		data = StringUtils.encodeToCRC32(input);
		//encodeList.add(data.toJson());
		System.out.println("AQUIII");
		System.out.println(data);
		encodeList.add(data.toString());
		return data.toString();
	}
}
