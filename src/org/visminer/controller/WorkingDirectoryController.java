package org.visminer.controller;

import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import java.io.StringReader;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonObject;
import javax.json.JsonReader;
import javax.json.JsonValue;

import org.json.JSONObject;

import org.bson.Document;
import org.repositoryminer.persistence.handler.WorkingDirectoryDocumentHandler;
import org.visminer.util.UtilsString;


@Path("wDirectories")
public class WorkingDirectoryController {
	private WorkingDirectoryDocumentHandler directoryHandler = new WorkingDirectoryDocumentHandler();
	private UtilsString us = new UtilsString();
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("get-by-id")
	public String getDirectory(@QueryParam("fileHash") String fileHash) {
		List<String> metricList = new ArrayList<>();
		Document data = new Document();
		data = directoryHandler.findById(fileHash, null);
		
		JsonReader reader = Json.createReader(new StringReader(data.toJson()));
        JsonObject dataJson = reader.readObject();
        reader.close();
        
        JsonArray filesArray = dataJson.getJsonArray("files");
        JsonArray checkoutArray = dataJson.getJsonArray("checkout");
        System.out.println("Processing");
        for (JsonValue jsonValue : filesArray) {
        	JSONObject jo = new JSONObject(jsonValue.toString());
            String infoFiles = us.encodeToCRC32(jo.getString("file"));
            String infoCheckouts = jo.getString("checkout");
            //System.out.println("Checkout: "+infoCheckouts+ ", File: "+infoFiles + ", Lenght: " +infoFiles.length());
            String info = us.getMetricsByCommit(infoFiles,infoCheckouts);
            if (info != "") {
            	//System.out.println("INFO: "+info);
            	metricList.add(info);
            }
            //metricList.add(info);
        }
		//metricList.add(data.toJson());
        System.out.println("Done");
		return metricList.toString();
	}
}
