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
  		JSONObject infoToPut = new JSONObject();
  		JSONObject infoToPut2 = new JSONObject();
  		
		for (String pack : items.keySet()) {
			System.out.println(pack);
			for (String pack2 : items2.keySet()) {
				if(pack.equals(pack2)) {
					
					JSONObject obj = new JSONObject(items.get(pack).toString());
					JSONObject obj2 = new JSONObject(items2.get(pack2).toString());
					System.out.println(obj +", " + obj2);
					if(obj.get("name").equals(obj2.get("name"))) {
						JSONArray metricsArray = new JSONArray(obj.get("metrics").toString());
						JSONArray metricsArray2 = new JSONArray(obj2.get("metrics").toString());
						JSONObject metrics = new JSONObject(metricsArray.get( Integer.parseInt(chosenMetric)).toString());
						JSONObject metrics2 = new JSONObject(metricsArray2.get(Integer.parseInt(chosenMetric)).toString());
						int metricsSize = metrics.getJSONArray("methods").length();
						int metricsSize2 = metrics2.getJSONArray("methods").length();
						JSONObject methodsToPut = new JSONObject();
						JSONObject classToPut = new JSONObject();
						JSONObject methodsToPut2 = new JSONObject();
						JSONObject classToPut2 = new JSONObject();
						
						for (int a = 0; a < metricsSize; a++) {
							JSONObject methods = new JSONObject(metrics.getJSONArray("methods").get(a).toString());
							for (int b = 0; b < metricsSize2; b++) {
								JSONObject methods2 = new JSONObject(metrics2.getJSONArray("methods").get(b).toString());
								
								if (methods.get("method").equals(methods2.get("method"))) {
									//System.out.println("METHOD: "+methods.get("method")+ ", PACKAGE: " + pack + ", CLASS: " + obj.get("name"));
									int result = Integer.parseInt(methods.get("value").toString()) - Integer.parseInt(methods2.get("value").toString());
									methodsToPut.accumulate(methods.get("method").toString(), result);
									classToPut.put(obj.get("name").toString(),methodsToPut);
									infoToPut.put(pack.toString(),classToPut);
									
//									methodsToPut2.accumulate(methods2.get("method").toString(), Integer.parseInt(methods2.get("value").toString()));
//									classToPut2.put(obj2.get("name").toString(),methodsToPut2);
//									infoToPut2.put(pack2.toString(),classToPut2);
									
									mapInfo.add(infoToPut);
									//System.out.println(methods.get("value") + ", " + methods2.get("value"));

									
								}
								
								
								
							}
						}
					}
						
					}
			}
			
			
		}
		System.out.println(infoToPut);
		return infoToPut.toString();
	}
}
