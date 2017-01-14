package org.visminer.util;

import java.util.Iterator;
import java.util.List;

import javax.json.JsonValue;

import org.json.JSONArray;
import org.json.JSONObject;

public class MakeTMap {
	
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

	public String differentialRelative(JSONObject packagesResult) {
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
        
        Iterator<?> keys = packages1.keys();
        Iterator<?> keys2 = packages2.keys();
        while( keys.hasNext() ) {
            String key = (String)keys.next();
            JSONArray arr1 = new JSONArray(packages1.get(key).toString());
            JSONArray arr2 = new JSONArray(packages2.get(key).toString());

            for (Object val1 : arr1) {
            	JSONObject valObj1 = new JSONObject(val1.toString());
            	JSONArray valArray1 = new JSONArray(valObj1.get("metrics").toString());
            	for (Object val2 : arr2) {
                	JSONObject valObj2 = new JSONObject(val2.toString());
                	JSONArray valArray2 = new JSONArray(valObj2.get("metrics").toString());
                	if (valObj1.get("name").toString().equals(valObj2.get("name").toString())) {
                		for (Object methodRes : valArray1) {
                			JSONObject methodResObj = new JSONObject(methodRes.toString());
                			System.out.println(methodResObj.toString());	
                		}
                	}
                	
                }
            }
//            while( keys2.hasNext() ) {
//                String key2 = (String)keys2.next();
//                JSONArray arr2 = new JSONArray(packages2.get(key2));
//            }
       
        }
        
		return packagesRes.toString();
		
	}
}
