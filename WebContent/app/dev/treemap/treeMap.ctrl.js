homeApp = angular.module('homeApp');

homeApp.controller('DEVTreeMapCtrl', function($scope,$http, $location, $route, $timeout, sidebarService){

	$scope.currentPage = sidebarService.getCurrentPage();
	$scope.allmetrics;
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
			
			  $http.get('rest/commits/get-commit', {params:{"commitId": $scope.commits[$scope.max]}})
				.success(function(response) {
					//makeMap(response);
					c1 = response[0]._id;
					//setCommits(response[0]._id);
					$http.get('rest/commits/get-commit', {params:{"commitId": $scope.commits[$scope.min]}})
					.success(function(response2) {
						//makeMap(response);
						c2 = response2[0]._id;
						console.log(c1, c2);
						setCommits(c1, c2);
						
					});
				});
			  
			  
			  
			  
		  }
		  	function setCommits(commit1, commit2) {
		  		commitsHash.push(commit1);
		  		commitsHash.push(commit2);
		  		teste(commitsHash);
		  	}
		  
		  	function teste (commits) {
		  		var obj, obj2;
		  		$http.get('rest/wDirectories/get-by-id', {params: {"fileHash": commits[0], "fileHash2": commits[1]}}).success(function (response){
		  			console.log("Response: ", response);
		  			for (obj in response.commit1) {
		  				for(obj2 in response.commit2){
		  					if( obj2 === obj) {
		  						console.log("Um igual");
		  					}
		  				}
		  			}
		  		});
		  	}
		  	
		  
		  	function makeMap(data) {
		  		var count, diffCounter, commitID, diffHash, filesHash, countHash = [];
		  		for (count = 0;count < data.length; ++count) {
		  			$http.get('rest/wDirectories/get-by-id', {params: {"fileHash": data[count]._id, "fileHash2": data[count]._id}}).success(function (response){
		  				var responseSize = response.length, a;
				  		for (a = 0; a < responseSize; ++a) {
				  			if(response[a].package){
				  				var packName = response[a].package.toString();
					  			packName = packName.split(".").pop();
				  			}


				  			if(!data[packName]) {
				  				data[packName] = {};
				  			}
				  			

					  		var chosenMetric = $("select[name=metrics]").val();
					  		$scope.allMetrics = response[a].abstract_types[0];

					  		var structure = {

					  		};
					  		var lastClazz;

					  		var clazzName = response[a].filename.toString();
				  			clazzName =  clazzName.split("/").pop();
				  			if( lastClazz !== clazzName) {

				  				clazz = {

				  				};
				  				lastClazz = clazzName;
				  			}

					  		if ($scope.allMetrics && packName){
					  			if($scope.allMetrics.metrics[chosenMetric].methods) {
						  			var methodsSize = $scope.allMetrics.metrics[chosenMetric].methods.length;
						  			var value = 0;
						  			for (i = 0; i< methodsSize; ++i) {
							  	    	name = $scope.allMetrics.metrics[chosenMetric].methods[i].method.toString();
							  	    	causeName[name] = $scope.allMetrics.metrics[chosenMetric].methods[i].method;
							  	    	value = value + parseInt($scope.allMetrics.metrics[chosenMetric].methods[i].value);
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

				  		}
				  		mapping(data);
		  				
		  			});
		  		}
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
