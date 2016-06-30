homeApp = angular.module('homeApp');

homeApp.controller('TDAnalyzerCtrl', function($scope, $http, $location, $route,
 sidebarService, alertModalService, tdItemModalService, typeSmellsDetailsService){
	var thisCtrl = this;
	
	$scope.currentPage = sidebarService.getCurrentPage();
	$scope.filtered.repository = sidebarService.getRepository();
	$scope.filtered.tags = sidebarService.getTags();
	$scope.filtered.commits = sidebarService.getCommits();
	$scope.filtered.committers = sidebarService.getCommitters();
	$scope.filtered.debts = sidebarService.getDebts();
	$scope.selectedTag = $scope.filtered.tags[0];
	$scope.types = [];
	$scope.typesAnalized = 0;
	$scope.currentDesignDebt = null;
	$scope.currentCodeDebt = null;

	$scope.test = [];

	$scope.data = [];

	$scope.tdItemFiltered = $scope.data;

	$scope.filter = {
		type: ['Code debt', 'Design debt'],
		tdItem: ['Duplicated Code', 'Long Method'],
		isTdItem: ['true', 'false']
	}

	// Apply filter parameters
	$scope.filterApply = function() {
		var tdItemFiltered = [];
		for (i in $scope.data) {
			var obj = $scope.data[i];
			console.log('obj', obj)
			var accept = 0;
			var foundType = false;
			var foundTdItem = false;
			var foundIsTdItem = false;
			for (x in obj.debts) {
				if ($scope.filter.type.indexOf(obj.debts[x].type) > -1) {
					foundType = true;
				}
				if ($scope.filter.tdItem.indexOf(obj.debts[x].name) > -1) {
					foundTdItem = true;
				}
			}
			if ($scope.filter.isTdItem.indexOf(String(obj.isTdItem)) > -1) {
				foundIsTdItem = true;
			}
			if (foundType && foundTdItem && foundIsTdItem) {
				tdItemFiltered.push(obj);
			}
		}
		$scope.tdItemFiltered = tdItemFiltered;
	}
	
	$scope.tdItemFormatDate = function(date) {
	  return moment(date).format('l');
	}

	// Return the file name
	$scope.tdItemFormatLocation = function(location) {
		var loc = location.split('/');
	  return loc[loc.length-1];
	}

	$scope.tdItemFormatNotes = function(notes) {
	  return (notes.length > 20) ? notes.substring(0,17)+'...' : notes;
	}

	$scope.tdItemEdit = function(tdItem) {
		tdItemModalService.loadObj(tdItem);
		$('#tdItemModal').modal('show');
	}

	thisCtrl.selectView = function(view) {
		$scope.currentPage = view;
		sidebarService.setCurrentPage(view);
	}

	thisCtrl.loadTypes = function(tagId) {
		console.log('loadTypes')
		$http.get('TypeServlet', {params:{"action": "getAllByTree", "treeId": tagId}})
		.success(function(data) {
			console.log('found', data.length, 'types');
			console.log('data', data);
// for (z in data) {
// 	if(data[z].abstract_types.length > 0) {
// 		var codesmells = data[z].abstract_types[0].codesmells;
// 			for (x in codesmells) {
// 				if (codesmells[x].name == 'Long Method') { 
// 					// console.log("codesmells", codesmells[x])
// 					for (j in codesmells[x].methods) {
// 						console.log('codesmells[x].methods[j].value', codesmells[x].methods[j].value)
// 						if (codesmells[x].methods[j].value == true) {
// 							console.log("codesmells.methods[j]", codesmells[x].methods[j])
// 							throw new Error("achei")
// 						}
// 					}
// 				}
// 			}
// 	}
// }
			for (var i = 0; i < data.length; i++) {
				$scope.types.push(data[i]);
				var commit = null;
				var committer = null;
				for (x in $scope.filtered.commits) {
					if ($scope.filtered.commits[x]._id == data[i].commit) {
						commit = $scope.filtered.commits[x];
						for (y in $scope.filtered.committers) {
							if (commit.committer.email == $scope.filtered.committers[y].email) {
								committer = $scope.filtered.committers[y];
								break;
							}
						}
						break;
					}
				}
				var debts = thisCtrl.getDebts(data[i]);
				if (debts.length > 0) {
					$scope.data.push({
						"repository": data[i].repository,
						"commit": commit._id,
						"identificationDate": new Date(data[i].commit_date.$date),
						"type": "Code",
						"tdItem": "Long Method",
						"debts": debts,
						"metrics": (debts.length > 0) ? data[i].abstract_types[0].metrics : [],
						"occurredBy": {
							"name": committer.name,
							"email": committer.email,
							"avatar": committer.avatar
						},
						"location": data[i].file,
						"isTdItem": false,
						"principal": "",
						"interestAmount": "",
						"newInterestProbability": "",
						"notes": ""
					});
				}
				$scope.typesAnalized++;
			}
		});
	}
	
	thisCtrl.getDebts = function(list) {
		var debts = [];

		if (typeof list.abstract_types != 'undefined' && list.abstract_types.length > 0) {
			// looking for long methods
			if (list.abstract_types[0].codesmells) {
					for (i in list.abstract_types[0].codesmells) {
					var codesmells = list.abstract_types[0].codesmells[i];
					if (codesmells.name == 'Long Method' || codesmells.name == 'Duplicated Code') { 
						for (j in codesmells.methods) {
							if (codesmells.methods[j].value == true) {
								debts.push({
									type: 'Code Debt',
									name: codesmells.name,
									method: codesmells.methods[j].method
								});
							}
						}
					}
				}
			}
			 // && list.abstract_types[0].technicaldebts != 'undefined'
			debtsList = list.abstract_types[0].technicaldebts;
			if (debtsList.length > 0) {
				for (var j = 0; j < debtsList.length; j++) {
					if (debtsList[j].name == 'Code Debt' && $.inArray('CODE', $scope.filtered.debts) > -1 && debtsList[j].value) {
						debts.push({
							type: 'Code Debt'
						});
					}
					if (debtsList[j].name == 'Design Debt'  && $.inArray('DESIGN', $scope.filtered.debts) > -1 && debtsList[j].value) {
						debts.push({
							type: 'Design Debt'
						});
					}
				}			
			}
		}
		return debts;
	}

	thisCtrl.hasLongMethod = function(list) {
		// var hasDebt = false;
		// if (debtsList.length > 0) {
		// 	for (var j = 0; j < debtsList.length; j++) {
		// 		if (debtsList[j].name == 'Code Debt' && $.inArray('CODE', $scope.filtered.debts) > -1 && debtsList[j].value) {
		// 			hasDebt = true;
		// 		}
		// 		if (debtsList[j].name == 'Design Debt'  && $.inArray('DESIGN', $scope.filtered.debts) > -1 && debtsList[j].value) {
		// 			hasDebt = true;
		// 		}
		// 		if (debtsList[j])
		// 		console.log(debtsList[j])
		// 	}			
		// }
		// return hasDebt;
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

	if ($scope.currentPage == 'tdanalyzer') {
		thisCtrl.loadTypes($scope.selectedTag._id)
		$('.sidebar-toggle').click();
		$('#filter-identificationdate').daterangepicker();
		// $("#tditem-datatable").DataTable({
		// 	"ordering": false
		// });
	}
});