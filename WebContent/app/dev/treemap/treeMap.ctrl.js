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
		  var data = {
	        	};
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
			  console.log($scope.infoRepo);
			  console.log($scope.selectedVersion1, $scope.selectedVersion2);
			  $http.get('rest/tags/get-tags-reference', {params: {"tag": $scope.selectedVersion1, "repositoryId":$scope.repoSelected }}).success(function (tagRes)
			  {
				  
				  $scope.tagCommit = tagRes.commit;
				  console.log($scope.tagCommit);
				  $http.get('rest/tags/get-tags-reference', {params: {"tag": $scope.selectedVersion2, "repositoryId":$scope.repoSelected }}).success(function (tagRes)
						  {
							  
							  $scope.tagCommit2 = tagRes.commit;
							  console.log($scope.tagCommit2);
							  //teste();
							  referenceTest();
						  });
			  });
			  
			  
			  
//			  $http.get('rest/commits/get-commit', {params:{"commitId": $scope.commits[$scope.max]}})
//				.success(function(response) {
//					//makeMap(response);
//					$http.get('rest/commits/get-commit', {params:{"commitId": $scope.commits[$scope.min]}})
//					.success(function(response2) {
//						//makeMap(response);
//
//						setState();
//						
//					});
//				});
			  
			  //setState();
			  
		  }
		  
		  	function referenceTest () {
		  		var chosenMetric = $("select[name=metrics]").val();
		  		var result1 = [];
		  		var result2 = [];
		  		var result = [];
		  		$http.get('rest/wDirectories/get-by-id', {params: {"fileHash": $scope.tagCommit, "fileHash2": $scope.tagCommit2, "chosenMetric":chosenMetric }}).success(function (response){
		  			console.log(response);
//		  			for (packName in response.commit1) {
//		  				var resultObj1 = {};
//		  				resultObj1["package"] = packName;
//		  				resultObj1["filename"] = response.commit1[packName].name;
//		  				resultObj1["abstract_types"] = [];
//		  				resultObj1["abstract_types"].push(response.commit1[packName].metrics);
//		  				result1.push(resultObj1);
//		  			}
//		  			
//		  			for (packName in response.commit2) {
//		  				var resultObj2 = {};
//		  				resultObj2["package"] = packName;
//		  				resultObj2["filename"] = response.commit2[packName].name;
//		  				resultObj2["abstract_types"] = [];
//		  				resultObj2["abstract_types"].push(response.commit2[packName].metrics);
//		  				result1.push(resultObj1);
//		  			}
//		  			
//		  			for (obj in result1) {
//		  				console.log(result1[obj].package);
//		  				for(obj2 in result2){
//		  					if( result1[obj].package === result2[obj2].package) {
//		  						
//		  						console.log("uyaga");
//		  					}
//		  				}
//		  			}
//			  		makeMap(result);
//			  		
//			  		makeMap(result2);
		  		});
		  		
		  	}
		  	
		  	function setState() {
		  		teste();
		  	}
		  
		  	function teste () {
		  		var obj, obj2;
		  		var mapInfo = [];
		  		console.log($scope.tagCommit);
		  		var chosenMetric = $("select[name=metrics]").val();
		  		$http.get('rest/wDirectories/get-by-id', {params: {"fileHash": $scope.tagCommit, "fileHash2": $scope.tagCommit2, "chosenMetric":chosenMetric }}).success(function (response){
		  			console.log("Response: ", response);
		  			for (obj in response.commit1) {
		  				for(obj2 in response.commit2){
		  					if( obj2 === obj) {
		  						if ( response.commit1[obj].name === response.commit2[obj2].name ) {
		  							var name = response.commit1[obj].name;
		  							if (response.commit1[obj].metrics[chosenMetric].methods) {
	  									for (var k = 0; k < response.commit2[obj2].metrics[chosenMetric].methods.length; k++) {
	  										for (var kj = 0; kj < response.commit1[obj].metrics[chosenMetric].methods.length; kj++) {
		  										if (response.commit1[obj].metrics[chosenMetric].methods[kj].method === 
		  											response.commit2[obj2].metrics[chosenMetric].methods[k].method) {
		  											mapInfo.push({
	  													"package": obj,
	  													"filename": name,
	  													"abstract_types":[]
	  												});
		  											if (response.commit1[obj].metrics[chosenMetric].methods[kj] && response.commit2[obj2].metrics[chosenMetric].methods[kj]) {
		  												//console.log(parseInt(response.commit1[obj].metrics[chosenMetric].methods[kj].value) - parseInt(response.commit2[obj2].metrics[chosenMetric].methods[kj].value));
		  												
		  												if(mapInfo[k]){
		  													mapInfo[k].abstract_types.push(response.commit1[obj].metrics[chosenMetric]);
		  													//console.log(response.commit1[obj].metrics[chosenMetric]);
		  												}
		  												
		  											}
		  											
		  										}
		  									}
	  									}
			  								
			  							
		  							}
		  						}
		  						
		  					}
		  				}
		  			}
		  			makeMap(mapInfo);
		  		});
		  		
		  	}
		  	
		  	
		  	function makeNewMap(data) {
		  		var count, diffCounter, commitID, diffHash, filesHash, countHash = [];
		  		for (count in data) {
		  	 				console.log(data[count]);
				  			if(data[count].package){
				  				var packName = data[count].package.toString();
					  			packName = packName.split(".").pop();
				  			}


				  			if(!data[packName]) {
				  				data[packName] = {};
				  			}
				  			

					  		var chosenMetric = $("select[name=metrics]").val();
					  		$scope.allMetrics = data[count].abstract_types;
					  		
					  		var structure = {

					  		};
					  		var lastClazz;

					  		var clazzName = data[count].filename.toString();
				  			clazzName =  clazzName.split("/").pop();
				  			if( lastClazz !== clazzName) {

				  				clazz = {

				  				};
				  				lastClazz = clazzName;
				  			}
				  			for (var cc=0; cc < $scope.allMetrics.length; cc++) {
				  				if ($scope.allMetrics && packName){
						  			var methodsSize = $scope.allMetrics[cc].methods.length;
						  			var value = 0;
						  			for (i = 0; i< methodsSize; ++i) {
							  	    	name = $scope.allMetrics[cc].methods[i].method.toString();
							  	    	causeName[name] = $scope.allMetrics[cc].methods[i].method;
							  	    	value = value + parseInt($scope.allMetrics[cc].methods[i].value);
							  	    	structure[name] = value;
							  	    	clazz[clazzName] = structure;
							  	    }

						  	data[packName][clazzName] = clazz[clazzName];
						  		
					  		}
					  		else {
					  			causeName = {
					  					'All': 'All'
						        };
					  			clazz[clazzName] = {
					  					'All': $scope.allMetrics.metrics[chosenMetric].accumulated
					  			};
					  			data[packName][clazzName] = clazz[clazzName];
					  		}
				  			}
					  	
				  		mapping(data);
		  		}
			  }
		  	
		  	
		  	
		  	
		  	
		  	
		  	
		  	
		  
		  	function makeMap(data) {
		  		var count, diffCounter, commitID, diffHash, filesHash, countHash = [];
		  		var chosenMetric = $("select[name=metrics]").val();
		  		//for (count = 0;count < data.length; ++count) {
		  				console.log("Test");
		  				var responseSize = data.length, a;
				  		for (a = 0; a < responseSize; ++a) {
				  			if(data[a].package){
				  				var packName = data[a].package.toString();
					  			packName = packName.split(".").pop();
				  			}


				  			if(!data[packName]) {
				  				data[packName] = {};
				  			}
				  			

					  		var chosenMetric = $("select[name=metrics]").val();
					  		$scope.allMetrics = data[a].abstract_types[0];

					  		var structure = {

					  		};
					  		var lastClazz;

					  		var clazzName = data[a].filename.toString();
				  			clazzName =  clazzName.split("/").pop();
				  			if( lastClazz !== clazzName) {

				  				clazz = {

				  				};
				  				lastClazz = clazzName;
				  			}

					  		if ($scope.allMetrics && packName){
					  			console.log($scope.allMetrics);
					  			if($scope.allMetrics[chosenMetric].methods) {
						  			var methodsSize = $scope.allMetrics[chosenMetric].methods.length;
						  			var value = 0;
						  			for (i = 0; i< methodsSize; ++i) {
							  	    	name = $scope.allMetrics[chosenMetric].methods[i].method.toString();
							  	    	causeName[name] = $scope.allMetrics[chosenMetric].methods[i].method;
							  	    	value = value + parseInt($scope.allMetrics[chosenMetric].methods[i].value);
							  	    	structure[name] = value;
							  	    	clazz[clazzName] = structure;


							  	    }

						  			data[packName][clazzName] = clazz[clazzName];

						  		}
						  		else {
						  			causeName = {
						  					'All': 'All'
							        };
						  			clazz[clazzName] = {
						  					'All': $scope.allMetrics[chosenMetric].accumulated
						  			};
						  			data[packName][clazzName] = clazz[clazzName];
						  		}
					  		}

				  		}
				  		console.log(data);
				  		mapping(data);
		  		//}
			  }
//		  				$http.get('rest/get-metrics/get-byCommit', {params:{"idCommit": data[count]._id, "fileHash": data[count].diffs[0].hash.$numberLong}})
//					  	.success(function(response) {
//					  		var responseSize = response.length, a;
//					  		for (a = 0; a < responseSize; ++a) {
//					  			if(response[a].package){
//					  				var packName = response[a].package.toString();
//						  			packName = packName.split(".").pop();
//					  			}
//
//
//					  			if(!data[packName]) {
//					  				data[packName] = {};
//					  			}
//
//						  		var chosenMetric = $("select[name=metrics]").val();
//						  		$scope.allMetrics = response[a].abstract_types[0];
//
//						  		var structure = {
//
//						  		};
//						  		var lastClazz;
//
//						  		var clazzName = response[a].filename.toString();
//					  			clazzName =  clazzName.split("/").pop();
//					  			if( lastClazz !== clazzName) {
//
//					  				clazz = {
//
//					  				};
//					  				lastClazz = clazzName;
//					  			}
//
//						  		if ($scope.allMetrics && packName){
//						  			if($scope.allMetrics.metrics[chosenMetric].methods) {
//							  			var methodsSize = $scope.allMetrics.metrics[chosenMetric].methods.length;
//							  			var value = 0;
//							  			for (i = 0; i< methodsSize; ++i) {
//								  	    	name = $scope.allMetrics.metrics[chosenMetric].methods[i].method.toString();
//								  	    	causeName[name] = $scope.allMetrics.metrics[chosenMetric].methods[i].method;
//								  	    	value = value + parseInt($scope.allMetrics.metrics[chosenMetric].methods[i].value);
//								  	    	structure[name] = value;
//								  	    	clazz[clazzName] = structure;
//
//
//								  	    }
//
//							  			data[packName][clazzName] = clazz[clazzName];
//
//							  		}
//							  		else {
//							  			causeName = {
//							  					'All': 'All'
//								        };
//							  			clazz[clazzName] = {
//							  					'All': $scope.allMetrics.metrics[chosenMetric].accumulated
//							  			};
//							  			data[packName][clazzName] = clazz[clazzName];
//							  		}
//						  		}
//
//					  		}
//					  		console.log("Data inside response",data);
//					  		mapping(data);
//					  });
//		  		}
//		  }

		  function mapping(info) {
			  for (region in info) {
			        if (info.hasOwnProperty(region)) {
			            regionVal = 0;
			            regionP = {
			                id: 'id_' + regionI,
			                name: region,
			                color: Highcharts.getOptions().colors[regionI],
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
			                            causeP = {
			                                id: countryP.id + '_' + causeI,
			                                name: causeName[cause],
			                                parent: countryP.id,
			                                value: Math.round(+info[region][country][cause]),
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
			    chart = $('.high').highcharts({
			        series: [{
			        	drillUpButton: {
			                text: '<< return',
			                name: 'teste',
			                position: {
			                    align: 'right',
			                    x: -10
			                },
			                theme: {
			                    fill: 'white',
			                    'stroke-width': 1,
			                    stroke: 'silver',
			                    r: 5,
			                    states: {
			                        hover: {
			                            fill: '#bada55'
			                        }
			                    }
			                }

			            },
			            type: 'treemap',
			            layoutAlgorithm: 'squarified',
			            allowDrillToNode: true,
			            animationLimit: 1000,
			            turboThreshold: 0,
			            dataLabels: {
			                enabled: false
			            },
			            levelIsConstant: true,
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
			    }, false);
		  }
		  
	}

});
