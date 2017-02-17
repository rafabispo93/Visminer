package org.visminer.util;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.json.JsonValue;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class MakeTMap {
	
	
	public String parallelCoordinates (List<String> metricList, String eleClicked) {
		JSONObject response = new JSONObject();
//		metricList.size()
		for (int count = 0; count < metricList.size(); count++) {
			JSONObject listElement = new JSONObject(metricList.get(count).toString());
			JSONArray typesArray = (JSONArray) listElement.get("abstract_types");
			
			
			if(listElement.get("package").toString().contains(eleClicked.toString()) || listElement.get("filename").toString().endsWith(eleClicked.toString()) || eleClicked.toString().indexOf(')') >=0) {
				
				if(typesArray.length() > 0) {
					JSONObject zero = (JSONObject) typesArray.get(0);
					JSONArray metrics = (JSONArray) zero.get("metrics");
					int metricsSize = metrics.length();
					for (int x = 0; x < metricsSize; x++) {
						JSONObject metricInfo = (JSONObject) metrics.get(x);
						boolean resp = metricInfo.has("accumulated");
						boolean resp2 = metricInfo.has("methods");
						if(resp == true && (listElement.get("package").toString().contains(eleClicked.toString()) || listElement.get("filename").toString().endsWith(eleClicked.toString()))) {
							int value = Integer.parseInt(metricInfo.get("accumulated").toString());
							if (response.has(metricInfo.getString("name"))) {
								int aux = Integer.parseInt(response.get(metricInfo.get("name").toString()).toString()) ;
								value = value + aux;
								response.put(metricInfo.get("name").toString(), value);
							} else {
								response.put(metricInfo.get("name").toString(), value);
							}

						}
						
						
						if(resp2 == true) {
							JSONArray methods = (JSONArray)  metricInfo.get("methods");
							int methodsSize = methods.length();
							int value = 0;
//							System.out.println(eleClicked.toString());
							if(eleClicked.toString().indexOf(')') >=0) {
//								response.keySet().clear();
								
								for (int z = 0; z < methodsSize; z++) {
									JSONObject method = (JSONObject) methods.get(z);
//									System.out.println(method.get("method"));
									if (method.get("method").toString().equals(eleClicked.toString())) {
										value = Integer.parseInt(method.get("value").toString()) + value;
									}
									
								}
								if (response.has(metricInfo.getString("name"))) {
									int aux = Integer.parseInt(response.get(metricInfo.getString("name")).toString());
									response.put(metricInfo.get("name").toString(), value + aux);
								}
								else {
									response.put(metricInfo.get("name").toString(), value);
									
								}
							}
							else {
								if(listElement.get("package").toString().contains(eleClicked.toString()) || listElement.get("filename").toString().endsWith(eleClicked.toString())) {
									for (int z = 0; z < methodsSize; z++) {
										JSONObject method = (JSONObject) methods.get(z);
										value = Integer.parseInt(method.get("value").toString()) + value;
									}
									if (response.has(metricInfo.getString("name"))) {
										int aux = Integer.parseInt(response.get(metricInfo.getString("name")).toString());
										response.put(metricInfo.get("name").toString(), value + aux);
									}
									else {
										response.put(metricInfo.get("name").toString(), value);
									}
								}
								
							}
							
							
							
						}
					}
				}
			}
				
		}
		
		return response.toString();
	}
	
	
	public String differentialAbsolute (JSONObject packagesResult) {
		JSONObject packages1 = new JSONObject();
		JSONObject commit1 = new JSONObject(packagesResult.get("commit1").toString());
		JSONArray commit1Array = new JSONArray(commit1.keySet().toString());
		int commit1Size = commit1Array.length();
		
		
		JSONObject packages2 = new JSONObject();
		JSONObject commit2 = new JSONObject(packagesResult.get("commit2").toString());
		JSONArray commit2Array = new JSONArray(commit2.keySet().toString());
		int commit2Size = commit2Array.length();
		
		
		for (int a = 0; a < commit1Size; a++) {
			//System.out.println(commit1Array.get(a).toString());
			boolean resp = commit2.has(commit1Array.get(a).toString());
			if (resp == false) {
				JSONArray arr1 = new JSONArray(commit1.get(commit1Array.get(a).toString()).toString());
				for (int z = 0; z < arr1.length(); z++) {
					JSONObject jsonInfo = new JSONObject();
					JSONObject clazz1 = new JSONObject(arr1.get(z).toString());
					for (int b = 0; b < commit2Size; b++) {
						JSONArray arr2 = new JSONArray(commit2.get(commit2Array.get(b).toString()).toString());
						for (int y = 0; y < arr2.length(); y++) {
							JSONObject clazz2 = new JSONObject(arr2.get(y).toString());		
							jsonInfo.put("name", clazz1.get("name"));
							jsonInfo.put("metrics",clazz1.get("metrics"));				
						}		
					}
					packages1.append(commit1Array.get(a).toString(), jsonInfo);
				}
			}
			
		}
		
		// Infomation for second version
		
		for (int a = 0; a < commit2Size; a++) {
			boolean resp = commit1.has(commit2Array.get(a).toString());
			if (resp == false) {
				JSONArray arr2 = new JSONArray(commit2.get(commit2Array.get(a).toString()).toString()); 
				for (int z = 0; z < arr2.length(); z++) {
					JSONObject jsonInfo = new JSONObject();
					JSONObject clazz2 = new JSONObject(arr2.get(z).toString());
					for (int b = 0; b < commit1Size; b++) {
						JSONArray arr1 = new JSONArray(commit1.get(commit1Array.get(b).toString()).toString());
						for (int y = 0; y < arr1.length(); y++) {
							JSONObject clazz1 = new JSONObject(arr1.get(y).toString());
								jsonInfo.put("name", clazz2.get("name"));
								jsonInfo.put("metrics",clazz2.get("metrics"));
							
						}		
					}
					packages2.append(commit2Array.get(a).toString(), jsonInfo);
				}
			}
				
		}
		JSONObject packagesRes = new JSONObject();
        packagesRes.put("commit1", packages1);
        packagesRes.put("commit2", packages2);
		return packagesRes.toString();
	}

	public String differentialRelative(JSONObject packagesResult, int chosenMetric) {
		ArrayList keysVersion1 = new ArrayList();
		ArrayList keysVersion2 = new ArrayList();
		ArrayList commonPacks = new ArrayList();
		ArrayList objsVersion1 = new ArrayList();
		ArrayList objsVersion2 = new ArrayList();
		JSONObject version1 = (JSONObject) packagesResult.get("version1");
		JSONObject version2 = (JSONObject) packagesResult.get("version2");
		Iterator<?> keys1 = version1.keys();
		Iterator<?> keys2 = version2.keys();
		JSONObject r = new JSONObject();
		List<String> resultList = new ArrayList<>();
		
		while (keys1.hasNext()) {
			String key1 = (String)keys1.next();
			keysVersion1.add(key1);
		}
		
		while (keys2.hasNext()) {
			String key2 = (String)keys2.next();
			keysVersion2.add(key2);
		}
		
		for (int countV1 = 0; countV1 < keysVersion1.size(); countV1++) {
			for (int countV2 = 0; countV2 < keysVersion2.size(); countV2++) {
				if(keysVersion1.get(countV1).equals(keysVersion2.get(countV2))) {
					commonPacks.add(keysVersion1.get(countV1));
				}
			}
		}
		
		for (int count = 0; count < commonPacks.size(); count++) {
			objsVersion1.add(version1.get(commonPacks.get(count).toString()));
			objsVersion2.add(version2.get(commonPacks.get(count).toString()));
		}
		for (int x = 0; x < objsVersion1.size(); x++) {
			JSONArray classesVersion1 = (JSONArray) objsVersion1.get(x);
			JSONObject resOBJ3 = new JSONObject();
			for (int z = 0; z < classesVersion1.length(); z++) {
				JSONObject clazz = (JSONObject) classesVersion1.get(z);
//				System.out.println(clazz.get("name"));
				for (int x2 = 0; x2 < objsVersion2.size(); x2++) {
					JSONArray classesVersion2 = (JSONArray) objsVersion2.get(x2);
					
					for (int z2 = 0; z2 < classesVersion2.length(); z2++) {
						JSONObject clazz2 = (JSONObject) classesVersion2.get(z2);
						
						if(clazz.get("name").toString().equals(clazz2.get("name"))) {
							JSONArray metrics1 = (JSONArray) clazz.get("metrics");
							JSONArray metrics2 = (JSONArray) clazz2.get("metrics");
							JSONObject resOBJ = new JSONObject();
							for (int mtrSize = 0; mtrSize < metrics1.length(); mtrSize++) {
								for (int mtrSize2 = 0; mtrSize2 < metrics2.length(); mtrSize2++) {
									JSONObject chosen1 = (JSONObject) metrics1.get(chosenMetric);
									JSONObject chosen2 = (JSONObject) metrics2.get(chosenMetric);
									JSONArray methods1 = (JSONArray) chosen1.get("methods");
									JSONArray methods2 = (JSONArray) chosen2.get("methods");
									for(int methodsSize1 = 0; methodsSize1 < methods1.length(); methodsSize1++){
										for(int methodsSize2 = 0; methodsSize2 < methods2.length(); methodsSize2++){
											JSONObject method1 = (JSONObject) methods1.get(methodsSize1);
											JSONObject method2 = (JSONObject) methods2.get(methodsSize2);				
											if(method1.get("method").equals(method2.get("method"))) {
												int res = Integer.parseInt(method1.get("value").toString()) - Integer.parseInt(method2.get("value").toString());
												resOBJ.put(method1.get("method").toString(), res);
												
											}
										}
									}
								}
							}
							JSONObject resOBJ2 = new JSONObject();
							resOBJ2.accumulate(clazz.get("name").toString(),resOBJ);
							resOBJ3.accumulate(commonPacks.get(x).toString(), resOBJ2);
							r.accumulate(commonPacks.get(x).toString(), resOBJ2);
						}
						
					}
				}
			}
		}
		return r.toString();
	}
}
