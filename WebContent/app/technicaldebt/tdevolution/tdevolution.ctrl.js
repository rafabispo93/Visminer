homeApp = angular.module('homeApp');

homeApp.controller('TDEvolutionCtrl', function($scope, $http, $q, sidebarService){
	var thisCtrl = this;

	$scope.currentPage = sidebarService.getCurrentPage();
	$scope.tags = [];
	$scope.tagsNames = [];

	$scope.sliderTags = [];

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
      title: {
        enable: true,
        text: 'Technical Debt Total'
      },
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

	$scope.graphGlobalData = $scope.getGraphData([], new Date('2016-06-03'), new Date('2016-07-03 23:59:59'));
	$scope.graphCommitterData = [];
	
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
  $scope.getGraphCommitterData = function(dateIni, dateEnd) {
  	var committers = [];
  	for (i in $scope.tdItems) {
			var committersExists = false;
			var tdItem = $scope.tdItems[i];
			if (dateIni <= tdItem.identificationDate && tdItem.identificationDate <= dateEnd) {
	  		for (x in committers) {
	  			if (committers[x].email == tdItem.occurredBy.email) {
	  				committersExists = true;
	  				committers[x].lines.added += tdItem.diffs.added;
	  				committers[x].lines.removed += tdItem.diffs.removed;
	  				committers[x].principal += tdItem.principal;
	  				break;
	  			}
	  		}
	  		if (committersExists == false) {
	  			tdItem.occurredBy.principal = tdItem.principal;
	  			tdItem.occurredBy.lines = {
	  				added: tdItem.diffs.added,
	  				removed: tdItem.diffs.removed
	  			}
	  			committers.push(tdItem.occurredBy);
	  		}
			}
  	}
  	var data = [];
  	for (i in committers) {
  		data.push({
  			occurredBy: committers[i],
  			graph: $scope.getGraphData([committers[i].email], new Date(dateIni), new Date(dateEnd))
  		})
  	}
  	return data;
  }

  function graphCommitterUpdateTimeout(dateIni, dateEnd) {
  	clearTimeout(graphCommitterUpdate);
    graphCommitterUpdate = setTimeout(function(){ 
  		$scope.graphCommitterData = $scope.getGraphCommitterData(dateIni, dateEnd);
      $scope.$apply();
    }, 500);
  }

  if ($scope.currentPage == 'tdevolution') {
  	$scope.tdItems = sidebarService.getTdItems();
  	console.log('$scope.tdItems', $scope.tdItems)
  	$scope.graphCommitterData = $scope.getGraphCommitterData(new Date('2010-06-03'), new Date('2020-07-03 23:59:59'));
  }

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
		});
	}
});