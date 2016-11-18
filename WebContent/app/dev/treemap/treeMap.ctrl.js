homeApp = angular.module('homeApp');

homeApp.controller('DEVTreeMapCtrl', function($scope,$http, $location, $route, $timeout, sidebarService){
	
	$scope.currentPage = sidebarService.getCurrentPage();
	$scope.allmetrics;
	if ($scope.currentPage == 'treeMap') {
		// This controller instance
		  var thisCtrl = this;
		  var data = {
	        	};
		  $scope.slider = {
				    minValue: 0,
				    maxValue: $scope.commits.length / 2,
				    options: {
				        floor: 0,
				        ceil: $scope.commits.length,
				        step: 1
				    }
				};
		  $scope.generate = function (commit) {
			  makeMap(commit);
		  }
		  	function makeMap(commit) { 
			  	$http.get('TypeServlet', {params:{"action": "getAllByCommit", "idCommit": $scope.commits[commit]._id}})
			  	.success(function(response) {
			  		console.log(response);
			  		var responseSize = response.length, a;
			  		
			  		
			  		var causeName = {
				            
			        };
			  		
			  		var clazz = {
			  				
			  		};
			  	
			  		
			  		for (a = 0; a < responseSize; ++a) {
			  			if(response[a].package){
			  				var packName = response[a].package.toString();
				  			packName = packName.split(".").pop();
			  			}
			  			
			  			
			  			if(!data[packName]) {
			  				data[packName] = {};
			  			}
			  			
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
				  		
					    for (region in data) {
					        if (data.hasOwnProperty(region)) {
					            regionVal = 0;
					            regionP = {
					                id: 'id_' + regionI,
					                name: region,
					                color: Highcharts.getOptions().colors[regionI],
					                borderColor:"#000000"
					            };
					            countryI = 0;
					            for (country in data[region]) {
					                if (data[region].hasOwnProperty(country)) {
					                    countryP = {
					                        id: regionP.id + '_' + countryI,
					                        name: country,
					                        parent: regionP.id,
					                        borderColor:"#fff000"
					                    };
					                    points.push(countryP);
					                    causeI = 0;
					                    for (cause in data[region][country]) {
					                        if (data[region][country].hasOwnProperty(cause)) {
					                            causeP = {
					                                id: countryP.id + '_' + causeI,
					                                name: causeName[cause],
					                                parent: countryP.id,
					                                value: Math.round(+data[region][country][cause]),
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
					    var chart = $('.high').highcharts({
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
					    });
			  		}
			  		console.log(data);
			  });
			  	
		  }
		  	
	}
	
});