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
  		tdItem = obj;
  		$scope.tdItemModalObj = JSON.parse(JSON.stringify(obj)); // clone the object
  		$scope.tdItemModalObj.identificationDate = moment($scope.tdItemModalObj.identificationDate).format('l');
      $scope.tdItemModalObj.file = $scope.getFileName($scope.tdItemModalObj.file);
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
  		tdItem.tdItem = $scope.tdItemModalObj.tdItem;
  		tdItem.notes = $scope.tdItemModalObj.notes;
  		tdItem.isTdItem = $scope.tdItemModalObj.isTdItem;
  		tdItem.principal = $scope.tdItemModalObj.principal;
  		tdItem.interestAmount = $scope.tdItemModalObj.interestAmount;
  		tdItem.newInterestProbability = $scope.tdItemModalObj.newInterestProbability;
  		$('#tdItemModal').modal('hide');
  	}

    $scope.getFileName = function(location) { console.log('location', location)
      var loc = location.split('/');
      return loc[loc.length-1];
    }

  },
  templateUrl: 'app/components/td-item-modal/tdItemModal.html',
});
