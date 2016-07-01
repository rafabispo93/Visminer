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
	console.log('$scope.tdItems', $scope.tdItems)


	
  $scope.getGraphGlobalData = function() {
	  var data = [
	  	/*{
	      "key": "Duplicated Code" ,
	      "values": [ [ 1136005200000 , 71.89] , [ 1138683600000 , 75.51] , [ 1141102800000 , 68.49] , [ 1143781200000 , 62.72] , [ 1146369600000 , 70.39] , [ 1149048000000 , 59.77] , [ 1151640000000 , 57.27] , [ 1154318400000 , 67.96] , [ 1156996800000 , 67.85] , [ 1159588800000 , 76.98] , [ 1162270800000 , 81.08] , [ 1164862800000 , 91.66] , [ 1167541200000 , 84.84] , [ 1170219600000 , 85.73] , [ 1172638800000 , 84.61] , [ 1175313600000 , 92.91] , [ 1177905600000 , 99.8] , [ 1180584000000 , 121.191] , [ 1183176000000 , 122.04] , [ 1185854400000 , 131.76] , [ 1188532800000 , 138.48] , [ 1191124800000 , 153.47] , [ 1193803200000 , 189.95] , [ 1196398800000 , 182.22] , [ 1199077200000 , 198.08] , [ 1201755600000 , 135.36] , [ 1204261200000 , 125.02] , [ 1206936000000 , 143.5] , [ 1209528000000 , 173.95] , [ 1212206400000 , 188.75] , [ 1214798400000 , 167.44] , [ 1217476800000 , 158.95] , [ 1220155200000 , 169.53] , [ 1222747200000 , 113.66] , [ 1225425600000 , 107.59] , [ 1228021200000 , 92.67] , [ 1230699600000 , 85.35] , [ 1233378000000 , 90.13] , [ 1235797200000 , 89.31] , [ 1238472000000 , 105.12] , [ 1241064000000 , 125.83] , [ 1243742400000 , 135.81] , [ 1246334400000 , 142.43] , [ 1249012800000 , 163.39] , [ 1251691200000 , 168.21] , [ 1254283200000 , 185.35] , [ 1256961600000 , 188.5] , [ 1259557200000 , 199.91] , [ 1262235600000 , 210.732] , [ 1264914000000 , 192.063] , [ 1267333200000 , 204.62] , [ 1270008000000 , 235.0] , [ 1272600000000 , 261.09] , [ 1275278400000 , 256.88] , [ 1277870400000 , 251.53] , [ 1280548800000 , 257.25] , [ 1283227200000 , 243.1] , [ 1285819200000 , 283.75] , [ 1288497600000 , 300.98] , [ 1291093200000 , 311.15] , [ 1293771600000 , 322.56] , [ 1296450000000 , 339.32] , [ 1298869200000 , 353.21] , [ 1301544000000 , 348.5075] , [ 1304136000000 , 350.13] , [ 1306814400000 , 347.83] , [ 1309406400000 , 335.67] , [ 1312084800000 , 390.48] , [ 1314763200000 , 384.83] , [ 1317355200000 , 381.32] , [ 1320033600000 , 404.78] , [ 1322629200000 , 382.2] , [ 1325307600000 , 405.0] , [ 1327986000000 , 456.48] , [ 1330491600000 , 542.44] , [ 1333166400000 , 599.55] , [ 1335758400000 , 583.98]]
	    },
	    {
	      "key": "Long Method" ,
	      "values": [ [ 1136005200000 , 71.89] , [ 1138683600000 , 75.51] , [ 1141102800000 , 68.49] , [ 1143781200000 , 62.72] , [ 1146369600000 , 70.39] , [ 1149048000000 , 59.77] , [ 1151640000000 , 57.27] , [ 1154318400000 , 67.96] , [ 1156996800000 , 67.85] , [ 1159588800000 , 76.98] , [ 1162270800000 , 81.08] , [ 1164862800000 , 91.66] , [ 1167541200000 , 84.84] , [ 1170219600000 , 85.73] , [ 1172638800000 , 84.61] , [ 1175313600000 , 92.91] , [ 1177905600000 , 99.8] , [ 1180584000000 , 121.191] , [ 1183176000000 , 122.04] , [ 1185854400000 , 131.76] , [ 1188532800000 , 138.48] , [ 1191124800000 , 153.47] , [ 1193803200000 , 189.95] , [ 1196398800000 , 182.22] , [ 1199077200000 , 198.08] , [ 1201755600000 , 135.36] , [ 1204261200000 , 125.02] , [ 1206936000000 , 143.5] , [ 1209528000000 , 173.95] , [ 1212206400000 , 188.75] , [ 1214798400000 , 167.44] , [ 1217476800000 , 158.95] , [ 1220155200000 , 169.53] , [ 1222747200000 , 113.66] , [ 1225425600000 , 107.59] , [ 1228021200000 , 92.67] , [ 1230699600000 , 85.35] , [ 1233378000000 , 90.13] , [ 1235797200000 , 89.31] , [ 1238472000000 , 105.12] , [ 1241064000000 , 125.83] , [ 1243742400000 , 135.81] , [ 1246334400000 , 142.43] , [ 1249012800000 , 163.39] , [ 1251691200000 , 168.21] , [ 1254283200000 , 185.35] , [ 1256961600000 , 188.5] , [ 1259557200000 , 199.91] , [ 1262235600000 , 210.732] , [ 1264914000000 , 192.063] , [ 1267333200000 , 204.62] , [ 1270008000000 , 235.0] , [ 1272600000000 , 261.09] , [ 1275278400000 , 256.88] , [ 1277870400000 , 251.53] , [ 1280548800000 , 257.25] , [ 1283227200000 , 243.1] , [ 1285819200000 , 283.75] , [ 1288497600000 , 300.98] , [ 1291093200000 , 311.15] , [ 1293771600000 , 322.56] , [ 1296450000000 , 339.32] , [ 1298869200000 , 353.21] , [ 1301544000000 , 348.5075] , [ 1304136000000 , 350.13] , [ 1306814400000 , 347.83] , [ 1309406400000 , 335.67] , [ 1312084800000 , 390.48] , [ 1314763200000 , 384.83] , [ 1317355200000 , 381.32] , [ 1320033600000 , 404.78] , [ 1322629200000 , 382.2] , [ 1325307600000 , 405.0] , [ 1327986000000 , 456.48] , [ 1330491600000 , 542.44] , [ 1333166400000 , 599.55] , [ 1335758400000 , 583.98]]
	    }*/
	  ];
	  var dates = [];
	  for (i in $scope.tdItems) {
	  	dates.push($scope.tdItems[i].identificationDate.getTime());
	  }
	  
	  data.push(generateObj('Duplicated Code', 50, 1, 30));
		data.push(generateObj('Long Method', 50, 1, 30));
		return data;
  }

  	// nvd3 START -----------------------------------------
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
      	}
      }
    };
  	$scope.graphGlobalData = $scope.getGraphGlobalData();
  	$scope.graphGlobalData.map(function(series) {
  	  series.values = series.values.map(function(d) { return {x: d[0], y: d[1] } });
  	  return series;
  	});



  	$scope.graphCommitterOptions = {
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
      	}
      }
    };



  	$scope.graphCommitterData = {
      data1: [],
      data2: [],
      data3: [],
      data4: [],
    }

    console.log('$scope.graphCommitterData', $scope.graphCommitterData)

  $scope.optionsx = {
    chart: {
      type: 'lineChart',
      height: 200,
      margin : {
        top: 20,
        right: 20,
        bottom: 40,
        left: 55
      },
      x: function(d){ return d.x; },
      y: function(d){ return d.y; },
      useInteractiveGuideline: true,
      dispatch: {
        stateChange: function(e){ console.log("stateChange"); },
        changeState: function(e){ console.log("changeState"); },
        tooltipShow: function(e){ console.log("tooltipShow"); },
        tooltipHide: function(e){ console.log("tooltipHide"); }
      },
      xAxis: {
        axisLabel: 'Time (ms)'
      },
      yAxis: {
        axisLabel: 'Voltage (v)',
        tickFormat: function(d){
          return d3.format('.02f')(d);
        },
        axisLabelDistance: -10
      }
    },
    // title: {
    //   enable: true,
    //   text: 'Title for Line Chart'
    // }
  };

  $scope.datax = sinAndCos();

  /*Random Data Generator */
  function sinAndCos() {
    var sin = [],
        cos = [];

    //Data is represented as an array of {x,y} pairs.
    for (var i = 0; i < 100; i++) {
      // sin.push({x: i, y: Math.sin(i/10)});
      sin.push({x: i, y: .6 * Math.cos(i/10+ 2) + Math.random() / 10});
      cos.push({x: i, y: .5 * Math.cos(i/10+ 2) + Math.random() / 10});
    }
    //Line chart data should be sent as an array of series objects.
    return [
      {
        values: sin,      //values - represents the array of {x,y} data points
        key: 'Sine Wave', //key  - the name of the series.
        color: '#ff7f0e',  //color - optional: choose your own line color.
        // strokeWidth: 2,
        // classed: 'dashed'
      },
    	{
        values: cos,
        key: 'Cosine Wave',
        color: '#2ca02c'
      }
    ];
  };


  	$scope.graphCommitterData.data1.push(generateObj('Duplicated Code', 50, 1, 30));
  	$scope.graphCommitterData.data2.push(generateObj('Duplicated Code', 50, 1, 30));
  	$scope.graphCommitterData.data3.push(generateObj('Duplicated Code', 50, 1, 30));
  	$scope.graphCommitterData.data4.push(generateObj('Duplicated Code', 50, 1, 30));


  	function generateObj(name, length, min, max) {
  		var obj = {
  	  	'key': name,
  	  	'values': []
  	  }
  	  var dateStart = 1326005200000;
  	  for (var i = 0; i < length; i++) {
  	  	dateStart += 1678400000;
  	  	obj.values.push(
  	  		[dateStart, getRandomIntFromInterval(min, max)]
  	  	);
  	  }
  	  return obj;
  	}

  	function getRandomIntFromInterval(min, max) {
  	  return Math.floor(Math.random()*(max-min+1)+min);
  	}
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