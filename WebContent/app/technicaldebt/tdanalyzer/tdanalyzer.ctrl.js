homeApp = angular.module('homeApp');

homeApp.controller('TDAnalyzerCtrl', function($scope, $http, $location, $route,
 sidebarService, alertModalService, typeSmellsDetailsService){
	var thisCtrl = this;
	
	$scope.currentPage = sidebarService.getCurrentPage();
	$scope.filtered.repository = sidebarService.getRepository();
	$scope.filtered.tags = sidebarService.getTags();
	$scope.filtered.committers = sidebarService.getCommitters();
	$scope.filtered.debts = sidebarService.getDebts();
	$scope.selectedTag = $scope.filtered.tags[0];
	$scope.types = [];
	$scope.currentDesignDebt = null;
	$scope.currentCodeDebt = null;

	// When this controller is called
	$scope.$on('$routeChangeStart', function (next, last) {
		setTimeout(function(){
			if(sidebarService.getCurrentPage() == 'tdanalyzer') {
				$('.sidebar-toggle').click();
				$('#filter-identificationdate').daterangepicker();
				$("#tditem-datatable").DataTable({
					"ordering": false
				});
			}
		}, 500);
	});

	$scope.data = [
		{
			"identificationDate": "2016-01-12",
			"type": "Code",
			"tdItem": "Duplicated Code",
			"occurredBy": "Sandro Campos",
			"location": "RepositoryAnalyzer.java",
			"isTdItem": "true",
			"principal": "4",
			"interestAmount": "1",
			"newInterestProbability": "45",
			"notes": "Some method where added to resolve this questions. This is only an example to fill this field."
		},{
			"identificationDate": "2016-02-09",
			"type": "Code",
			"tdItem": "Long Method",
			"occurredBy": "Thiago Mendes",
			"location": "RepositoryAnalyzer.java",
			"isTdItem": true,
			"principal": "5",
			"interestAmount": "2",
			"newInterestProbability": "15",
			"notes": "Some method where added to resolve this questions. This is only an example to fill this field."
		},{
			"identificationDate": "2016-03-22",
			"type": "Code",
			"tdItem": "Long Method",
			"occurredBy": "Thiago Mendes",
			"location": "RepositoryAnalyzer.java",
			"isTdItem": false,
			"principal": "",
			"interestAmount": "",
			"newInterestProbability": "",
			"notes": "Some method where added to resolve this questions. This is only an example to fill this field."
		},{
			"identificationDate": "2016-04-13",
			"type": "Code",
			"tdItem": "Duplicated Code",
			"occurredBy": "Thiago Mendes",
			"location": "RepositoryAnalyzer.java",
			"isTdItem": false,
			"principal": "",
			"interestAmount": "",
			"newInterestProbability": "",
			"notes": "Some method where added to resolve this questions. This is only an example to fill this field."
		},{
			"identificationDate": "2016-01-01",
			"type": "Code",
			"tdItem": "Duplicated Code",
			"occurredBy": "Sandro Campos",
			"location": "RepositoryAnalyzer.java",
			"isTdItem": "true",
			"principal": "4",
			"interestAmount": "1",
			"newInterestProbability": "45",
			"notes": "Some method where added to resolve this questions. This is only an example to fill this field."
		},{
			"identificationDate": "2016-01-01",
			"type": "Code",
			"tdItem": "Duplicated Code",
			"occurredBy": "Sandro Campos",
			"location": "RepositoryAnalyzer.java",
			"isTdItem": "true",
			"principal": "4",
			"interestAmount": "1",
			"newInterestProbability": "45",
			"notes": "Some method where added to resolve this questions. This is only an example to fill this field."
		},{
			"identificationDate": "2016-01-01",
			"type": "Code",
			"tdItem": "Duplicated Code",
			"occurredBy": "Sandro Campos",
			"location": "RepositoryAnalyzer.java",
			"isTdItem": "true",
			"principal": "4",
			"interestAmount": "1",
			"newInterestProbability": "45",
			"notes": "Some method where added to resolve this questions. This is only an example to fill this field."
		},{
			"identificationDate": "2016-02-09",
			"type": "Code",
			"tdItem": "Long Method",
			"occurredBy": "Thiago Mendes",
			"location": "RepositoryAnalyzer.java",
			"isTdItem": true,
			"principal": "5",
			"interestAmount": "2",
			"newInterestProbability": "15",
			"notes": "Some method where added to resolve this questions. This is only an example to fill this field."
		},{
			"identificationDate": "2016-03-22",
			"type": "Code",
			"tdItem": "Long Method",
			"occurredBy": "Thiago Mendes",
			"location": "RepositoryAnalyzer.java",
			"isTdItem": false,
			"principal": "",
			"interestAmount": "",
			"newInterestProbability": "",
			"notes": "Some method where added to resolve this questions. This is only an example to fill this field."
		},{
			"identificationDate": "2016-04-13",
			"type": "Code",
			"tdItem": "Duplicated Code",
			"occurredBy": "Thiago Mendes",
			"location": "RepositoryAnalyzer.java",
			"isTdItem": false,
			"principal": "",
			"interestAmount": "",
			"newInterestProbability": "",
			"notes": "Some method where added to resolve this questions. This is only an example to fill this field."
		},{
			"identificationDate": "2016-01-01",
			"type": "Code",
			"tdItem": "Duplicated Code",
			"occurredBy": "Sandro Campos",
			"location": "RepositoryAnalyzer.java",
			"isTdItem": "true",
			"principal": "4",
			"interestAmount": "1",
			"newInterestProbability": "45",
			"notes": "Some method where added to resolve this questions. This is only an example to fill this field."
		},{
			"identificationDate": "2016-01-01",
			"type": "Code",
			"tdItem": "Duplicated Code",
			"occurredBy": "Sandro Campos",
			"location": "RepositoryAnalyzer.java",
			"isTdItem": "true",
			"principal": "4",
			"interestAmount": "1",
			"newInterestProbability": "45",
			"notes": "Some method where added to resolve this questions. This is only an example to fill this field."
		},{
			"identificationDate": "2016-01-01",
			"type": "Code",
			"tdItem": "Duplicated Code",
			"occurredBy": "Sandro Campos",
			"location": "RepositoryAnalyzer.java",
			"isTdItem": "true",
			"principal": "4",
			"interestAmount": "1",
			"newInterestProbability": "45",
			"notes": "Some method where added to resolve this questions. This is only an example to fill this field."
		},{
			"identificationDate": "2016-02-09",
			"type": "Code",
			"tdItem": "Long Method",
			"occurredBy": "Thiago Mendes",
			"location": "RepositoryAnalyzer.java",
			"isTdItem": true,
			"principal": "5",
			"interestAmount": "2",
			"newInterestProbability": "15",
			"notes": "Some method where added to resolve this questions. This is only an example to fill this field."
		},{
			"identificationDate": "2016-03-22",
			"type": "Code",
			"tdItem": "Long Method",
			"occurredBy": "Thiago Mendes",
			"location": "RepositoryAnalyzer.java",
			"isTdItem": false,
			"principal": "",
			"interestAmount": "",
			"newInterestProbability": "",
			"notes": "Some method where added to resolve this questions. This is only an example to fill this field."
		},{
			"identificationDate": "2016-04-13",
			"type": "Code",
			"tdItem": "Duplicated Code",
			"occurredBy": "Thiago Mendes",
			"location": "RepositoryAnalyzer.java",
			"isTdItem": false,
			"principal": "",
			"interestAmount": "",
			"newInterestProbability": "",
			"notes": "Some method where added to resolve this questions. This is only an example to fill this field."
		},{
			"identificationDate": "2016-01-01",
			"type": "Code",
			"tdItem": "Duplicated Code",
			"occurredBy": "Sandro Campos",
			"location": "RepositoryAnalyzer.java",
			"isTdItem": "true",
			"principal": "4",
			"interestAmount": "1",
			"newInterestProbability": "45",
			"notes": "Some method where added to resolve this questions. This is only an example to fill this field."
		},{
			"identificationDate": "2016-01-01",
			"type": "Code",
			"tdItem": "Duplicated Code",
			"occurredBy": "Sandro Campos",
			"location": "RepositoryAnalyzer.java",
			"isTdItem": "true",
			"principal": "4",
			"interestAmount": "1",
			"newInterestProbability": "45",
			"notes": "Some method where added to resolve this questions. This is only an example to fill this field."
		},{
			"identificationDate": "2016-01-01",
			"type": "Code",
			"tdItem": "Duplicated Code",
			"occurredBy": "Sandro Campos",
			"location": "RepositoryAnalyzer.java",
			"isTdItem": "true",
			"principal": "4",
			"interestAmount": "1",
			"newInterestProbability": "45",
			"notes": "Some method where added to resolve this questions. This is only an example to fill this field."
		},{
			"identificationDate": "2016-02-09",
			"type": "Code",
			"tdItem": "Long Method",
			"occurredBy": "Thiago Mendes",
			"location": "RepositoryAnalyzer.java",
			"isTdItem": true,
			"principal": "5",
			"interestAmount": "2",
			"newInterestProbability": "15",
			"notes": "Some method where added to resolve this questions. This is only an example to fill this field."
		},{
			"identificationDate": "2016-03-22",
			"type": "Code",
			"tdItem": "Long Method",
			"occurredBy": "Thiago Mendes",
			"location": "RepositoryAnalyzer.java",
			"isTdItem": false,
			"principal": "",
			"interestAmount": "",
			"newInterestProbability": "",
			"notes": "Some method where added to resolve this questions. This is only an example to fill this field."
		},{
			"identificationDate": "2016-04-13",
			"type": "Code",
			"tdItem": "Duplicated Code",
			"occurredBy": "Thiago Mendes",
			"location": "RepositoryAnalyzer.java",
			"isTdItem": false,
			"principal": "",
			"interestAmount": "",
			"newInterestProbability": "",
			"notes": "Some method where added to resolve this questions. This is only an example to fill this field."
		},{
			"identificationDate": "2016-01-01",
			"type": "Code",
			"tdItem": "Duplicated Code",
			"occurredBy": "Sandro Campos",
			"location": "RepositoryAnalyzer.java",
			"isTdItem": "true",
			"principal": "4",
			"interestAmount": "1",
			"newInterestProbability": "45",
			"notes": "Some method where added to resolve this questions. This is only an example to fill this field."
		},{
			"identificationDate": "2016-01-01",
			"type": "Code",
			"tdItem": "Duplicated Code",
			"occurredBy": "Sandro Campos",
			"location": "RepositoryAnalyzer.java",
			"isTdItem": "true",
			"principal": "4",
			"interestAmount": "1",
			"newInterestProbability": "45",
			"notes": "Some method where added to resolve this questions. This is only an example to fill this field."
		},{
			"identificationDate": "2016-01-01",
			"type": "Code",
			"tdItem": "Duplicated Code",
			"occurredBy": "Sandro Campos",
			"location": "RepositoryAnalyzer.java",
			"isTdItem": "true",
			"principal": "4",
			"interestAmount": "1",
			"newInterestProbability": "45",
			"notes": "Some method where added to resolve this questions. This is only an example to fill this field."
		},{
			"identificationDate": "2016-02-09",
			"type": "Code",
			"tdItem": "Long Method",
			"occurredBy": "Thiago Mendes",
			"location": "RepositoryAnalyzer.java",
			"isTdItem": true,
			"principal": "5",
			"interestAmount": "2",
			"newInterestProbability": "15",
			"notes": "Some method where added to resolve this questions. This is only an example to fill this field."
		},{
			"identificationDate": "2016-03-22",
			"type": "Code",
			"tdItem": "Long Method",
			"occurredBy": "Thiago Mendes",
			"location": "RepositoryAnalyzer.java",
			"isTdItem": false,
			"principal": "",
			"interestAmount": "",
			"newInterestProbability": "",
			"notes": "Some method where added to resolve this questions. This is only an example to fill this field."
		},{
			"identificationDate": "2016-04-13",
			"type": "Code",
			"tdItem": "Duplicated Code",
			"occurredBy": "Thiago Mendes",
			"location": "RepositoryAnalyzer.java",
			"isTdItem": false,
			"principal": "",
			"interestAmount": "",
			"newInterestProbability": "",
			"notes": "Some method where added to resolve this questions. This is only an example to fill this field."
		},{
			"identificationDate": "2016-01-01",
			"type": "Code",
			"tdItem": "Duplicated Code",
			"occurredBy": "Sandro Campos",
			"location": "RepositoryAnalyzer.java",
			"isTdItem": "true",
			"principal": "4",
			"interestAmount": "1",
			"newInterestProbability": "45",
			"notes": "Some method where added to resolve this questions. This is only an example to fill this field."
		},{
			"identificationDate": "2016-01-01",
			"type": "Code",
			"tdItem": "Duplicated Code",
			"occurredBy": "Sandro Campos",
			"location": "RepositoryAnalyzer.java",
			"isTdItem": "true",
			"principal": "4",
			"interestAmount": "1",
			"newInterestProbability": "45",
			"notes": "Some method where added to resolve this questions. This is only an example to fill this field."
		},{
			"identificationDate": "2016-01-01",
			"type": "Code",
			"tdItem": "Duplicated Code",
			"occurredBy": "Sandro Campos",
			"location": "RepositoryAnalyzer.java",
			"isTdItem": "true",
			"principal": "4",
			"interestAmount": "1",
			"newInterestProbability": "45",
			"notes": "Some method where added to resolve this questions. This is only an example to fill this field."
		},{
			"identificationDate": "2016-02-09",
			"type": "Code",
			"tdItem": "Long Method",
			"occurredBy": "Thiago Mendes",
			"location": "RepositoryAnalyzer.java",
			"isTdItem": true,
			"principal": "5",
			"interestAmount": "2",
			"newInterestProbability": "15",
			"notes": "Some method where added to resolve this questions. This is only an example to fill this field."
		},{
			"identificationDate": "2016-03-22",
			"type": "Code",
			"tdItem": "Long Method",
			"occurredBy": "Thiago Mendes",
			"location": "RepositoryAnalyzer.java",
			"isTdItem": false,
			"principal": "",
			"interestAmount": "",
			"newInterestProbability": "",
			"notes": "Some method where added to resolve this questions. This is only an example to fill this field."
		},{
			"identificationDate": "2016-04-13",
			"type": "Code",
			"tdItem": "Duplicated Code",
			"occurredBy": "Thiago Mendes",
			"location": "RepositoryAnalyzer.java",
			"isTdItem": false,
			"principal": "",
			"interestAmount": "",
			"newInterestProbability": "",
			"notes": "Some method where added to resolve this questions. This is only an example to fill this field."
		},{
			"identificationDate": "2016-01-01",
			"type": "Code",
			"tdItem": "Duplicated Code",
			"occurredBy": "Sandro Campos",
			"location": "RepositoryAnalyzer.java",
			"isTdItem": "true",
			"principal": "4",
			"interestAmount": "1",
			"newInterestProbability": "45",
			"notes": "Some method where added to resolve this questions. This is only an example to fill this field."
		},{
			"identificationDate": "2016-01-01",
			"type": "Code",
			"tdItem": "Duplicated Code",
			"occurredBy": "Sandro Campos",
			"location": "RepositoryAnalyzer.java",
			"isTdItem": "true",
			"principal": "4",
			"interestAmount": "1",
			"newInterestProbability": "45",
			"notes": "Some method where added to resolve this questions. This is only an example to fill this field."
		},{
			"identificationDate": "2016-01-01",
			"type": "Code",
			"tdItem": "Duplicated Code",
			"occurredBy": "Sandro Campos",
			"location": "RepositoryAnalyzer.java",
			"isTdItem": "true",
			"principal": "4",
			"interestAmount": "1",
			"newInterestProbability": "45",
			"notes": "Some method where added to resolve this questions. This is only an example to fill this field."
		},{
			"identificationDate": "2016-02-09",
			"type": "Code",
			"tdItem": "Long Method",
			"occurredBy": "Thiago Mendes",
			"location": "RepositoryAnalyzer.java",
			"isTdItem": true,
			"principal": "5",
			"interestAmount": "2",
			"newInterestProbability": "15",
			"notes": "Some method where added to resolve this questions. This is only an example to fill this field."
		},{
			"identificationDate": "2016-03-22",
			"type": "Code",
			"tdItem": "Long Method",
			"occurredBy": "Thiago Mendes",
			"location": "RepositoryAnalyzer.java",
			"isTdItem": false,
			"principal": "",
			"interestAmount": "",
			"newInterestProbability": "",
			"notes": "Some method where added to resolve this questions. This is only an example to fill this field."
		},{
			"identificationDate": "2016-04-13",
			"type": "Code",
			"tdItem": "Duplicated Code",
			"occurredBy": "Thiago Mendes",
			"location": "RepositoryAnalyzer.java",
			"isTdItem": false,
			"principal": "",
			"interestAmount": "",
			"newInterestProbability": "",
			"notes": "Some method where added to resolve this questions. This is only an example to fill this field."
		},{
			"identificationDate": "2016-01-01",
			"type": "Code",
			"tdItem": "Duplicated Code",
			"occurredBy": "Sandro Campos",
			"location": "RepositoryAnalyzer.java",
			"isTdItem": "true",
			"principal": "4",
			"interestAmount": "1",
			"newInterestProbability": "45",
			"notes": "Some method where added to resolve this questions. This is only an example to fill this field."
		},{
			"identificationDate": "2016-01-01",
			"type": "Code",
			"tdItem": "Duplicated Code",
			"occurredBy": "Sandro Campos",
			"location": "RepositoryAnalyzer.java",
			"isTdItem": "true",
			"principal": "4",
			"interestAmount": "1",
			"newInterestProbability": "45",
			"notes": "Some method where added to resolve this questions. This is only an example to fill this field."
		},{
			"identificationDate": "2016-01-01",
			"type": "Code",
			"tdItem": "Duplicated Code",
			"occurredBy": "Sandro Campos",
			"location": "RepositoryAnalyzer.java",
			"isTdItem": "true",
			"principal": "4",
			"interestAmount": "1",
			"newInterestProbability": "45",
			"notes": "Some method where added to resolve this questions. This is only an example to fill this field."
		},{
			"identificationDate": "2016-02-09",
			"type": "Code",
			"tdItem": "Long Method",
			"occurredBy": "Thiago Mendes",
			"location": "RepositoryAnalyzer.java",
			"isTdItem": true,
			"principal": "5",
			"interestAmount": "2",
			"newInterestProbability": "15",
			"notes": "Some method where added to resolve this questions. This is only an example to fill this field."
		},{
			"identificationDate": "2016-03-22",
			"type": "Code",
			"tdItem": "Long Method",
			"occurredBy": "Thiago Mendes",
			"location": "RepositoryAnalyzer.java",
			"isTdItem": false,
			"principal": "",
			"interestAmount": "",
			"newInterestProbability": "",
			"notes": "Some method where added to resolve this questions. This is only an example to fill this field."
		},{
			"identificationDate": "2016-04-13",
			"type": "Code",
			"tdItem": "Duplicated Code",
			"occurredBy": "Thiago Mendes",
			"location": "RepositoryAnalyzer.java",
			"isTdItem": false,
			"principal": "",
			"interestAmount": "",
			"newInterestProbability": "",
			"notes": "Some method where added to resolve this questions. This is only an example to fill this field."
		},{
			"identificationDate": "2016-01-01",
			"type": "Code",
			"tdItem": "Duplicated Code",
			"occurredBy": "Sandro Campos",
			"location": "RepositoryAnalyzer.java",
			"isTdItem": "true",
			"principal": "4",
			"interestAmount": "1",
			"newInterestProbability": "45",
			"notes": "Some method where added to resolve this questions. This is only an example to fill this field."
		},{
			"identificationDate": "2016-01-01",
			"type": "Code",
			"tdItem": "Duplicated Code",
			"occurredBy": "Sandro Campos",
			"location": "RepositoryAnalyzer.java",
			"isTdItem": "true",
			"principal": "4",
			"interestAmount": "1",
			"newInterestProbability": "45",
			"notes": "Some method where added to resolve this questions. This is only an example to fill this field."
		},{
			"identificationDate": "2016-01-01",
			"type": "Design",
			"tdItem": "Duplicated Code",
			"occurredBy": "Sandro Campos",
			"location": "RepositoryAnalyzer.java",
			"isTdItem": "true",
			"principal": "4",
			"interestAmount": "1",
			"newInterestProbability": "45",
			"notes": "Some method where added to resolve this questions. This is only an example to fill this field."
		},{
			"identificationDate": "2016-02-09",
			"type": "Code",
			"tdItem": "Long Method",
			"occurredBy": "Thiago Mendes",
			"location": "RepositoryAnalyzer.java",
			"isTdItem": true,
			"principal": "5",
			"interestAmount": "2",
			"newInterestProbability": "15",
			"notes": "Some method where added to resolve this questions. This is only an example to fill this field."
		},{
			"identificationDate": "2016-03-22",
			"type": "Code",
			"tdItem": "Long Method",
			"occurredBy": "Thiago Mendes",
			"location": "RepositoryAnalyzer.java",
			"isTdItem": false,
			"principal": "",
			"interestAmount": "",
			"newInterestProbability": "",
			"notes": "Some method where added to resolve this questions. This is only an example to fill this field."
		},{
			"identificationDate": "2016-04-13",
			"type": "Code",
			"tdItem": "Duplicated Code",
			"occurredBy": "Thiago Mendes",
			"location": "RepositoryAnalyzer.java",
			"isTdItem": false,
			"principal": "",
			"interestAmount": "",
			"newInterestProbability": "",
			"notes": "Some method where added to resolve this questions. This is only an example to fill this field."
		},{
			"identificationDate": "2016-01-01",
			"type": "Design",
			"tdItem": "Duplicated Code",
			"occurredBy": "Sandro Campos",
			"location": "RepositoryAnalyzer.java",
			"isTdItem": "true",
			"principal": "4",
			"interestAmount": "1",
			"newInterestProbability": "45",
			"notes": "Some method where added to resolve this questions. This is only an example to fill this field."
		},{
			"identificationDate": "2016-01-01",
			"type": "Code",
			"tdItem": "Duplicated Code",
			"occurredBy": "Sandro Campos",
			"location": "RepositoryAnalyzer.java",
			"isTdItem": "true",
			"principal": "4",
			"interestAmount": "1",
			"newInterestProbability": "45",
			"notes": "Some method where added to resolve this questions. This is only an example to fill this field."
		},{
			"identificationDate": "2016-01-01",
			"type": "Code",
			"tdItem": "Duplicated Code",
			"occurredBy": "Sandro Campos",
			"location": "RepositoryAnalyzer.java",
			"isTdItem": "true",
			"principal": "4",
			"interestAmount": "1",
			"newInterestProbability": "45",
			"notes": "Some method where added to resolve this questions. This is only an example to fill this field."
		},{
			"identificationDate": "2016-02-09",
			"type": "Design",
			"tdItem": "Long Method",
			"occurredBy": "Thiago Mendes",
			"location": "RepositoryAnalyzer.java",
			"isTdItem": true,
			"principal": "5",
			"interestAmount": "2",
			"newInterestProbability": "15",
			"notes": "Some method where added to resolve this questions. This is only an example to fill this field."
		},{
			"identificationDate": "2016-03-22",
			"type": "Code",
			"tdItem": "Long Method",
			"occurredBy": "Thiago Mendes",
			"location": "RepositoryAnalyzer.java",
			"isTdItem": false,
			"principal": "",
			"interestAmount": "",
			"newInterestProbability": "",
			"notes": "Some method where added to resolve this questions. This is only an example to fill this field."
		},{
			"identificationDate": "2016-04-13",
			"type": "Design",
			"tdItem": "Duplicated Code",
			"occurredBy": "Thiago Mendes",
			"location": "RepositoryAnalyzer.java",
			"isTdItem": false,
			"principal": "",
			"interestAmount": "",
			"newInterestProbability": "",
			"notes": "Some method where added to resolve this questions. This is only an example to fill this field."
		},{
			"identificationDate": "2016-01-01",
			"type": "Code",
			"tdItem": "Duplicated Code",
			"occurredBy": "Sandro Campos",
			"location": "RepositoryAnalyzer.java",
			"isTdItem": "true",
			"principal": "4",
			"interestAmount": "1",
			"newInterestProbability": "45",
			"notes": "Some method where added to resolve this questions. This is only an example to fill this field."
		},{
			"identificationDate": "2016-01-01",
			"type": "Design",
			"tdItem": "Duplicated Code",
			"occurredBy": "Sandro Campos",
			"location": "RepositoryAnalyzer.java",
			"isTdItem": "true",
			"principal": "4",
			"interestAmount": "1",
			"newInterestProbability": "45",
			"notes": "Some method where added to resolve this questions. This is only an example to fill this field."
		},{
			"identificationDate": "2016-01-01",
			"type": "Code",
			"tdItem": "Duplicated Code",
			"occurredBy": "Sandro Campos",
			"location": "RepositoryAnalyzer.java",
			"isTdItem": "true",
			"principal": "4",
			"interestAmount": "1",
			"newInterestProbability": "45",
			"notes": "Some method where added to resolve this questions. This is only an example to fill this field."
		},{
			"identificationDate": "2016-02-09",
			"type": "Code",
			"tdItem": "Long Method",
			"occurredBy": "Thiago Mendes",
			"location": "RepositoryAnalyzer.java",
			"isTdItem": true,
			"principal": "5",
			"interestAmount": "2",
			"newInterestProbability": "15",
			"notes": "Some method where added to resolve this questions. This is only an example to fill this field."
		},{
			"identificationDate": "2016-03-22",
			"type": "Code",
			"tdItem": "Long Method",
			"occurredBy": "Thiago Mendes",
			"location": "RepositoryAnalyzer.java",
			"isTdItem": false,
			"principal": "",
			"interestAmount": "",
			"newInterestProbability": "",
			"notes": "Some method where added to resolve this questions. This is only an example to fill this field."
		},{
			"identificationDate": "2016-04-13",
			"type": "Code",
			"tdItem": "Duplicated Code",
			"occurredBy": "Thiago Mendes",
			"location": "RepositoryAnalyzer.java",
			"isTdItem": false,
			"principal": "",
			"interestAmount": "",
			"newInterestProbability": "",
			"notes": "Some method where added to resolve this questions. This is only an example to fill this field."
		},{
			"identificationDate": "2016-01-01",
			"type": "Code",
			"tdItem": "Duplicated Code",
			"occurredBy": "Sandro Campos",
			"location": "RepositoryAnalyzer.java",
			"isTdItem": "true",
			"principal": "4",
			"interestAmount": "1",
			"newInterestProbability": "45",
			"notes": "Some method where added to resolve this questions. This is only an example to fill this field."
		},{
			"identificationDate": "2016-01-01",
			"type": "Code",
			"tdItem": "Duplicated Code",
			"occurredBy": "Sandro Campos",
			"location": "RepositoryAnalyzer.java",
			"isTdItem": "true",
			"principal": "4",
			"interestAmount": "1",
			"newInterestProbability": "45",
			"notes": "Some method where added to resolve this questions. This is only an example to fill this field."
		},{
			"identificationDate": "2016-01-01",
			"type": "Code",
			"tdItem": "Duplicated Code",
			"occurredBy": "Sandro Campos",
			"location": "RepositoryAnalyzer.java",
			"isTdItem": "true",
			"principal": "4",
			"interestAmount": "1",
			"newInterestProbability": "45",
			"notes": "Some method where added to resolve this questions. This is only an example to fill this field."
		}
	];

	$scope.tdItemFiltered = $scope.data;

	$scope.filter = {
		type: ['Code', 'Design'],
		tdItem: ['Duplicated Code', 'Long Method'],
		isTdItem: ['true', 'false']
	}

	// Apply filter parameters
	$scope.filterApply = function() {
		var tdItemFiltered = [];
		for (i in $scope.data) {
			var obj = $scope.data[i];
			var accept = 0;
			if ($scope.filter.type.indexOf(obj.type) > -1) {
				accept++;
			}
			if ($scope.filter.tdItem.indexOf(obj.tdItem) > -1) {
				accept++;
			}
			if ($scope.filter.isTdItem.indexOf(obj.isTdItem) > -1) {
				accept++;
			}
			if (accept == 3) {
				tdItemFiltered.push(obj);
			}
		}
		$scope.tdItemFiltered = tdItemFiltered;
	}
	
	$scope.tdItemFormatDate = function(date) {
	  return moment(date, 'YYYY-MM-DD').format('l');
	}

	$scope.tdItemFormatNotes = function(notes) {
	  return (notes.length > 20) ? notes.substring(1,17)+'...' : notes;
	}

	thisCtrl.selectView = function(view) { console.log('view', view)
		$scope.currentPage = view;
		sidebarService.setCurrentPage(view);
	}

	thisCtrl.loadTypes = function(tagId) {
		$http.get('TypeServlet', {params:{"action": "getAllByTree", "treeId": tagId}})
		.success(function(data) {
			console.log('found', data.length, ' types'); 
			for (var i = 0; i < data.length; i++) {
				var hasDebt = thisCtrl.hasDebt(data[i].abstract_types[0].technicaldebts);
				if (hasDebt) {
					$scope.types.push(data[i]);				
				}				
			}
		});
	}

	thisCtrl.hasDebt = function(debtsList) {
		var hasDebt = false;
		if (debtsList.length > 0) {
			for (var j = 0; j < debtsList.length; j++) {
				if (debtsList[j].name == 'Code Debt' && $.inArray('CODE', $scope.filtered.debts) > -1 && debtsList[j].value) {
					hasDebt = true;
				}
				if (debtsList[j].name == 'Design Debt'  && $.inArray('DESIGN', $scope.filtered.debts) > -1 && debtsList[j].value) {
					hasDebt = true;
				}
			}			
		}
		return hasDebt;
	}

	// thisCtrl.loadTypes($scope.selectedTag._id);

	$scope.loadCurrentDebts = function(type) {
		var tdList = type.abstract_types[0].technicaldebts;
		for (var i = 0; i < tdList.length; i++) {
			if (tdList[i].name == 'Code Debt') {
				$scope.currentCodeDebt = tdList[i];
			}
			if (tdList[i].name == 'Design Debt') {
				$scope.currentDesignDebt = tdList[i];
			}
		}
	}

	$scope.confirmSingleDebt = function(commitId, fileId, debt) {
		$http.get('TypeServlet', {params:{"action": "confirmSingleDebt",
		 "commitId": commitId, "fileId": fileId, "debt": debt}})
		.success(function() {
			console.log('Debt Confirmed: ', debt); 			
		});
	}

	$scope.removeSingleDebt = function(commitId, fileId, debt) {
		$http.get('TypeServlet', {params:{"action": "removeSingleDebt",
		 "commitId": commitId, "fileId": fileId, "debt": debt}})
		.success(function() {
			console.log('Debt Confirmed: ', debt); 			
		});
	}

	$scope.confirmAllDebtsByTag = function(treeId) {
		$http.get('TypeServlet', {params:{"action": "confirmAllDebtsByTag", "treeId": treeId}})
		.success(function() {
			$route.reload();			
			$scope.showSuccessModal();
			console.log('All debts from tree ', treeId,' have been Confirmed.'); 			
		});
	}

	$scope.confirmAllDebtsByRepository = function(repositoryId) {
		$http.get('TypeServlet', {params:{"action": "confirmAllDebtsByRepository", "repositoryId": repositoryId}})
		.success(function() {
			$route.reload();
			$scope.showSuccessModal();
			console.log('All debts from repository ', repositoryId,' have been Confirmed.'); 			
		});
	}

	$scope.showSuccessModal = function() {
		alertModalService.setMessage("All the Debts Were Confirmed Sucessfully!");
		$('#alertModal').modal('show');
	}

	$scope.updateViewByTag = function() {
		$scope.types = [];
		thisCtrl.loadTypes($scope.selectedTag._id);
	}

	$scope.showTypeSmellsDetails = function(type) {
		typeSmellsDetailsService.setType(type);
		$('#typeSmellsDetails').modal('show');
	}
});