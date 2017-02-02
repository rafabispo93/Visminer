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
			    var chart = Highcharts.chart('container', options);
			    console.timeEnd("highcharts");
		  }
		  
	}
	
	$(document).on('click', function () {
		$(".highcharts-text-outline").on('click', function (e) { 
			 $scope.eleClicked = $(this).text();
			 var dataParallel = {};
			 console.log("ENTROU AQUI");
			 for (var count = 0; count < $scope.tagsLoaded.length; count++) {
				 $http.get('rest/tags/get-tags-reference', {params: {"tag": $scope.tagsLoaded[count].name, "repositoryId":$scope.repoSelected }}).success(function (tagRes){
					 		$http.get('rest/wDirectories/get-by-id-parallel', {params: {"fileHash": tagRes.commit, "version": tagRes.version, "eleClicked": $scope.eleClicked}}).success(function (response){
//								 console.log(response, tagRes.version);
					 			 veTag = tagRes.version;
								 dataParallel.veTag = response;
							 });
						  }); 
			 }
			 
//			 console.log(dataParallel);
			 
			 codeParallel(dataParallel);
			 
		});
//		$(function() {
//		  $.contextMenu({
//		      selector: ".highcharts-text-outline", 
//		      callback: function(key, options) {
//		          var m = "clicked: " + key;
//		          console.log(eleClicked);
////		          $(".highcharts-text-outline").on("click", function (e) { 
////		 			 eleClicked = $(this).text();
////		 			 console.log($(this).text());
////		 			 codeParallel(eleClicked);
////		 		  });
//		          
//		      },
//		      items: {
//		          "open": {name: "Open on Parallel Coordinates", icon: "edit"}
//		      }
//		  });  
//		});
		

	});
	
	function codeParallel (dataParallel) {
		var INACTIVE_OPACITY = .67
//		var obj = JSON.parse(dataParallel);
		console.log(Object.keys(dataParallel));
		// This is input.
		var isDiscrete = [false, false, false, false, ['setosa', 'versicolor', 'virginica']];
//		var axis_texts = ['sepal length', 'sepal width', 'petal length', 'petal width', 'iris'];
		var axis_texts = [];
		var data = [
		    [5.1, 3.5, 1.4, .2, null],
		    [4.9, 3, 1.4, .2, 0],
		    [7, 3.2, null, 1.4, 1],
		    [6.3, 2.9, 5.6, 1.8, 2],
		    [2.9, 5.6, 1.8, 1.5, 2],
		    [5.2, 3, 4, 1.1, 1],
		    [3.2, 1.5, 1.8, .2, 1],
		];
		
		/** Transpose the data to get columns */
		var colData = [];
		for (var j=0; j<data[0].length; ++j) {
			colData[j] = [];
			for (var i=0; i<data.length; ++i)
		    	colData[j][i] = data[i][j];
		}

		/** Get per-column extremes and scale columns onto [0, 1] */
		var colLimits = [];
		function nonNull(el) { return el != null; };
		for (var j=0, col; j<colData.length; ++j) {
			col = colData[j];
			var nncol = col.filter(nonNull);
			colLimits.push([Math.min.apply(null, nncol), 
		                    Math.max.apply(null, nncol)]);
		    for (var i=0, val; i<col.length; ++i) {
		    	val = col[i];
		    	if (nonNull(val))
		        	data[i][j] = colData[j][i] = (val - colLimits[j][0]) / (colLimits[j][1] - colLimits[j][0]);
		    }
		}
		console.log(data);

		/** Convert value from [0, 1] back to columns real span */
		function toValue(value, column) {
			return value * (colLimits[column][1] - colLimits[column][0]) + colLimits[column][0];
		}

		/** Align yAxes onto the integer ticks of the xAxis.
		 */
		var _in_redraw = false;
		function reposition_yaxes() {
		    if (_in_redraw)
		        return;
		    _in_redraw = true;
		    var ax = this.xAxis[0],
		        ex = ax.getExtremes(),
		        spacing = (ax.toPixels(ex.max) - ax.toPixels(ex.min)) / (ex.max - ex.min);
		    for (var i=1; i<this.yAxis.length; ++i)
		        this.yAxis[i].update({offset: - (i - 1) * spacing}, false);
		    this.redraw(false);
		    _in_redraw = false;
		}

		$(function () {

			function labels_formatter(col) {
		    	return {
		        	reserveSpace: false,
		            x: -3,
		        	formatter: function() {
		                var value = toValue(this.value, col);
		                return isDiscrete[col][Math.round(value)] || Highcharts.numberFormat(value, 2);
		            }
		        };
		    };
		    
		    Highcharts.setOptions({
		    	chart: {
		            zoomType: 'y',
		            alignTicks: false,
		            events: { redraw: reposition_yaxes }
		        },
		        tooltip: {
		            shared: false,
		            followPointer: true,
		            formatter: function() {
		            	if (this.series.color == 'transparent')
		                	return false;
		            	var str = [],
		                    yAxis = this.series.chart.yAxis,
		                    data = this.series.data;
		                for (var i=0, value; i<data.length; ++i) {
		                	value = '—';
		                    if (data[i] && !data[i].isNull) {
		                    	value = toValue(data[i].y, i);
		                        if (isDiscrete[i])
		                        	value = isDiscrete[i][value];
		                    }
		                	str.push('<b>' + yAxis[i + 1].userOptions.title.text + ':</b> ' + value);
		                }
		                return str.join('<br>');
		            },
		        },
		        legend: {
		        	enabled: false
		        },
		        plotOptions: {
		        	series: { 
		            	marker: {
		                	enabled: false,
		                    states: {
		                    	hover: { enabled: false }
		                    }
		                },
		                events: {
		                    mouseOver: function() {
		                        this.group.toFront();
		                        this.group.attr('opacity', 1);
		                        this.chart.tooltip.refresh(this.data[0]);
		                    },
		                    mouseOut: function() {
		                    	this.group.attr('opacity', INACTIVE_OPACITY);
		                    }
		                },
		                states: {
		                	hover: { lineWidthPlus: 2 }
		                }
		            },
		            line: { lineWidth: .8 }
		        },
		        xAxis: { 
		        	visible: false,
		            maxPadding: 0,
		            minPadding:0,
		            max: colData.length - 1,
		        },
		        yAxis: {
		        	lineWidth: 1,
		            lineColor: 'black',
		            max: 1,
		            min: 0,
		            gridLineWidth: 0,
					title: {
		            	align: 'high',
		                rotation: 0,
		                y: -10,
		                style: {
		                	fontWeight: 'bold',
		                }
		            }
		        }
		    });
		    $('#container').highcharts({
		        chart: {
		            type: 'line',
		        },
		        yAxis: [{
		            visible: false,
		        }, {
		            title: {text: axis_texts[0]},
		            labels: labels_formatter(0),
		        }, {
		            title: {text: axis_texts[1]},
		            labels: labels_formatter(1),
		        }, {
		        	title: {text: axis_texts[2]},
		            labels: labels_formatter(2),
		        }, {
		            title: {text: axis_texts[3]},
		            labels: labels_formatter(3),
		        }, {
		        	title: {text: axis_texts[4]},
		            tickPositions: $.unique(colData[4].sort().filter(nonNull)).reverse(),
		            labels: labels_formatter(4),
		        }],
		        
		        series: [
		        /** These series are only here so that yAxes get their ticks' labels */
		        {
		            color: 'transparent',
		            data: colData[0],
		            yAxis: 1
		        }, {
		            color: 'transparent',
		            data: colData[1],
		            yAxis: 2
		        }, {
		            color: 'transparent',
		            data: colData[2],
		            yAxis: 3
		        }, {
		            color: 'transparent',
		            data: colData[3],
		            yAxis: 4
		        }, {
		            color: 'transparent',
		            data: colData[4],
		            yAxis: 5
		        },
		        
		        
		        {
		            data: data[0],
		        }, {
		            data: data[1],
		        }, {
		            data: data[2],
		        },  {
		            data: data[3],
		        },  {
		            data: data[4],
		        },  {
		            data: data[5],
		        },]
		    }, function(chart) {
		    	chart.redraw();
		        chart.redraw();
		        
		        // Center yAxis labels
		        $('.highcharts-yaxis-title').each(function(i) {
		            chart.yAxis[i + 1].update({
		            	title: {offset: -this.getBBox().width/2}
		            }, false);
		        });
		        // Decrease color opacity
		        $.each(chart.series, function(i, series) {
		        	series.graph.attr('opacity', INACTIVE_OPACITY);
		        });
		        chart.redraw();
		    });
		});
	}
	
});


