homeApp = angular.module('homeApp');

homeApp.controller('CSPerspectiveOneCtrl', function($scope){
	
	$scope.currentPage = sidebarService.getCurrentPage();

	if ($scope.currentPage == 'perspectiveone') {
		alert('Welcome');
	}
});