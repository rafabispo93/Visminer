homeApp = angular.module('homeApp');

homeApp.controller('DEVTreeMapCtrl', function($scope,$http, $location, $route, $timeout, sidebarService){

	$scope.currentPage = sidebarService.getCurrentPage();
	$scope.allmetrics;
	$http.get('rest/mining/get-references', {
		params : {
			"path" : $scope.infoRepo.path,
			"scm" : "GIT",
		}
	}).success(function(data) {
		data.shift();
		$scope.tagsLoaded = data;
	});
	
	if ($scope.currentPage == 'treeMap') {
		// This controller instance
		  var thisCtrl = this;
		  var infoGeneral;
		  var causeName = {

	        };

		  var clazz = {

		  };
		  var
		      points = [],
		      regionP,
		      regionVal,
		      regionI = 0,
		      countryP,
		      countryI,
		      causeP,
		      causeI,
		      region,
		      country,
		      cause;
		var i;
		var name;
		var name2;
		var chart = this;
		var c1, c2;
		var commitsHash = [];
		  $scope.slider = {
				    minValue: 0,
				    maxValue: $scope.commits.length / 2,
				    options: {
				        floor: 0,
				        ceil: $scope.commits.length,
				        step: 1,
				        onEnd: function () {
				        	$scope.max = $scope.slider.maxValue;
				        	$scope.min = $scope.slider.minValue;
				        }
				    }
				};
		  
		  
		  $scope.generate = function () {
			  if(chart) {
				  points = [];
			  }
			  if ($scope.selectMethod === "e" && $scope.strategies === "2") {
				  $http.get('rest/tags/get-tags-reference', {params: {"tag": $scope.selectedVersion1, "repositoryId":$scope.repoSelected }}).success(function (tagRes)
						  {
							  
							  $scope.tagCommit = tagRes.commit;
							  console.log("EVOLUTION",$scope.tagCommit);
							  $http.get('rest/tags/get-tags-reference', {params: {"tag": $scope.selectedVersion2, "repositoryId":$scope.repoSelected }}).success(function (tagRes)
									  {
										  
										  $scope.tagCommit2 = tagRes.commit;
										  console.log("EVOLUTION",$scope.tagCommit2);
										  differentialRelative ()
									  });
						  });
			  } else {
				  if ($scope.selectMethod === "s") {
					  $http.get('rest/tags/get-tags-reference', {params: {"tag": $scope.selectedVersion2, "repositoryId":$scope.repoSelected }}).success(function (tagRes)
							  {
						  		$scope.tagCommit = tagRes.commit;
						  		singleVersion();
							  }); 
				  }
				  
				  
			  }
			 
			  
			  
		  }
		  	
		  
		   function differentialRelative () {
			   var chosenMetric = $scope.metrics;
		  	   var chosenMetric2 = $scope.metrics2;
		  	 $http.get('rest/wDirectories/get-by-id-relative', {params: {"fileHash": $scope.tagCommit, "fileHash2": $scope.tagCommit2, "chosenMetric": chosenMetric2}}).success(function (response) {
		  		 
			  		infoGeneral = response;
	  				var respToMap = [];
	  				Object.keys(infoGeneral).filter(
							function (e) {
								if (isNaN(parseInt(e))) {
									respToMap[e] = infoGeneral[e];
								}
							}
					);
	  				var resF = [];
	  				
	  				for (var element in respToMap) {
	  					resF[element] = {};
	  					if(respToMap[element] instanceof Array) {
	  						for(czz in respToMap[element]) {
	  							var content = Object.keys(respToMap[element][czz])[0];
	  							resF[element][content] = {};
	  							resF[element][content]= respToMap[element][czz][content];
	  						}
	  					}else {
	  						resF[element] = respToMap[element];
	  					}
	  				}
	  				
	  				console.log(resF," Color ", chosenMetric2);
	  				$scope.maxPositiveColor = response.maxPositive;
	  				$scope.maxNegativeColor = response.maxNegative;
	  				console.log(response.maxPositive, response.maxNegative, "AQUIII");
	  				$scope.relativeColor = respToMap;
	  				 $http.get('rest/wDirectories/get-by-id-relative', {params: {"fileHash": $scope.tagCommit, "fileHash2": $scope.tagCommit2, "chosenMetric": chosenMetric}}).success(function (response) {
	  			  		 
	  			  		infoGeneral = response;
	  	  				var respToMap = [];
	  	  				Object.keys(infoGeneral).filter(
	  							function (e) {
	  								if (isNaN(parseInt(e))) {
	  									respToMap[e] = infoGeneral[e];
	  								}
	  							}
	  					);
	  	  				var resF = [];
	  	  				
	  	  				for (var element in respToMap) {
	  	  					resF[element] = {};
	  	  					if(respToMap[element] instanceof Array) {
	  	  						for(czz in respToMap[element]) {
	  	  							var content = Object.keys(respToMap[element][czz])[0];
	  	  							resF[element][content] = {};
	  	  							resF[element][content]= respToMap[element][czz][content];
	  	  						}
	  	  					}else {
	  	  						resF[element] = respToMap[element];
	  	  					}
	  	  				}
	  	  				
	  	  			console.log(resF," Area ", chosenMetric);
//		  	  		$scope.maxPositiveArea = response.maxPositive;
//	  				$scope.maxNegativeArea = response.maxNegative;
	  				if (response.maxPositive >= Math.abs(response.maxNegative)) {
	  					$scope.maxArea = response.maxPositive;
	  				} else {
	  					$scope.maxArea = Math.abs(response.maxNegative);
	  				}
	  				
	  				console.log(response.maxPositive, response.maxNegative, "AQUIII2");
	  	  			mappingRela(respToMap);
	  			  	 });
			  	 });
		  	
					   
		   }
		  
		  	function singleVersion () {
		  		var chosenMetric = $scope.metrics;
		  		var chosenMetric2 = $scope.metrics2;
		  		console.time("JAVA");
		  		$http.get('rest/wDirectories/get-by-id-single', {params: {"fileHash": $scope.tagCommit}}).success(function (response)
						  { 
		  					console.timeEnd("JAVA");
		  					console.log(response,"SINGLE");
					  		var result1 = [];
					  		var a, aSize;
				  			for (packName in response) {
			  					var resultObj1 = {};
				  				resultObj1["package"] = response[packName].package;
				  				resultObj1["filename"] = response[packName].filename;
				  				resultObj1["abstract_types"] = [];
				  				if(response[packName].abstract_types[0]){
				  					resultObj1["abstract_types"].push(response[packName].abstract_types[0].metrics);
				  				}
				  				
				  				result1.push(resultObj1);
				  				
				  			}
				  			makeMap(result1, "#0000FF", $scope.metrics,chosenMetric2);
						  });
		  	}
		  
		  	function referenceCheck () {
		  		var chosenMetric = $("select[name=metrics]").val();
		  		var result1 = [];
		  		var result2 = [];
		  		var result = [];
		  		$http.get('rest/wDirectories/get-by-id', {params: {"fileHash": $scope.tagCommit, "fileHash2": $scope.tagCommit2, "strategy": $scope.strategies}}).success(function (response){
		  			console.log(response);
		  			var a, aSize;
		  			for (packName in response.commit1) {
		  				aSize = response.commit1[packName].length;
		  				for (a = 0; a < aSize; a++) {
		  					var resultObj1 = {};
			  				resultObj1["package"] = packName;
			  				resultObj1["filename"] = response.commit1[packName][a].name;
			  				resultObj1["abstract_types"] = [];
			  				resultObj1["abstract_types"].push(response.commit1[packName][a].metrics);
			  				result1.push(resultObj1);
		  				}
		  				
		  			}
		  			
		  			for (packName in response.commit2) {
		  				aSize = response.commit2[packName].length;
		  				for (a = 0; a < aSize; a++) {
			  				var resultObj2 = {};
			  				resultObj2["package"] = packName;
			  				resultObj2["filename"] = response.commit2[packName][a].name;
			  				resultObj2["abstract_types"] = [];
			  				resultObj2["abstract_types"].push(response.commit2[packName][a].metrics);
			  				result2.push(resultObj2);
		  				}
		  			}
			  		makeMap(result1, "#0000FF", $scope.metrics, function () {
			  			makeMap(result2, "#00FF00", $scope.metrics);
			  		});			  		
			  		
		  		});
		  		
		  	}
		  	

		  	function makeMap(data1, colorD, chosenMetric, chosenMetric2) {
		  		var count, diffCounter, commitID, diffHash, filesHash, countHash = [], valueAux1 = 0;
		  		var r = $.Deferred();
		  		for (count = 0;count < data1.length; ++count) {
		  				var responseSize = data1.length, a;
				  		for (a = 0; a < responseSize; ++a) {
				  			if(data1[a].package){
				  				var packName = data1[a].package.toString();
					  			packName = packName.split(".").pop();
					  			
					  			var packName2 = data1[a].package.toString();
					  			packName2 = packName2.split(".").pop();
				  			}


				  			if(!data1[packName]) {
				  				data1[packName] = {};
				  			}
				  			

					  		$scope.allMetrics = data1[a].abstract_types[0];

					  		var structure = {

					  		};
					  		var lastClazz;
					  		

					  		var clazzName = data1[a].filename.toString();
				  			clazzName =  clazzName.split("/").pop();
				  			if( lastClazz !== clazzName) {

				  				clazz = {

				  				};
				  				lastClazz = clazzName;
				  			}
				  			

					  		if ($scope.allMetrics && packName){
					  			if($scope.allMetrics[chosenMetric].methods) {
						  			var methodsSize = $scope.allMetrics[chosenMetric].methods.length;
						  			var value = 0, valueColor = 0;
						  			for (i = 0; i< methodsSize; ++i) {
						  				var valueArray = [];
							  	    	name = $scope.allMetrics[chosenMetric].methods[i].method.toString();
							  	    	causeName[name] = $scope.allMetrics[chosenMetric].methods[i].method;
//							  	    	value = value + parseInt($scope.allMetrics[chosenMetric].methods[i].value);
							  	    	value = parseInt($scope.allMetrics[chosenMetric].methods[i].value);
//							  	    	valueColor = valueColor + parseInt($scope.allMetrics[chosenMetric2].methods[i].value);
							  	    	valueColor = parseInt($scope.allMetrics[chosenMetric2].methods[i].value);
							  	    	var resVal = [];
							  	    	resVal.push(value);
							  	    	resVal.push(valueColor);
							  	    	structure[name] = resVal;
							  	    	if (valueColor > valueAux1) {
							  	    		valueAux1 = valueColor;
							  	    	}
							  	    	clazz[clazzName] = structure;

							  	    }
						  			data1[packName][clazzName] = clazz[clazzName];
						  			//console.log(data);
						  		}
						  		else {
						  			causeName = {
						  					'All': 'All'
							        };
						  			clazz[clazzName] = {
						  					'All': $scope.allMetrics[chosenMetric].accumulated
						  			};
						  			data1[packName][clazzName] = clazz[clazzName];
						  		}
						  		
					  		}

				  		}
		  		}		
		  				console.log("Max 1", valueAux1);
		  				infoGeneral = data1;
		  				var respToMap = [];
		  				Object.keys(infoGeneral).filter(
								function (e) {
									if (isNaN(parseInt(e))) {
										respToMap[e] = infoGeneral[e];
									}
								}
						);
		  				console.log(respToMap, "SINGLE");
		  				mapping(respToMap, colorD, valueAux1);
		  				return r;
			  }
		  
		  	
		  	 function mappingRela(info) {
				  console.time("javascript");
				  var maxPositive = 0;
              	  var maxNegative = 0;
		  		
				  for (region in info) {
				        if (info.hasOwnProperty(region)) {
				            regionVal = 0;
				            regionP = {
				                id: 'id_' + regionI,
				                name: region,
				                borderColor:"#000000"
				            };
				            countryI = 0;
				            var nCountry;
				            for (country in info[region]) {
				                if (info[region].hasOwnProperty(country)) {
				                	if(Object.keys(info[region][country])[0]) {
				                		
				                		if (country.match(/^[0-9]+$/) !== null) {
				                			ncountry = Object.keys(info[region][country])[0];
				                		}
				                		else {
				                			ncountry = country;
				                			
				                		}
				                	}
				                	else {
				                		ncountry = country;
				                	}
				                    countryP = {
				                        id: regionP.id + '_' + countryI,
				                        name: ncountry + '.java',
				                        parent: regionP.id,
				                        borderColor:"#fff000"
				                    };
				                    points.push(countryP);
				                    causeI = 0;
				                    var shouldGet = "true";
				                    
				                    for (cause in info[region][country]) {
				                        if (info[region][country].hasOwnProperty(cause)) {
						                	var causesN = Object.keys(info[region][country][cause]);
						       
						                	if (causesN.length > 0) {
						                		for (var x = 0; x < causesN.length; x++) {
						                			var methodC = causesN[x];
						                			var methodV = info[region][country][cause][methodC];
						                			var methodColorV = $scope.relativeColor[region][country][cause][methodC];
						                			if (parseInt(methodColorV) === 0) {
						                				color = "#ffffff";
						                			}
						                			else if (parseInt(methodColorV) > 0) {
						                				if (parseInt(methodColorV) > 0 && parseInt(methodColorV) <= $scope.maxPositiveColor/4) {
						                					color = "#FF0000";
						                					console.log("One");
						                				} if (parseInt(methodColorV) > $scope.maxPositiveColor/4 && parseInt(methodColorV) <= $scope.maxPositiveColor/4 * 2) {
						                					color = "#cc0000";
						                					console.log("Two");
						                				} if (parseInt(methodColorV) > $scope.maxPositiveColor/4 * 2 && parseInt(methodColorV) <= $scope.maxPositiveColor/4 * 3) {
						                					color = "#b20000";
						                				} if (parseInt(methodColorV) >= $scope.maxPositiveColor/4 * 3 && parseInt(methodColorV) <= $scope.maxPositiveColor/4 * 4) {
						                					color = "#660000";
						                					console.log("Four");
						                				}
						                				
						                			}
						                			else if (parseInt(methodColorV) < 0) {
						                				if (parseInt(methodColorV) < 0 && parseInt(methodColorV) >= $scope.maxNegativeColor/4) {
						                					color = "#00FF00";
						                					console.log("One");
						                				} if (parseInt(methodColorV) < $scope.maxNegativeColor/4 && parseInt(methodColorV) >= $scope.maxNegativeColor/4 * 2) {
						                					color = "#00cc00";
						                					console.log("Two");
						                				} if (parseInt(methodColorV) < $scope.maxNegativeColor/4 * 2 && parseInt(methodColorV) >= $scope.maxNegativeColor/4 * 3) {
						                					color = "#009900";
						                					console.log("Three", $scope.maxNegativeColor/4 * 2, $scope.maxNegativeColor/4 * 3);
						                				} if (parseInt(methodColorV) <= $scope.maxNegativeColor/4 * 3 && parseInt(methodColorV) >= $scope.maxNegativeColor/4 * 4) {
						                					color = "#003300";
						                					console.log("Four");
						                				}
						                			}
//						                			if (parseInt(methodV) === 0) {
//						                				methodV = 0.1;
//						                			}
//						                			if (parseInt(methodV) < 0) {
//						                				methodV = 0.001;
//						                			}
						                            causeP = {
						                                id: countryP.id + '_' + causeI,
						                                name: causesN[x],
						                                parent: countryP.id,
						                                color: color,
						                                value: methodV + $scope.maxArea,
						                                borderColor: "#ff0000"

						                            };
						                            regionVal += causeP.value;
						                            points.push(causeP);
						                            causeI = causeI + 1;
								                  }
						                	}
						                	else {
						                		if (shouldGet === "true") {
						                			if(info[region][ncountry]) {
						                				var altCauses = Object.keys(info[region][ncountry]);
								                		for (var x = 0; x < altCauses.length; x++) {
								                			var methodC = altCauses[x];
								                			var methodV = info[region][ncountry][methodC];
								                			var methodColorV = $scope.relativeColor[region][ncountry][methodC];
								                			var color;
								                			if (parseInt(methodColorV) === 0) {
								                				color = "#ffffff";
								                			}
								                			else if (parseInt(methodColorV) > 0) {
								                				if (parseInt(methodColorV) > 0 && parseInt(methodColorV) <= $scope.maxPositiveColor/4) {
								                					color = "#FF0000";
								                					console.log("One");
								                				} if (parseInt(methodColorV) > $scope.maxPositiveColor/4 && parseInt(methodColorV) <= $scope.maxPositiveColor/4 * 2) {
								                					color = "#cc0000";
								                					console.log("Two");
								                				} if (parseInt(methodColorV) > $scope.maxPositiveColor/4 * 2 && parseInt(methodColorV) <= $scope.maxPositiveColor/4 * 3) {
								                					color = "#b20000";
								                				} if (parseInt(methodColorV) >= $scope.maxPositiveColor/4 * 3 && parseInt(methodColorV) <= $scope.maxPositiveColor/4 * 4) {
								                					color = "#660000";
								                					console.log("Four");
								                				}
								                				
								                			}else if (parseInt(methodColorV) < 0) {
								                				if (parseInt(methodColorV) < 0 && parseInt(methodColorV) >= $scope.maxNegativeColor/4) {
								                					color = "#00FF00";
								                					console.log("One");
								                				} if (parseInt(methodColorV) < $scope.maxNegativeColor/4 && parseInt(methodColorV) >= $scope.maxNegativeColor/4 * 2) {
								                					color = "#00cc00";
								                					console.log("Two");
								                				} if (parseInt(methodColorV) < $scope.maxNegativeColor/4 * 2 && parseInt(methodColorV) >= $scope.maxNegativeColor/4 * 3) {
								                					color = "#009900";
								                					console.log("Three", $scope.maxNegativeColor/4 * 2, $scope.maxNegativeColor/4 * 3);
								                				} if (parseInt(methodColorV) <= $scope.maxNegativeColor/4 * 3 && parseInt(methodColorV) >= $scope.maxNegativeColor/4 * 4) {
								                					color = "#003300";
								                					console.log("Four");
								                				}
								                			}
//								                			if (parseInt(methodV) === 0) {
//								                				methodV = 0.1;
//								                			}
//								                			if (parseInt(methodV) < 0) {
//								                				methodV = 0.001;
//								                			}
								                			causeP = {
									                                id: countryP.id + '_' + causeI,
									                                name: altCauses[x],
									                                parent: countryP.id,
									                                color: color,
									                                value: methodV + $scope.maxArea,
									                                borderColor: "#ff0000"

									                            };
								                            regionVal += causeP.value;
								                            points.push(causeP);
								                            causeI = causeI + 1;
								                		}
						                			}
						                			
						                		}
						                		shouldGet = false;
						                		
						                	}
						                	
				                        }
				                    }
				                    countryI = countryI + 1;
				                }
				            }
				            regionP.value = regionVal;
				            points.push(regionP);
				            regionI = regionI + 1;
				        }
				    }
				  console.timeEnd("javascript");
				  console.time("highcharts");
				  var options = { series: [{
			            type: 'treemap',
			            layoutAlgorithm: 'squarified',
			            allowDrillToNode: true,
			            animationLimit: 1000,
			            turboThreshold: 0,
			            dataLabels: {
			                enabled: false,
		                    formatter: function(e) {
		                        return this.point.name;
		                    }
			            },
			            levelIsConstant: false,
			            levels: [{
			                level: 1,
			                dataLabels: {
			                    enabled: true
			                },
			                borderWidth: 3
			            }],
			            data: points           
			        }],
			        subtitle: {
			            text: ''
			        },
			        title: {
			            text: 'Results'
			        }
			       };
				    $scope.chart = Highcharts.chart('container', options);
				    console.timeEnd("highcharts");
			  }

		  function mapping(info, colorD, valueAux) {
			  console.time("javascript");
			  var one = (valueAux/10).toString(),
	  			two = one * 2,
	  			three = one * 3,
	  			four = one * 4,
	  			five = one * 5,
	  			six = one * 6,
	  			seven = one * 7,
	  			eight = one * 8,
	  			nine = one * 9,
	  			ten = valueAux,
	  			colorsData;
	  			
		  		colorsData = {
						
				};
	  			colorsData[one] = "#c3834c";
	  			colorsData[two] = "#af7544";
	  			colorsData[three] = "#9c683c";
	  			colorsData[four] = "#885b35";
	  			colorsData[five] = "#754e2d";
	  			colorsData[six] = "#614126";
	  			colorsData[seven] = "#4e341e";
	  			colorsData[eight] = "#3a2716";
	  			colorsData[nine] = "#271a0f";
	  			colorsData[ten] = "#130d07";
	  		
			  for (region in info) {
			        if (info.hasOwnProperty(region)) {
			            regionVal = 0;
			            regionP = {
			                id: 'id_' + regionI,
			                name: region,
			                borderColor:"#000000"
			            };
			            countryI = 0;
			            for (country in info[region]) {
			                if (info[region].hasOwnProperty(country)) {
			                    countryP = {
			                        id: regionP.id + '_' + countryI,
			                        name: country,
			                        parent: regionP.id,
			                        borderColor:"#fff000"
			                    };
			                    points.push(countryP);
			                    causeI = 0;
			                    for (cause in info[region][country]) {
			                        if (info[region][country].hasOwnProperty(cause)) {
			                        	console.log(info[region][country][cause]);
			                        	var result;
			                        	var rValue = Math.round(+info[region][country][cause][1])
			                        	if (rValue >=0 && rValue <= one) {
			                        		result = "#c3834c";
			                        	}
			                        	if (rValue >one && rValue <= two) {
			                        		result = "#af7544";
			                        	}
			                        	if (rValue >two && rValue <= three) {
			                        		result = "#9c683c";
			                        	}
			                        	if (rValue >three && rValue <= four) {
			                        		result = "#885b35";
			                        	}
			                        	if (rValue >four && rValue <= five) {
			                        		result = "#754e2d";
			                        	}
			                        	if (rValue >five && rValue <= six) {
			                        		result = "#614126";
			                        	}
			                        	if (rValue >six && rValue <= seven) {
			                        		result = "#4e341e";
			                        	}
			                        	if (rValue >seven && rValue <= eight) {
			                        		result = "#3a2716";
			                        	}
			                        	if (rValue >eight && rValue <= nine) {
			                        		result = "#271a0f";
			                        	}
			                        	if (rValue >nine && rValue <= ten) {
			                        		result = "#130d07";
			                        	}
			                            causeP = {
			                                id: countryP.id + '_' + causeI,
			                                name: causeName[cause],
			                                parent: countryP.id,
			                                color: result,
			                                value: Math.round(+info[region][country][cause][0]),
			                                borderColor: "#ff0000"

			                            };
			                            regionVal += causeP.value;
			                            points.push(causeP);
			                            causeI = causeI + 1;
			                        }
			                    }
			                    countryI = countryI + 1;
			                }
			            }
			            regionP.value = regionVal;
			            points.push(regionP);
			            regionI = regionI + 1;
			        }
			    }
			  	
			  console.timeEnd("javascript");
			  console.time("highcharts");
			  var options = { series: [{
		            type: 'treemap',
		            layoutAlgorithm: 'squarified',
		            allowDrillToNode: true,
		            animationLimit: 1000,
		            turboThreshold: 0,
		            dataLabels: {
		                enabled: false,
	                    formatter: function(e) {
	                        return this.point.name;
	                    }
		            },
		            levelIsConstant: false,
		            levels: [{
		                level: 1,
		                dataLabels: {
		                    enabled: true
		                },
		                borderWidth: 3
		            }],
		            data: points           
		        }],
		        subtitle: {
		            text: ''
		        },
		        title: {
		            text: 'Results'
		        }
		       };
			    $scope.chart = Highcharts.chart('container', options);
			    console.timeEnd("highcharts");
		  }
		
	}
	
	$(document).on('mouseover', function () {
		$(".highcharts-text-outline").off().css('cursor', 'zoom-in');
		$(".highcharts-text-outline").off().on('contextmenu', function (e) {
			 $('#parallel').empty();
			 $scope.eleClicked = $(this).text();
			 $scope.dataParallel = [];
			 console.log("ENTROU AQUI");
//			 if($scope.eleClicked.indexOf('(') == -1 ) {
				 var callback = parallelService();
//				}
			 return false;
//			 var callback = parallelService();
		});
//		$("rect").off().on('contextmenu', function (e) {
//			console.log("HBAH");
////			console.log($("rect").siblings(".highcharts-text-outline"));
//		});
	});
	
	function parallelService () {
		 var aux = 1; 
		 for (var count = 0; count < $scope.tagsLoaded.length; count++) {
			 $http.get('rest/tags/get-tags-reference', {params: {"tag": $scope.tagsLoaded[count].name, "repositoryId":$scope.repoSelected }}).success(function (tagRes){
				 		$http.get('rest/wDirectories/get-by-id-parallel', {params: {"fileHash": tagRes.commit, "version": tagRes.version, "eleClicked": $scope.eleClicked}}).success(function (response){
				 			 var version = tagRes.version;
				 			 var dataToParallel = {
				 					 "version": tagRes.version,
				 					 "metrics": response
				 			 }
				 			 $scope.dataParallel.push(dataToParallel);
				 			 aux++;
				 			 if (aux == $scope.tagsLoaded.length) {
				 				codeParallel($scope.dataParallel);
				 			 }
						 });
					  }); 
		 }
		
	}
	
	function codeParallel (dataParallel) {
//		while($scope.chart.series.length > 0)
//			$scope.chart.series[0].remove(true);
//		$('#container').empty();
		$('#parallel').show();
		var data = [];
		for (var count = 0; count < dataParallel.length; count++) {
			var version = dataParallel[count].version;
			var metrics = JSON.parse(dataParallel[count].metrics[version]);
			var result = {};
			result["version"] = version;
			
			for (var metric in metrics) {
				result[metric] = metrics[metric];
			}
			
			data.push(result);
			
		}
		if(data.length == dataParallel.length) {
			console.log(data);
			var dat = {
					"info": data
			};
			$http.get('rest/wDirectories/organize-parallel', {params: {"array": dat}}).success(function (response){
				console.log(response);
				$scope.dataPa = response;
				generateParallel(response);
			});
		}
	}
	
	function generateParallel (dataParallel) {
//			var foods = [
//			  {name: "Asparagus", "protein": 2.2, calcium: 0.024, sodium: 0.002,t:1,tt:2,ttt:3,tttt:4, b:1,bb:2,bbb:3,n:1,nn:2,nnn:3,a:1,aa:2,aaa:3, q:1,qq:8,qqq:99,w:5,ww:65,www:96,r:4,rr:9,rrr:52,o:6,oo:95, ooo:85},
//			  {name: "Butter", "protein": 0.85, calcium: 0.024, sodium: 0.714},
//			  {name: "Coffeecake", "protein": 6.8, calcium: 0.054, sodium: 0.351},
//			  {name: "Pork", "protein": 28.5, calcium: 0.016, sodium: 0.056},
//			  {name: "Provolone", "protein": 25.58, calcium: 0.756, sodium: 0.876},
//			];
			
			var foods = [
				{"metric":"PAR","0.6.0":94,"0.7.0":94,"0.4.0":97,"0.5.0":94,"0.8.0":162,"0.9.0":372,"0.3.0":115,"0.1.0":86,"1.3.1":195,"1.0":65,"1.2":165,"1.3":195,"1.4":218},
				{"metric":"NOAV","0.6.0":245,"0.7.0":245,"0.4.0":250,"0.5.0":245,"0.8.0":489,"0.9.0":1146,"0.3.0":317,"0.1.0":219,"1.3.1":576,"1.0":193,"1.2":508,"1.3":576,"1.4":640},
				{"metric":"MLOC","0.6.0":603,"0.7.0":603,"0.4.0":621,"0.5.0":603,"0.8.0":1098,"0.9.0":3980,"0.3.0":771,"0.1.0":544,"1.3.1":1092,"1.0":643,"1.2":964,"1.3":1092,"1.4":1214},
				{"metric":"LVAR","0.6.0":6,"0.7.0":6,"0.4.0":6,"0.5.0":6,"0.8.0":40,"0.9.0":127,"0.3.0":15,"0.1.0":3,"1.3.1":56,"1.0":12,"1.2":54,"1.3":56,"1.4":62},
				{"metric":"CYCLO","0.6.0":176,"0.7.0":176,"0.4.0":180,"0.5.0":176,"0.8.0":323,"0.9.0":688,"0.3.0":222,"0.1.0":164,"1.3.1":302,"1.0":121,"1.2":262,"1.3":302,"1.4":328},
				{"metric":"MAXNESTING","0.6.0":2,"0.7.0":2,"0.4.0":2,"0.5.0":2,"0.8.0":29,"0.9.0":66,"0.3.0":5,"0.1.0":2,"1.3.1":29,"1.0":9,"1.2":25,"1.3":29,"1.4":29},
				{"metric":"ATFD","0.6.0":20,"0.7.0":20,"0.4.0":22,"0.5.0":20,"0.8.0":59,"0.9.0":46,"0.3.0":24,"0.1.0":20,"1.3.1":6,"1.0":11,"1.2":6,"1.3":6,"1.4":4},
			];
		var maxVer;
		for (var w = 0; w < dataParallel.length; w++) {
			var keys = Object.keys(dataParallel[w]);
			for (var keysC = 0; keysC < keys.length; keysC++){
				if (keys[keysC].indexOf('.') > -1) {
					if (keys[keysC].length >= maxVer) {
						maxVer = keys[keysC].length;
					}
					else {
						var newVers = String(keys[keysC]) + ".0";
						dataParallel[w][newVers] = dataParallel[w][keys[keysC]];
						delete dataParallel[w][keys[keysC]];
					}
				}
				
			}
		}
		var colorgen = d3.scale.ordinal()
	    .range(["#a6cee3","#1f78b4","#b2df8a","#33a02c",
	            "#fb9a99","#e31a1c","#fdbf6f","#ff7f00",
	            "#cab2d6","#6a3d9a","#ffff99","#b15928"]);

		var blue_to_brown = d3.scale.linear()
		  .domain([9, 50])
		  .range(["steelblue", "brown"])
		  .interpolate(d3.interpolateLab);
	
		var pc = d3.parcoords()("#parallel")
		  .data(dataParallel)
		  .color(function(d) { return colorgen(d['metric']); })
		  .render()
		  .brushMode("1D-axes")
		  .reorderable();
	//	  .createAxes();
		}
	
});


