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
	public String getDirectory(@QueryParam("fileHash") String fileHash, @QueryParam("commit") String commit) {
		List<String> metricList = new ArrayList<>();
		Document data = new Document();
		data = directoryHandler.findById(fileHash, null);
		
		JsonReader reader = Json.createReader(new StringReader(data.toJson()));
        JsonObject dataJson = reader.readObject();
        reader.close();
        
        JsonArray filesArray = dataJson.getJsonArray("files");
        JsonArray checkoutArray = dataJson.getJsonArray("checkout");
//        List<String> infoFiles = new ArrayList<String>();
//        List<String> infoCheckouts = new ArrayList<String>();
//        for (JsonValue jsonValue : checkoutArray) {
//        	System.out.println("Checkout"+jsonValue.toString());
//            
//        }
        for (JsonValue jsonValue : filesArray) {
        	JSONObject jo = new JSONObject(jsonValue.toString());
            String infoFiles = us.encodeToCRC32(jo.getString("file"));
            String infoCheckouts = jo.getString("checkout");
            System.out.println("Checkout: "+infoCheckouts+ ", File: "+infoFiles + ", Lenght: " +infoFiles.length());
            //JSONObject response = new JSONObject(info);
            //System.out.println("Dentro: " + info.toString() + "commitHash: " + dataJson.getString("_id"));
            //String info2 = us.getMetricsByCommit(info.toString(),dataJson.getString("_id"));
            String info2 = us.getMetricsByCommit(infoFiles,infoCheckouts);
            System.out.println(info2);
        }
        //System.out.println(dataJson);
		metricList.add(data.toJson());
		return metricList.toString();
	}
}
