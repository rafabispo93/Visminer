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
			  if ($scope.selectMethod === "e") {
				  $http.get('rest/tags/get-tags-reference', {params: {"tag": $scope.selectedVersion1, "repositoryId":$scope.repoSelected }}).success(function (tagRes)
						  {
							  
							  $scope.tagCommit = tagRes.commit;
							  console.log($scope.tagCommit);
							  $http.get('rest/tags/get-tags-reference', {params: {"tag": $scope.selectedVersion2, "repositoryId":$scope.repoSelected }}).success(function (tagRes)
									  {
										  
										  $scope.tagCommit2 = tagRes.commit;
										  console.log($scope.tagCommit2);
										  referenceCheck();
									  });
						  });
			  } else {
				  if ($scope.selectMethod === "s") {
					  $http.get('rest/tags/get-tags-reference', {params: {"tag": $scope.selectedVersion2, "repositoryId":$scope.repoSelected }}).success(function (tagRes)
							  {
						  		$scope.tagCommit = tagRes.commit;
						  		console.log(tagRes);
						  		singleVersion();
							  }); 
				  }
				  
			  }
			 
			  
			  
		  }
		  	
		  	function singleVersion () {
		  		var chosenMetric = $scope.metrics;
		  		var chosenMetric2 = $scope.metrics2;
		  		
		  		$http.get('rest/wDirectories/get-by-id-single', {params: {"fileHash": $scope.tagCommit}}).success(function (response)
						  { 
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
					  		makeMap(result1, "#8B4513", chosenMetric, chosenMetric2);
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
			  		makeMap(result1, "#0000FF", $scope.metrics);			  		
			  		makeMap(result2, "#00FF00", $scope.metrics);
		  		});
		  		
		  	}
		  	
		  	

		  	function makeMap(data, colorD, chosenMetric, chosenMetric2) {
		  		var count, diffCounter, commitID, diffHash, filesHash, countHash = [];
		  		for (count = 0;count < data.length; ++count) {
		  				var responseSize = data.length, a;
				  		for (a = 0; a < responseSize; ++a) {
				  			if(data[a].package){
				  				var packName = data[a].package.toString();
					  			packName = packName.split(".").pop();
				  			}


				  			if(!data[packName]) {
				  				data[packName] = {};
				  			}
				  			

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
					  			
					  			if($scope.allMetrics[chosenMetric].methods) {
						  			var methodsSize = $scope.allMetrics[chosenMetric].methods.length;
						  			var value = 0, valueColor = 0
						  			for (i = 0; i< methodsSize; ++i) {
							  	    	name = $scope.allMetrics[chosenMetric].methods[i].method.toString();
							  	    	causeName[name] = $scope.allMetrics[chosenMetric].methods[i].method;
							  	    	value = value + parseInt($scope.allMetrics[chosenMetric].methods[i].value);
							  	    	valueColor = valueColor + parseInt($scope.allMetrics[chosenMetric2].methods[i].value);
							  	    	structure[name] = value;
//							  	    	console.log(structure);
//							  	    	structure[name] = {"value": value, "colorValue": valueColor};
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
		  		}
				  		mapping(data, colorD);
			  }

		  function mapping(info, colorD) {
			  for (region in info) {
			        if (info.hasOwnProperty(region)) {
			            regionVal = 0;
			            regionP = {
			                id: 'id_' + regionI,
			                name: region,
//			                color: Highcharts.getOptions().colors[regionI],
			                color: colorD,
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
//			    	colorAxis: {
//			            minColor: '#f4a460',
//			            maxColor: "#181009"
//			        },
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
			    
			    console.log(info, "SAIDA");    
		  }
		  
	}

});
