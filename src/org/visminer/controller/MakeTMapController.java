package org.visminer.controller;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.json.JSONObject;

@Path("makeMap")
public class MakeTMapController {
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("get-map-json")
	public String getMapJson(@QueryParam("mapInfo") String mapInfo) {
		System.out.println("MAPINFO: "+mapInfo);
		return "";
	}
}
