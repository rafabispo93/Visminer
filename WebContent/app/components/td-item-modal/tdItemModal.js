angular.module('homeApp').component('tdItemModal', {
  controller: function ($scope, tdItemModalService) {
		$scope.tabTd = true;
		$scope.tabMetrics = false;
		var tdItem;
		$(".modal").on('show.bs.modal', function(e) {
		  centerModals($(this));
		});
		$(window).on('resize', centerModals);
  	$scope.$on('tdItemModalLoadObj', function(event, obj){
      $scope.activeTab('td');
  		tdItem = obj;
  		$scope.tdItemModalObj = JSON.parse(JSON.stringify(obj)); // clone the object
      $scope.tdItemModalObj.commit.date = moment($scope.tdItemModalObj.commit.date).format('l');
      // $scope.tdItemModalObj.file = $scope.getFileName($scope.tdItemModalObj.file);
  	});

  	$scope.activeTab = function(tabId) {
  		$scope.tabTd = false;
			$scope.tabMetrics = false;
  		switch(tabId) {
  			case 'metrics':
					$scope.tabMetrics = true;
  				break;
				default:
					$scope.tabTd = true;
  				break;
  		}
  	}

  	$scope.save = function() {
  		tdItem.type = $scope.tdItemModalObj.type;
  		tdItem.tdIndicator = $scope.tdItemModalObj.tdIndicator;
  		tdItem.notes = $scope.tdItemModalObj.notes;
  		tdItem.isTdItem = $scope.tdItemModalObj.isTdItem;
  		tdItem.principal = $scope.tdItemModalObj.principal;
  		tdItem.interestAmount = $scope.tdItemModalObj.interestAmount;
  		tdItem.interestProbability = $scope.tdItemModalObj.interestProbability;
  		$('#tdItemModal').modal('hide');
  	}

    $scope.checkIsTdItemValues = function() {
      if ($scope.tdItemModalObj.isTdItem == false) {
        $scope.tdItemModalObj.principal = null;
        $scope.tdItemModalObj.interestAmount = null;
        $scope.tdItemModalObj.interestProbability = null;
      }
    }

    $scope.getFileName = function(location) {
      var loc = location.split('/');
      return loc[loc.length-1];
    }

  },
  templateUrl: 'app/components/td-item-modal/tdItemModal.html',
}).filter('thisMethodAndHasValue', function() {
  return function(items, scope) {
    if (typeof scope.tdItemModalObj != 'undefined' && scope.tdItemModalObj.tdIndicator.method) {
      var values = [];
      for (i in items) {
        if (typeof items[i].methods != 'undefined' && items[i].methods[0].method == scope.tdItemModalObj.tdIndicator.method && items[i].methods[0].value > 0) {
          values.push(items[i]);
        }
      }
      return values;
    }
  };
});
