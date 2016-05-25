angular.module('homeApp').component('tdItemModal', {
  controller: function ($scope, tdItemModalService) {
		$scope.tabTd = true;
		$scope.tabMetrics = false;
		$scope.tabGraphs = false;
		$(".modal").on('show.bs.modal', function(e) {
		  centerModals($(this));
		});
		$(window).on('resize', centerModals);
  	$scope.$on('tdItemModalLoadObj', function(event, obj){
  		obj.identificationDate = moment(obj.identificationDate).format('l');
  		$scope.tdItemModalObj = obj;
  		console.log('tdItemModalLoadObj', obj)
  	});

  	$scope.activeTab = function(tabId) {
  		$scope.tabTd = false;
			$scope.tabMetrics = false;
			$scope.tabGraphs = false;
  		switch(tabId) {
  			case 'metrics':
					$scope.tabMetrics = true;
  				break;
				case 'graphs':
					$scope.tabGraphs = true;
					$(".sparkline").each(function () {
					  var $this = $(this);
					  $this.sparkline('html', $this.data());
					});
  				break;
				default:
					$scope.tabTd = true;
  				break;
  		}
  	}
  },
  templateUrl: 'app/components/td-item-modal/tdItemModal.html',
});
