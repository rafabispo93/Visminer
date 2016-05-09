angular.module('homeApp').component('tdIndicators', {
  controller: TdIndicatorsController,
  templateUrl: 'app/components/td-indicators-charts/td-indicators-charts.html',
});


function TdIndicatorsController($scope) {
  var thisCtrl = this;
  $scope.timelineList = [];
     
  $scope.$on('showIndicatorsChart', function(event, type, timelineList){
    $scope.type = type;
    $scope.timelineList = timelineList;
    thisCtrl.loadTagNames();
    thisCtrl.loadGodClassSeries();
    thisCtrl.loadGodClassChart();   
  }); 

  thisCtrl.loadTagNames = function() {
    $scope.tagsNames = [];
    for (var i = 0; i < $scope.timelineList.length; i++) {
      $scope.tagsNames.push($scope.timelineList[i].tagName);
    }
  }

  thisCtrl.loadGodClassSeries = function() {
    $scope.atfdSeries = [];
    $scope.wmcSeries = [];
    $scope.tccSeries = [];
    for (var j = 0; j < $scope.timelineList.length; j++) {
      var metrics = $scope.timelineList[j].type.abstract_types[0].metrics;
      for (var i = 0; i < metrics.length; i++) {
        switch(metrics[i].name) {
          case "ATFD":
            $scope.atfdSeries.push(metrics[i].accumulated);
            break;
          case "TCC":
            $scope.tccSeries.push(metrics[i].accumulated);
            break;
          case "WMC":
            $scope.wmcSeries.push(metrics[i].accumulated);
            break;            
        }
      }
    }
  }

  thisCtrl.loadGodClassChart = function() {
    var seriesArray = [];
    seriesArray.push({name: 'ATFD', data: $scope.atfdSeries });
    seriesArray.push({name: 'WMC', data: $scope.wmcSeries });
    seriesArray.push({name: 'TCC', data: $scope.tccSeries });

    $scope.chartConfig = {
      title: {
         text: 'God Class metrics'
      },
      xAxis: {
        categories: $scope.tagsNames
      },
      yAxis: {
        min: 0,
        title: {
            text: 'Metrics Values'
        },
        stackLabels: {
            enabled: true,
            style: {
                fontWeight: 'bold',
                color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
            }
        }
      },
      options: {
        chart: {
          type: 'line',
          zoomType: 'x' 
        }  
      },       
      series: seriesArray
    }
  }

}