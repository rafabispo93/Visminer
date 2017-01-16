package org.visminer.controller;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

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
import org.visminer.util.MakeTMap;
import org.visminer.util.UtilsString;


@Path("wDirectories")
public class WorkingDirectoryController {
	private WorkingDirectoryDocumentHandler directoryHandler = new WorkingDirectoryDocumentHandler();
	private UtilsString us = new UtilsString();
	private MakeTMap mTm = new MakeTMap();
	
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("get-by-id")
	public String getDirectory(@QueryParam("fileHash") String fileHash, @QueryParam("fileHash2") String fileHash2,  @QueryParam("strategy") String strategy) {
		List<String> metricList = new ArrayList<>();
		List<String> metricList2 = new ArrayList<>();
		Map<String, JSONObject> items = new HashMap<String, JSONObject>();
		Map<String, JSONObject> items2 = new HashMap<String, JSONObject>();
		JSONObject packages1 = new JSONObject();
		JSONObject packages2 = new JSONObject();
		//JSONObject result = new JSONObject();
		Document data = new Document();
		Document data2 = new Document();
		data = directoryHandler.findById(fileHash);
		data2 = directoryHandler.findById(fileHash2);
		JsonReader reader = Json.createReader(new StringReader(data.toJson()));
        JsonObject dataJson = reader.readObject();
        reader.close();
        
        JsonReader reader2 = Json.createReader(new StringReader(data2.toJson()));
        JsonObject dataJson2 = reader2.readObject();
        reader2.close();
        
        
        JsonArray filesArray = dataJson.getJsonArray("files");
        JsonArray filesArray2 = dataJson2.getJsonArray("files");
        //JsonArray checkoutArray = dataJson.getJsonArray("checkout");
        System.out.println(strategy);
        System.out.println("Processing " + fileHash);
        for (JsonValue jsonValue : filesArray) {
        	JSONObject jo = new JSONObject(jsonValue.toString());
            String infoFiles = us.encodeToCRC32(jo.getString("file"));
            String infoCheckouts = jo.getString("checkout");
            String info = us.getMetricsByCommit(infoFiles,infoCheckouts);
            if (info != "") {
            	try{
            		JSONObject obj = new JSONObject(info.toString());
                	//JSONObject obj2 = new JSONObject(obj.getJSONArray("abstract_types").get(0).toString());
            		JSONObject obj2 = new JSONObject(obj.getJSONArray("abstract_types").get(0).toString());
                	packages1.append(obj.getString("package"), obj2);
                    items.put(obj.getString("package").toString(), obj2);
            	}
            	catch (Exception e) {
            		//System.out.println("Error");
            	}
            	metricList.add(info);
            }
        }
        System.out.println("Done");
        
        
        System.out.println("Processing " + fileHash2);
        for (JsonValue jsonValue2 : filesArray2) {
        	JSONObject jo = new JSONObject(jsonValue2.toString());
            String infoFiles = us.encodeToCRC32(jo.getString("file"));
            String infoCheckouts = jo.getString("checkout");
            String info = us.getMetricsByCommit(infoFiles,infoCheckouts);
            if (info != "") {
            	try{
            		JSONObject obj = new JSONObject(info.toString());
                	JSONObject obj2 = new JSONObject(obj.getJSONArray("abstract_types").get(0).toString());
                	packages2.append(obj.getString("package"), obj2);
                	items2.put(obj.getString("package").toString(), obj2);
            	}
            	catch (Exception e) {
            		//System.out.println("Error");
            	}
            	
            	metricList2.add(info);
            }
        }
        System.out.println("Done" + packages1.length() + " , " + packages2.length());
        
        JSONObject packagesResult = new JSONObject();
        packagesResult.put("commit1", packages1);
        packagesResult.put("commit2", packages2);
       if (strategy.equals("1")) {
    	   return mTm.differentialAbsolute(packagesResult);
       }
       else {
    	   System.out.println(packages1.toString().equals(packages2.toString()));
    	   return metricList.toString();
       }
	}
	
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("get-by-id-single")
	public String getDirectorySingle(@QueryParam("fileHash") String fileHash) { 
		
		List<String> metricList = new ArrayList<>();
		Map<String, JSONObject> items = new HashMap<String, JSONObject>();
		JSONObject packages1 = new JSONObject();
		//JSONObject result = new JSONObject();
		Document data = new Document();
		data = directoryHandler.findById(fileHash);
		JsonReader reader = Json.createReader(new StringReader(data.toJson()));
        JsonObject dataJson = reader.readObject();
        reader.close();
        
        
        JsonArray filesArray = dataJson.getJsonArray("files");
        //JsonArray checkoutArray = dataJson.getJsonArray("checkout");
        System.out.println("Processing " + fileHash);
        for (JsonValue jsonValue : filesArray) {
        	JSONObject jo = new JSONObject(jsonValue.toString());
            String infoFiles = us.encodeToCRC32(jo.getString("file"));
            String infoCheckouts = jo.getString("checkout");
            String info = us.getMetricsByCommit(infoFiles,infoCheckouts);
            if (info != "") {
            	try{
            		JSONObject obj = new JSONObject(info.toString());
                	//JSONObject obj2 = new JSONObject(obj.getJSONArray("abstract_types").get(0).toString());
            		JSONObject obj2 = new JSONObject(obj.getJSONArray("abstract_types").get(0).toString());
                	packages1.append(obj.getString("package"), obj2);
                    items.put(obj.getString("package").toString(), obj2);
            	}
            	catch (Exception e) {
            		//System.out.println("Error");
            	}
            	metricList.add(info);
            }
        }
        System.out.println("Done");
		
		return metricList.toString();
	}
	
	
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("get-by-id-relative")
	public String getDirectoryRelative(@QueryParam("fileHash") String fileHash, @QueryParam("fileHash2") String fileHash2, @QueryParam("chosenMetric") int chosenMetric) { 
		List<String> metricList = new ArrayList<>();
		Map<String, JSONObject> items = new HashMap<String, JSONObject>();
		JSONObject packages1 = new JSONObject();
		Document data = new Document();
		data = directoryHandler.findById(fileHash);
		JsonReader reader = Json.createReader(new StringReader(data.toJson()));
        JsonObject dataJson = reader.readObject();
        reader.close();
        
        
        JsonArray filesArray = dataJson.getJsonArray("files");
        System.out.println("Processing " + fileHash);
        for (JsonValue jsonValue : filesArray) {
        	JSONObject jo = new JSONObject(jsonValue.toString());
            String infoFiles = us.encodeToCRC32(jo.getString("file"));
            String infoCheckouts = jo.getString("checkout");
            String info = us.getMetricsByCommit(infoFiles,infoCheckouts);
            if (info != "") {
            	try{
            		JSONObject obj = new JSONObject(info.toString());
            		JSONObject obj2 = new JSONObject(obj.getJSONArray("abstract_types").get(0).toString());
                	packages1.append(obj.getString("package"), obj2);
                    items.put(obj.getString("package").toString(), obj2);
            	}
            	catch (Exception e) {
            		//System.out.println("Error");
            	}
            	metricList.add(info);
            }
        }
        System.out.println("Done");
        
        
        List<String> metricList2 = new ArrayList<>();
		Map<String, JSONObject> items2 = new HashMap<String, JSONObject>();
		JSONObject packages2 = new JSONObject();
		Document data2 = new Document();
		data2 = directoryHandler.findById(fileHash2);
		JsonReader reader2 = Json.createReader(new StringReader(data2.toJson()));
        JsonObject dataJson2 = reader2.readObject();
        reader2.close();
        
        
        JsonArray filesArray2 = dataJson2.getJsonArray("files");
        System.out.println("Processing " + fileHash2);
        for (JsonValue jsonValue2 : filesArray2) {
        	JSONObject jo2 = new JSONObject(jsonValue2.toString());
            String infoFiles2 = us.encodeToCRC32(jo2.getString("file"));
            String infoCheckouts2 = jo2.getString("checkout");
            String info2 = us.getMetricsByCommit(infoFiles2,infoCheckouts2);
            if (info2 != "") {
            	try{
            		JSONObject obj = new JSONObject(info2.toString());
            		JSONObject obj2 = new JSONObject(obj.getJSONArray("abstract_types").get(0).toString());
                	packages2.append(obj.getString("package"), obj2);
                    items2.put(obj.getString("package").toString(), obj2);
            	}
            	catch (Exception e) {
            		//System.out.println("Error");
            	}
            	metricList2.add(info2);
            }
        }
        System.out.println("Done");
		//mTm.differentialRelative(metricList, metricList2);
        JSONObject packagesResult = new JSONObject();
        packagesResult.put("commit1", packages1);
        packagesResult.put("commit2", packages2);
        mTm.differentialRelative(packagesResult, chosenMetric); 
		return mTm.differentialRelative(packagesResult, chosenMetric).toString();
	}
}
