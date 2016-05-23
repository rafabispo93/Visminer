angular.module('homeApp').component('tdItemModal', {
  controller: function ($scope, tdItemModalService) {
			$(".modal").on('show.bs.modal', function(e) {
			  centerModals($(this));
			});
			$(window).on('resize', centerModals);
	  	$scope.$on('tdItemModalLoadObj', function(event, obj){
	  		obj.identificationDate = moment(obj.identificationDate).format('l');
	  		$scope.tdItemModalObj = obj;
	  		console.log('tdItemModalLoadObj', obj)
	  	}); 	
  },
  templateUrl: 'app/components/td-item-modal/tdItemModal.html',
});
