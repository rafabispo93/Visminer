package org.visminer.util;

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
			if(listElement.get("package").toString().contains(eleClicked.toString()) || listElement.get("filename").toString().endsWith(eleClicked.toString())) {
				
				if(typesArray.length() > 0) {
					JSONObject zero = (JSONObject) typesArray.get(0);
					JSONArray metrics = (JSONArray) zero.get("metrics");
					int metricsSize = metrics.length();
					for (int x = 0; x < metricsSize; x++) {
						JSONObject metricInfo = (JSONObject) metrics.get(x);
						boolean resp = metricInfo.has("accumulated");
						boolean resp2 = metricInfo.has("methods");
						if(resp == true) {
							int value = Integer.parseInt(metricInfo.get("accumulated").toString());
							if (response.has(metricInfo.getString("name"))) {
								int aux = Integer.parseInt(response.get(metricInfo.get("name").toString()).toString()) ;
								value = value + aux;
								response.put(metricInfo.get("name").toString(), value);
							} else {
								response.put(metricInfo.get("name").toString(), value);
							}

						}
						
						
						if(resp == false && resp2 == true) {
							JSONArray methods = (JSONArray)  metricInfo.get("methods");
							int methodsSize = methods.length();
							int value = 0;
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
		JSONObject packages1 = new JSONObject();
		JSONObject commit1 = new JSONObject(packagesResult.get("commit1").toString());
		JSONArray commit1Array = new JSONArray(commit1.keySet().toString());
		int commit1Size = commit1Array.length();

		JSONObject packages2 = new JSONObject();
		JSONObject commit2 = new JSONObject(packagesResult.get("commit2").toString());
		JSONArray commit2Array = new JSONArray(commit2.keySet().toString());
		int commit2Size = commit2Array.length();
		
		
		for (int a = 0; a < commit1Size; a++) {
			boolean resp = commit2.has(commit1Array.get(a).toString());
			if (resp == true) {
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
			if (resp == true) {
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
        
        JSONObject trueRes = new JSONObject();
        
        Iterator<String> iter = packages1.keys();
        Iterator<String> iter2 = packages2.keys();
        while (iter.hasNext()) {
            String key = iter.next();
            while (iter2.hasNext()) {
            	String key2 = iter2.next();
            	try {
                    JSONArray value = (JSONArray) packages1.get(key);
                    JSONArray value2 = (JSONArray) packages2.get(key2);
                    JSONArray valueFinal = (JSONArray) packages1.get(key);
                    for (int countA = 0; countA < value.length(); countA++) {
                    	for (int countA2 = 0; countA2 < value2.length(); countA2++) {
                    		
                    		JSONObject objValue = (JSONObject) value.get(countA);
                        	JSONArray arrayValue = (JSONArray) objValue.get("metrics");
                        	JSONObject methodValues = (JSONObject) arrayValue.get(chosenMetric);
                        	
                        	JSONObject objValue2 = (JSONObject) value2.get(countA2);
                        	JSONArray arrayValue2 = (JSONArray) objValue2.get("metrics");
                        	JSONObject methodValues2 = (JSONObject) arrayValue2.get(chosenMetric);
                        	
                        	
                        	
                        	JSONObject methodValuesFinal = new JSONObject();
                        	JSONArray arrayValueFinal = new JSONArray();
                        	JSONObject objValueFinal = (JSONObject) value.get(countA);
                        	if(methodValues.has("methods")) {
                        		if(methodValues2.has("methods")) {
                        			JSONArray methodsArray = (JSONArray) methodValues.get("methods");
                        			JSONArray methodsArray2 = (JSONArray) methodValues2.get("methods");
                        			JSONArray methodsArrayFinal = new JSONArray();
                            		for ( int countB = 0; countB < methodsArray.length(); countB++) {
                            			JSONObject valueResult = (JSONObject) methodsArray.get(countB);
                            			for ( int countB2 = 0; countB2 < methodsArray2.length(); countB2++) {
                            				JSONObject valueResult2 = (JSONObject) methodsArray2.get(countB2);
                            				
                            				if (valueResult.get("method").toString().equals(valueResult2.get("method").toString())) {
                            					int result1 = Integer.parseInt(valueResult.get("value").toString());
                                				int result2 = Integer.parseInt(valueResult2.get("value").toString());
                                				int result = result1 - result2;
                                				
                                				//ArrayList<JSONObject> methodsArrayFinal = new ArrayList<JSONObject>();
                                				valueResult.put("value", result);
                                				methodsArrayFinal.put(valueResult);
                                				
                                				
                            				}
                            				else {
                            					methodsArrayFinal.put(valueResult);
                            				}
                            				
                            			}
                            			
                            		}
                            		methodValuesFinal.append("methods", methodsArrayFinal);
                        		}
                        		
                        		else {
                            		
                            	}
                        	}
                        	else {
                        		
                        	}
                        	
                        	arrayValueFinal.put(methodValuesFinal);	
                        	objValueFinal.put("metrics", arrayValueFinal);
                        	valueFinal.put(objValueFinal);
                        	trueRes = objValueFinal;
                        	System.out.println(valueFinal);
                        	
                    	}
                    	
                    	 
                    }
                    
                   
                } catch (JSONException e) {
                    // Something went wrong!
                }
            }
            
        }
        
		return packagesRes.toString();
		
	}
}
