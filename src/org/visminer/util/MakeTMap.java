package org.visminer.util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONObject;

public class MakeTMap {
	public String differentialRelative (JSONObject packagesResult) {
  		return packagesResult.toString();
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
}
