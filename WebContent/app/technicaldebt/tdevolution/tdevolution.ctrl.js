homeApp = angular.module('homeApp');

homeApp.controller('TDEvolutionCtrl', function($scope, $http, $q, sidebarService){
	var thisCtrl = this;

	$scope.currentPage = sidebarService.getCurrentPage();
	$scope.tags = [];
	$scope.tagsNames = [];

	$scope.sliderTags = [];

	$scope.chartCodeDebtSeries = [];
  $scope.chartDesignDebtSeries = [];
	
	$scope.filtered.repository = sidebarService.getRepository();
	$scope.filtered.tags = sidebarService.getTags();
	$scope.filtered.debts = sidebarService.getDebts();
	$scope.tdItems = sidebarService.getTdItems();

	
  $scope.getGraphData = function(committersEmails, dateIni, dateEnd) {
	  var data = [],
	  		dates = [];
	  // Get data & dates
	  for (i in $scope.tdItems) {
	  	var dataExists = false;
	  	for (x in data) {
	  		if (data[x].key == $scope.tdItems[i].tdItem) {
	  			dataExists = true;
	  		}
	  	}
	  	if (dataExists == false) {
	  		data.push({
	  			"key": $scope.tdItems[i].tdItem,
	  			"values": []
	  		})
	  	}
	  	if (dates.indexOf($scope.tdItems[i].identificationDate.getTime()) === -1) {
	  		if (committersEmails.length > 0) {
	  			if (committersEmails.indexOf($scope.tdItems[i].occurredBy.email) > -1) {
			  		var date = getGraphDataDate($scope.tdItems[i], committersEmails, dateIni, dateEnd);
			  		if (date != null) {
			  			dates.push(date);
			  		}
	  			}
	  		} else {
		  		var date = getGraphDataDate($scope.tdItems[i], committersEmails, dateIni, dateEnd);
		  		if (date != null) {
		  			dates.push(date);
		  		}
	  		}
	  	}
	  }
	  dates.sort();
	  // Get values
	  for (i in data) {
	  	for (z in dates) {
	  		var total = 0;
	  		for (x in $scope.tdItems) {
	  			if ($scope.tdItems[x].tdItem == data[i].key && $scope.tdItems[x].identificationDate.getTime() == dates[z]) {
	  				if (committersEmails.length > 0) {
	  					if (committersEmails.indexOf($scope.tdItems[x].occurredBy.email) > -1) {
	  						total++;
	  					}
	  				} else {
	  					total++;
	  				}
	  			}
	  		}
	  		data[i].values.push([dates[z], total]);
	  	}
	  }
	  data.map(function(series) {
		  series.values = series.values.map(function(d) { 
		  	return {x: d[0], y: d[1] } 
		  });
		  return series;
		});
		return data;
  }

  function getGraphDataDate(tdItems, committersEmails, dateIni, dateEnd) {
  	var date = null;
		if (dateIni instanceof Date || dateEnd instanceof Date) {
			if (dateIni instanceof Date && dateEnd instanceof Date) { 
				if (tdItems.identificationDate.getTime() >= dateIni.getTime() && dateIni instanceof Date && tdItems.identificationDate.getTime() <= dateEnd.getTime()) {
					date = tdItems.identificationDate.getTime();
				}
			} else if (dateIni instanceof Date && tdItems.identificationDate.getTime() >= dateIni.getTime()) {
				date = tdItems.identificationDate.getTime();
			} else if (dateEnd instanceof Date && tdItems.identificationDate.getTime() <= dateEnd.getTime()) {
				date = tdItems.identificationDate.getTime();
			}
		} else {
  		date = tdItems.identificationDate.getTime();
		}
		return date;
	}






	// nvd3 START -----------------------------------------
	var graphCommitterUpdate;
	$scope.graphGlobalOptions = {
    chart: {
      type: 'lineWithFocusChart',
      height: 300,
      margin : {
        top: 20,
        right: 20,
        bottom: 60,
        left: 40
      },
      duration: 300,
      xAxis: {
        axisLabel: 'Date',
        tickFormat: function(d) {
          return d3.time.format('%b-%y')(new Date(d))
        },
        showMaxMin: false
      },
      x2Axis: {
        tickFormat: function(d) {
          return d3.time.format('%b-%y')(new Date(d))
        },
        showMaxMin: false
      },
      yAxis: {
       axisLabel: 'Y1 Axis',
        tickFormat: function(d){
            return d3.format(',f')(d);
        },
        axisLabelDistance: 12
      },
      y2Axis: {
				axisLabel: 'Y2 Axis',
        tickFormat: function(d) {
          return '$' + d3.format(',.2f')(d)
        }
    	},
      callback: function(chart){
        chart.dispatch.on('brush', function (brushExtent) {
        	graphCommitterUpdateTimeout(Math.floor(brushExtent.extent[0]), Math.floor(brushExtent.extent[1]))
				});
      }
    }
  };

  function graphCommitterUpdateTimeout(dateIni, dateEnd) {
  	clearTimeout(graphCommitterUpdate);
    graphCommitterUpdate = setTimeout(function(){ 
    	console.log('dateIni', dateIni, 'dateEnd', dateEnd)
    }, 500);
  }

	$scope.graphGlobalData = $scope.getGraphData([], new Date('2016-06-03'), new Date('2016-07-03 23:59:59'));



	
	$scope.graphCommitterData = [
		{
	    graph: $scope.getGraphData([], new Date('2016-06-03'), new Date('2016-07-03 23:59:59'))
		},
		{
	    graph: $scope.getGraphData([], new Date('2016-06-03'), new Date('2016-07-03 23:59:59'))
		},
		{
	    graph: $scope.getGraphData([], new Date('2016-06-03'), new Date('2016-07-03 23:59:59'))
		},
		{
	    graph: $scope.getGraphData([], new Date('2016-06-03'), new Date('2016-07-03 23:59:59'))
	  }
  ]



  console.log('$scope.graphCommitterData', $scope.graphCommitterData)

  $scope.graphCommitterOptions = {
    chart: {
      type: 'lineChart',
      height: 200,
      margin : {
        top: 20,
        right: 20,
        bottom: 40,
        left: 55
      },
      useInteractiveGuideline: true,
      dispatch: {
        stateChange: function(e){ console.log("stateChange"); },
        changeState: function(e){ console.log("changeState"); },
        tooltipShow: function(e){ console.log("tooltipShow"); },
        tooltipHide: function(e){ console.log("tooltipHide"); }
      },
      xAxis: {
        axisLabel: 'Date',
        tickFormat: function(d) {
          return d3.time.format('%b-%y')(new Date(d))
        },
        showMaxMin: false
      },
      yAxis: {
        axisLabel: 'Y1 Axis',
        tickFormat: function(d){
          return d3.format(',f')(d);
        },
        axisLabelDistance: 12
      }
    },
  };

  






    // nvd3 END -----------------------------------------


	thisCtrl.loadEvolutionInformation = function(repository) {
		if (repository) {
			thisCtrl.tagsLoad(repository._id);
		}	
	}

	// Load all tags (versions)
	thisCtrl.tagsLoad = function(repositoryId) { 
		console.log('tagsLoad=', repositoryId);

		 $http.get('TreeServlet', {params:{"action": "getAllTagsAndMaster", "repositoryId": repositoryId}})
		.success(function(data) {
			console.log('found', data.length, 'tags');
			$scope.tags = data;
			// thisCtrl.loadSlider();
		});
	}

	thisCtrl.loadSlider = function() {
		$scope.slider = {
        minValue: 1,
        maxValue: $scope.tags.length,
        options: {
            ceil: $scope.tags.length,
            floor: 1,
            showTicksValues: true,
            draggableRange: true,
            onEnd: function () {
            		thisCtrl.loadSliderTags();
            },
            translate: function (value) {
                return $scope.tags[value-1].name;
            }
        }
  	};
  	thisCtrl.loadSliderTags();
	}

	thisCtrl.loadSliderTags = function() {
		var listTypesByTags = [];
		var request = thisCtrl.getListOfTypesByListOfTags(listTypesByTags);

		$q.all([request]).then(function() {
			$scope.tagsNames = [];
			$scope.sliderTags = [];
			$scope.chartCodeDebtSeries = [];
			$scope.chartDesignDebtSeries = []; 
			var j = 0;

			for (var i = $scope.slider.minValue-1; i < $scope.slider.maxValue; i++) {
					$scope.tagsNames.push($scope.tags[i].name);

					var tag = {
						tag: null,
						types: [],
						totalSmells: 0,
						totalDebts: 0
					};
					tag.tag = $scope.tags[i];
					tag.types = listTypesByTags[j];
					j++;

					var totalCodeDebt = thisCtrl.getTotalOfCodeDebts(tag.types);
					var totalDesignDebt = thisCtrl.getTotalOfDesignDebts(tag.types)
					$scope.chartCodeDebtSeries.push(totalCodeDebt);
					$scope.chartDesignDebtSeries.push(totalDesignDebt);

					tag.totalDebts = totalCodeDebt + totalDesignDebt;
					thisCtrl.getTotalOfCodeSmells(tag, tag.types);
					$scope.sliderTags.push(tag);
			}
			thisCtrl.loadColumnChart();
		});
	}

	thisCtrl.getListOfTypesByListOfTags = function(list) {
		var ids = [];
		for (var i = $scope.slider.minValue-1; i < $scope.slider.maxValue; i++) {
			ids.push($scope.tags[i]._id);
		}
		return $http.get('TypeServlet', {params:{"action": "getListOfTypesByListOfTags", "ids": JSON.stringify(ids)}})
		.success(function(data) {
			for (var j = 0; j < data.length; j++) 
				list.push(data[j]);
		});
	}

	thisCtrl.getTotalOfCodeSmells = function(tag, types) {
		var total = 0;
		for (var i = 0; i < types.length; i++) {
			if (types[i].abstract_types[0]) {
				var smells = types[i].abstract_types[0].codesmells;
				for (var j = 0; j < smells.length; j++) {
					if (smells[j].value) {
						total++;
					}
				}
			}	
		}	
		tag.totalSmells = total;
	}

	thisCtrl.getTotalOfDesignDebts = function(types) {
		var total = 0;
		for (var i = 0; i < types.length; i++) {
			if (types[i].abstract_types[0]) {
				var debt = types[i].abstract_types[0].technicaldebts[0];
				if (debt.value && debt.status == 1) {
					total++;
				}
			}	
		}	
		return total;
	}

	thisCtrl.getTotalOfCodeDebts = function(types) {
		var total = 0;
		for (var i = 0; i < types.length; i++) {
			if (types[i].abstract_types[0]) {
				var debt = types[i].abstract_types[0].technicaldebts[1];
				if (debt.value && debt.status == 1) {
					total++;
				}
			}	
		}	
		return total;
	}

	// thisCtrl.loadEvolutionInformation($scope.filtered.repository); 

});