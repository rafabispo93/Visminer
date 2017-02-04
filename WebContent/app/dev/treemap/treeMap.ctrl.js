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
		  	   
		  	 $http.get('rest/wDirectories/get-by-id-relative', {params: {"fileHash": $scope.tagCommit, "fileHash2": $scope.tagCommit2, "chosenMetric": chosenMetric}}).success(function (response) {
		  		 console.log(response);
		  		 
		  	 });
					   
		   }
		  
		  
		  	function singleVersion () {
		  		var chosenMetric = $scope.metrics;
		  		var chosenMetric2 = $scope.metrics2;
		  		console.time("JAVA");
		  		$http.get('rest/wDirectories/get-by-id-single', {params: {"fileHash": $scope.tagCommit}}).success(function (response)
						  { 
		  					console.timeEnd("JAVA");
		  					console.log(response);
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
		  				mapping(respToMap, colorD, valueAux1);
		  				return r;
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
		console.log($(".highcharts-text-outline"));
		$(".highcharts-text-outline").off().css('background-color', 'yellow');
		$(".highcharts-text-outline").off().on('click', function (e) {
			 $('#parallel').empty();
			 $scope.eleClicked = $(this).text();
			 $scope.dataParallel = [];
			 console.log("ENTROU AQUI");
			 if($scope.eleClicked.indexOf('(') == -1 ) {
				 var callback = parallelService();
				}
//			 var callback = parallelService();
		});
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
//		var foods = [
//			  {name: "Asparagus", "protein": 2.2, calcium: 0.024, sodium: 0.002},
//			  {name: "Butter", "protein": 0.85, calcium: 0.024, sodium: 0.714},
//			  {name: "Coffeecake", "protein": 6.8, calcium: 0.054, sodium: 0.351},
//			  {name: "Pork", "protein": 28.5, calcium: 0.016, sodium: 0.056},
//			  {name: "Provolone", "protein": 25.58, calcium: 0.756, sodium: 0.876}
//			];
			
//		var blue_to_red = d3.scale.linear()
//		  .domain([9, 50])
//		  .range(["blue", "red"])
//		  .interpolate(d3.interpolateLab);
		
		var colorgen = d3.scale.ordinal()
	    .range(["#a6cee3","#1f78b4","#b2df8a","#33a02c",
	            "#fb9a99","#e31a1c","#fdbf6f","#ff7f00",
	            "#cab2d6","#6a3d9a","#ffff99","#b15928"]);
		var pc = d3.parcoords()("#parallel")
		  .data(data)
//		  .color(function(d) {
//		    // d corresponds to the individual data object
//			console.log(d);
////			return blue_to_red(d[version]);
//			return colorgen(d[version]);
//		  })
		  .render()
		  .brushMode("1D-axes")
		  .reorderable();
//		  .createAxes();
	}
	
});


