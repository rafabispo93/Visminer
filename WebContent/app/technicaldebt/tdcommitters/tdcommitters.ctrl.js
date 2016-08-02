homeApp = angular.module('homeApp');

homeApp.controller('TDCommittersCtrl', function ($scope, $http, $q, sidebarService) {

	var thisCtrl = this;
	$scope.currentPage = sidebarService.getCurrentPage();
	$scope.filtered.repository = sidebarService.getRepository();
	$scope.filtered.debts = sidebarService.getDebts();
	$scope.tdItems = sidebarService.getTdItems();
  $scope.tdIndicators = [];
  $scope.committersByDate = {
    commits: [],
    files: [],
    linesAdded: 0,
    principal: 0
  };
  $scope.committersTotal = {
    commits: [],
    files: [],
    linesAdded: 0,
    principal: 0
  };

  $scope.getGraphData = function(committersEmails, dateIni, dateEnd) {
	  var data = [],
	  		dates = [];
	  // Get data & dates
	  for (i in $scope.tdItems) {
      if ($scope.tdItems[i].isTdItem) {
        var dataExists = false;
        for (x in data) {
          if (data[x].key == $scope.tdItems[i].tdIndicator.name) {
            dataExists = true;
          }
        }
        if (dataExists == false) {
          data.push({
            "key": $scope.tdItems[i].tdIndicator.name,
            "values": []
          })
        }
        if (dates.indexOf($scope.tdItems[i].commit.date.getTime()) === -1) {
          if (committersEmails.length > 0) {
            if (committersEmails.indexOf($scope.tdItems[i].committer.email) > -1) {
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
	  }
	  dates.sort();
	  // Get values
	  for (i in data) {
	  	for (z in dates) {
	  		var total = 0;
	  		for (x in $scope.tdItems) {
	  			if ($scope.tdItems[x].tdIndicator.name == data[i].key && $scope.tdItems[x].commit.date.getTime() == dates[z]) {
	  				if (committersEmails.length > 0) {
	  					if (committersEmails.indexOf($scope.tdItems[x].committer.email) > -1) {
	  						total++;
	  					}
	  				} else {
	  					total++;
	  				}
            addToTotal($scope.tdItems[x]);
	  			}
	  		}
	  		data[i].values.push([dates[z], total]);
	  	}
	  }
		return data;
  }

  function getGraphDataDate(tdItems, committersEmails, dateIni, dateEnd) {
  	var date = null;
		if (dateIni instanceof Date || dateEnd instanceof Date) {
			if (dateIni instanceof Date && dateEnd instanceof Date) { 
				if (tdItems.commit.date.getTime() >= dateIni.getTime() && dateIni instanceof Date && tdItems.commit.date.getTime() <= dateEnd.getTime()) {
					date = tdItems.commit.date.getTime();
				}
			} else if (dateIni instanceof Date && tdItems.commit.date.getTime() >= dateIni.getTime()) {
				date = tdItems.commit.date.getTime();
			} else if (dateEnd instanceof Date && tdItems.commit.date.getTime() <= dateEnd.getTime()) {
				date = tdItems.commit.date.getTime();
			}
		} else {
  		date = tdItems.commit.date.getTime();
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
          return d3.time.format('%d-%b-%y')(new Date(d))
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

  var graphData = $scope.getGraphData([], new Date('2000-01-01'), new Date('2100-01-01 00:00:00'));
  console.log('graphData', graphData)
	$scope.graphGlobalData = graphData.map(function(series) {
    series.values = series.values.map(function(d) { 
      return {x: d[0], y: d[1] } 
    });
    return series;
  });
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
      yDomain1: [0, 100],
      useInteractiveGuideline: true,
      // dispatch: {
      //   stateChange: function(e){ console.log("stateChange"); },
      //   changeState: function(e){ console.log("changeState"); },
      //   tooltipShow: function(e){ console.log("tooltipShow"); },
      //   tooltipHide: function(e){ console.log("tooltipHide"); }
      // },
      xAxis: {
        axisLabel: 'Date',
        tickFormat: function(d) {
          return d3.time.format('%d-%b-%y')(new Date(d))
        },
        showMaxMin: false
      },
      yAxis: {
        axisLabel: 'Y Axis',
        tickFormat: function(d){
          return d3.format(',f')(d);
        },
        // axisLabelDistance: 12
      }
    },
  };
  $scope.getGraphCommitterData = function(dateIni, dateEnd) {
  	var committers = [];
  	for (i in $scope.tdItems) {
      if ($scope.tdItems[i].isTdItem) {
        var committersExists = false;
        var tdItem = $scope.tdItems[i];
        if (dateIni <= tdItem.commit.date && tdItem.commit.date <= dateEnd) {
          for (x in committers) {
            if (committers[x].email == tdItem.committer.email) {
              committersExists = true;
              if (committers[x].commits.indexOf(tdItem.commit.id) == -1) {
                committers[x].commits.push(tdItem.commit.id);
              }
              if (typeof tdItem.tdIndicator.file != 'undefined' && committers[x].files.indexOf(tdItem.tdIndicator.file) == -1) {
                committers[x].files.push(tdItem.tdIndicator.file);
              }
              committers[x].lines.added += tdItem.commit.diffs.linesAdded;
              committers[x].lines.removed += tdItem.commit.diffs.linesRemoved;
              committers[x].principal += tdItem.principal;
              break;
            }
          }
          if (committersExists == false) {
            tdItem.committer.commits = [tdItem.commit.id];
            tdItem.committer.files = [];
            if (typeof tdItem.tdIndicator.file != 'undefined') {
              tdItem.committer.files.push(tdItem.tdIndicator.file);
            }
            tdItem.committer.lines = {
              added: tdItem.commit.diffs.linesAdded,
              removed: tdItem.commit.diffs.linesRemoved
            }
            tdItem.committer.principal = (tdItem.principal == null) ? 0 : tdItem.principal;
            committers.push(tdItem.committer);
          }
        }
      }
  	}
  	var data = [];
    $scope.committersByDate = {
      commits: [],
      files: [],
      linesAdded: 0,
      principal: 0
    };
  	for (i in committers) {
  		data.push({
  			committer: committers[i],
  			graph: $scope.getGraphData([committers[i].email], new Date(dateIni), new Date(dateEnd)).map(function(series) {
          series.values = series.values.map(function(d) { 
            return {x: d[0], y: d[1] } 
          });
          return series;
        })
  		})
  	}
    updateTdIndicators(data);
  	return data;
  }

  function graphCommitterUpdateTimeout(dateIni, dateEnd) {
  	clearTimeout(graphCommitterUpdate);
    graphCommitterUpdate = setTimeout(function(){ 
  		$scope.graphCommitterData = $scope.getGraphCommitterData(dateIni, dateEnd);
      $scope.$apply();
    }, 500);
  }

  $scope.selectView = function(view) {
  	console.log('selectView', view)
		$scope.currentPage = view;
		sidebarService.setCurrentPage(view);
	}

  $scope.getGraphPercent = function(location, committer) {
    if (location == 'commits') {
      return parseInt(committer.commits.length/$scope.committersByDate.commits.length*100);
    } else if (location == 'files') {
      return (committer.files.length == 0 || $scope.committersByDate.files.length == 0) ? 0 : parseInt(committer.files.length/$scope.committersByDate.files.length*100);
    } else if (location == 'lines') {
      return parseInt(committer.lines.added/$scope.committersByDate.linesAdded*100);
    } else if (location == 'principal') {
      return (committer.principal == 0 || $scope.committersByDate.principal == 0) ? 0 : parseInt(committer.principal/$scope.committersByDate.principal*100);
    } else {
      return 0;
    }
  }

  function addToTotal(tdItem){
    if ($scope.committersByDate.commits.indexOf(tdItem.commit.id) == -1) {
      $scope.committersByDate.commits.push(tdItem.commit.id);
    }
    if (typeof tdItem.tdIndicator.file != 'undefined' && $scope.committersByDate.files.indexOf(tdItem.tdIndicator.file) == -1) {
      $scope.committersByDate.files.push(tdItem.tdIndicator.file);
    }
    $scope.committersByDate.linesAdded += tdItem.commit.diffs.linesAdded;
    if (tdItem.principal != null) {
      $scope.committersByDate.principal += tdItem.principal;
    }
  }

  function createTdIndicators() {
    $scope.tdIndicators = [];
    for (i in $scope.tdItems) {
      var exists = false;
      for (x in $scope.tdIndicators) {
        if ($scope.tdIndicators[x].name == $scope.tdItems[i].tdIndicator.name) {
          exists = true;
          break;
        }
      }
      if (exists) {
        $scope.tdIndicators[x].qttyMax += 1; 
      } else {
        $scope.tdIndicators.push({
          name: $scope.tdItems[i].tdIndicator.name,
          qtty: 0,
          qttyMax: 1
        })
      }
    }
  }

  function updateTdIndicators(data) {
    createTdIndicators();
    for (i in data) {
      for (x in data[i].graph) {
        for (z in $scope.tdIndicators) {
          if ($scope.tdIndicators[z].name == data[i].graph[x].key) {
            for (v in data[i].graph[x].values) {
              $scope.tdIndicators[z].qtty += data[i].graph[x].values[v].y;
            }
            break;
          }
        }
      }
    }
    setTimeout(function(){ 
      $(".knob").knob();
    }, 500);
  }

  if ($scope.currentPage == 'tdcommiters') {
  	console.log("$scope.currentPage == 'tdcommiters'")
  	$scope.tdItems = sidebarService.getTdItems();
  	$scope.graphCommitterData = $scope.getGraphCommitterData(new Date('2000-01-01'), new Date('2100-01-01 00:00:00'));
  }
});