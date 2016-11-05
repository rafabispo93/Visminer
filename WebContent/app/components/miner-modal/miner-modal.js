angular.module('homeApp').component('minerModal', {
  controller: function ($scope, $http) {
			$("#minerModal").on('show.bs.modal', function(e) {
			  centerModals($(this));
			});
			$(window).on('resize', centerModals);

			$scope.name = '';
			$scope.description = '';
			$scope.localPath = '';
			$scope.scm = '';
			$scope.referenceType = '';
			$scope.references = {
				branches: [],
				tags: []
			};
			$scope.branches = [];
			$scope.tags = [];

			$scope.getReferences = function() {
				$http.get('http://private-1608d-visminer.apiary-proxy.com/mine/references', 
					{
						params: {
							"name": $scope.name,
							"description": $scope.description,
							"localPath": $scope.localPath,
							"scm": $scope.scm,
						}
					}
				)
				.success(function(references) {
					$scope.references = references;
				})
				// $("#minerModal").modal("hide");
				// $("#progressBarModal").modal("show");
			}
  },
  templateUrl: 'app/components/miner-modal/miner-modal.html',
});