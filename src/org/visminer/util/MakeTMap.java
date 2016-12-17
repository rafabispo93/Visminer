package org.visminer.util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONObject;

public class MakeTMap {
	public String organizeJson (Map<String, JSONObject> items, Map<String, JSONObject> items2, String chosenMetric) {
  		List<JSONObject> mapInfo = new ArrayList<JSONObject>();
		for (String pack : items.keySet()) {
			if(items2.containsKey(pack)) {
				JSONObject obj = new JSONObject(items.get(pack).toString());
				JSONObject obj2 = new JSONObject(items2.get(pack).toString());
				if(obj.get("name").equals(obj2.get("name"))) {
					JSONArray metricsArray = new JSONArray(obj.get("metrics").toString());
					JSONArray metricsArray2 = new JSONArray(obj2.get("metrics").toString());
					JSONObject metrics = new JSONObject(metricsArray.get(0).toString());
					JSONObject metrics2 = new JSONObject(metricsArray2.get(0).toString());
					int metricsSize = metrics.getJSONArray("methods").length();
					int metricsSize2 = metrics2.getJSONArray("methods").length();

					for (int a = 0; a < metricsSize; a++) {
						JSONObject methods = new JSONObject(metrics.getJSONArray("methods").get(a).toString());
						for (int b = 0; b < metricsSize2; b++) {
							JSONObject infoToPut = new JSONObject();
							JSONObject methods2 = new JSONObject(metrics2.getJSONArray("methods").get(b).toString());
							infoToPut.put("package",pack);
							infoToPut.put("filename", obj.get("name"));
							mapInfo.add(infoToPut);
							if (methods.get("method").equals(methods2.get("method"))) {
//								System.out.println(methods.get("method"));
//								System.out.println(methods2.get("method"));
								JSONArray methodsToPut = new JSONArray();
								methodsToPut.put(methods.get("method"));
								infoToPut.put("methods", methodsToPut);
								
							}
							
							
							
						}
					}
				}
				
			}
		}
		System.out.println(mapInfo);
		return "";
	}
}
