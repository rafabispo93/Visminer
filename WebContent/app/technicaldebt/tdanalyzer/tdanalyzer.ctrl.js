homeApp = angular.module('homeApp');

homeApp.controller('TDAnalyzerCtrl', function($scope, $http, $location, $route,
 TDItem, Commit, Committer, DuplicatedCode, LongMethod, // Models
 sidebarService, alertModalService, tdItemModalService, typeSmellsDetailsService){
	var thisCtrl = this;
	
	$scope.currentPage = sidebarService.getCurrentPage();
	$scope.filtered.repository = sidebarService.getRepository();
	// $scope.filtered.tags = sidebarService.getTags();
	$scope.filtered.commits = sidebarService.getCommits();
	$scope.filtered.committers = sidebarService.getCommitters();
	$scope.filtered.debts = sidebarService.getDebts();
	sidebarService.setTdItems([]);
	$scope.tagTypesSelect = sidebarService.getTagTypesSelect();
  $scope.tagTypeSelect = sidebarService.getTagTypeSelect();
  $scope.tdItems = sidebarService.getTdItems();
	$scope.tdItemFiltered = $scope.tdItems;
	$scope.types = [];
	$scope.typesAnalized = 0;
	$scope.currentDesignDebt = null;
	$scope.currentCodeDebt = null;

	$scope.filter = {
		type: ['Code Debt', 'Design Debt'],
		tdIndicator: ['Duplicated Code', 'Long Method'],
		isTdItem: ['true', 'false']
	}

	// Apply filter parameters
	$scope.filterApply = function() {
		var tdItemFiltered = [];
		if (typeof $scope.filter.identificationDate != 'undefined' && $scope.filter.identificationDate != "") {
			var dates = $scope.filter.identificationDate.split(' - ');
			var identificationDateIni = new Date(dates[0]);
			var identificationDateEnd = new Date(dates[1]);
		}
		for (i in $scope.tdItems) {
			var obj = $scope.tdItems[i];
			var accept = 0;
			var foundDate = false;
			var foundType = false;
			var foundTdIndicator = false;
			var foundIsTdItem = false;
			if (typeof $scope.filter.identificationDate != 'undefined' && identificationDateIni) {
				if (identificationDateIni <= obj.commit.date && obj.commit.date <= identificationDateEnd) {
					foundDate = true;
				}
			} else {
				foundDate = true;
			}
			if ($scope.filter.type.indexOf(obj.type) > -1) {
				foundType = true;
			}
			if ($scope.filter.tdIndicator.indexOf(obj.tdIndicator.name) > -1) {
				foundTdIndicator = true;
			}
			if ($scope.filter.isTdItem.indexOf(String(obj.isTdItem)) > -1) {
				foundIsTdItem = true;
			}
			if (foundDate && foundType && foundTdIndicator && foundIsTdItem) {
				tdItemFiltered.push(obj);
			}
		}
		$scope.tdItemFiltered = tdItemFiltered;
	}
	
	$scope.tdItemFormatDate = function(date) {
	  return moment(date).format('l')+" "+moment(date).format('LT');
	}

	// Return the file name
	$scope.tdItemFormatFile = function(location) {
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

	thisCtrl.loadTypes = function() {
		var tagsIds = [];
		for (i in $scope.filtered.tags) {
			tagsIds.push("'"+$scope.filtered.tags[i].id+"'");
		}
		$http.get('TypeServlet', {params:{"action": "getDebtsByListOfTags", "ids": '['+tagsIds.join(',')+']'}})
		.success(function(typeData) {
			console.log('found', typeData.length, 'types');
			$scope.getDuplicatedCodeDebts(function(duplicatedCodeData) {
				for (i in typeData) {
					var diffs = [];
					var info = $scope.getCommitAndCommitter(typeData[i].commit);
					var commit = info.commit;
					var committer = info.committer;
					var debts = thisCtrl.getDebts(typeData[i]);
					for (x in debts) {
						$scope.tdItems.push(
								new TDItem(
								typeData[i].repository, 
								new Commit(typeData[i].commit, new Date(typeData[i].commit_date.$date)), 
								(typeof committer != 'undefined') ? new Committer(committer.name, committer.email, committer.avatar) : new Committer(),
								'Code Debt',
								new LongMethod(debts[x].method, typeData[i].file, typeData[i].package),
								// [],
								// [],
								// 'file',
								// 'file',
								// 'null',
								false,
								null,
								null,
								null,
								null
							)
						);
					}
					$scope.typesAnalized++;
				}
				for (i in duplicatedCodeData) {
					if (duplicatedCodeData[i].code_smells.length > 0 && duplicatedCodeData[i].code_smells[0].occurrences.length > 0) {
						var info = $scope.getCommitAndCommitter(duplicatedCodeData[i].commit);
						var commit = info.commit;
						var committer = info.committer;
						var files = [];
						for (z in duplicatedCodeData[i].code_smells[0].occurrences) {
							files.push({
					  		one: {
					  			name: duplicatedCodeData[i].code_smells[0].occurrences[z].files[0].file_name,
					  			line: duplicatedCodeData[i].code_smells[0].occurrences[z].files[0].begin_line+' ~ '+duplicatedCodeData[i].code_smells[0].occurrences[z].files[0].end_line,
					  		},
					  		two: {
					  			name: duplicatedCodeData[i].code_smells[0].occurrences[z].files[1].file_name,
					  			line: duplicatedCodeData[i].code_smells[0].occurrences[z].files[1].begin_line+' ~ '+duplicatedCodeData[i].code_smells[0].occurrences[z].files[1].end_line,
					  		},
					  		code: duplicatedCodeData[i].code_smells[0].occurrences[z].source_code_slice
							})
						}
						$scope.tdItems.push(
							new TDItem(
								duplicatedCodeData[i].repository, 
								new Commit(commit._id, new Date(commit.commit_date.$date), {linesAdded: commit.diffs[0].lines_added, linesRemoved: commit.diffs[0].lines_removed, type: ''}), 
								(typeof committer != 'undefined') ? new Committer(committer.name, committer.email, committer.avatar) : new Committer(),
								'Code Debt',
								new DuplicatedCode(files),
								// [],
								// [],
								// 'file',
								// 'file',
								// 'null',
								false,
								null,
								null,
								null,
								null
							)
						);
					}
				}
				sidebarService.setTdItems($scope.tdItems);
			})
		});
	}

	$scope.addTdItem = function(repository, commit, identificationDate, type, tdIndicator, metrics, incurredBy, diffs, 
		location, locationType, method, file, package, details, isTdItem, principal, interestAmount, interestProbability, notes) {
		$scope.tdItems.push({
			"repository": repository,
			"commit": commit,
			"identificationDate": identificationDate,
			"type": type,
			"tdIndicator": tdIndicator,
			"metrics": metrics,
			"incurredBy": {
				"name": incurredBy.name,
				"email": incurredBy.email,
				"avatar": incurredBy.avatar
			},
			"diffs": diffs,
			"location": location,
			"locationType": locationType,
			"method": method,
			"file": file,
			"package": package,
			"details": details,
			"isTdItem": isTdItem,
			"principal": principal,
			"interestAmount": interestAmount,
			"interestProbability": interestProbability,
			"notes": notes
		});
	}

	$scope.getDuplicatedCodeDebts = function(callback) {
		var tagsNames = [];
		for (i in $scope.filtered.tags) {
			tagsNames.push($scope.filtered.tags[i].name);
		}
		$http.get('TagAnalysisServlet', {params:{"action": "getAllByTagsName", "tagsName": '['+tagsNames.join(',')+']'}})
		.success(function(data) {
			callback(data);
		})
	}
	
	thisCtrl.getDebts = function(list) {
		var debts = [];
		if (typeof list.abstract_types != 'undefined' && list.abstract_types.length > 0) {
			// looking for long methods
			if (list.abstract_types[0].codesmells) {
				for (i in list.abstract_types[0].codesmells) {
					var codesmells = list.abstract_types[0].codesmells[i];
					if (codesmells.name == 'LONG_METHOD') { 
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
		}
		return debts;
	}

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

	$scope.getDiffs = function(commitRef) {
		var added = 0,
				removed = 0;
		for (i in $scope.filtered.commits) {
			if ($scope.filtered.commits[i]._id == commitRef.commit) {
				var commit = $scope.filtered.commits[i];
				for (y in commit.diffs) {
					var diffs = commit.diffs[y];
					if (diffs.path == commitRef.file) {
						added += commit.diffs[y].lines_added;
						removed += commit.diffs[y].lines_removed;
						break;
					}
				}
				break;
			}
		}
		return {
			"added": added,
			"removed": removed
		}
	}

	$scope.getCommitAndCommitter = function(commitId) {
		var commit = null;
		var committer = null;
		for (x in $scope.filtered.commits) {
			if ($scope.filtered.commits[x]._id == commitId) {
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
		return {commit: commit, committer: committer}
	}

	$scope.showSuccessModal = function() {
		alertModalService.setMessage("All the Debts Were Confirmed Sucessfully!");
		$('#alertModal').modal('show');
	}

	$scope.updateViewByTag = function() {
		$scope.types = [];
		thisCtrl.loadTypes();
	}

	$scope.showTypeSmellsDetails = function(type) {
		typeSmellsDetailsService.setType(type);
		$('#typeSmellsDetails').modal('show');
	}

	if ($scope.currentPage == 'tdanalyzer') {
		thisCtrl.loadTypes();
		$('.sidebar-toggle').click();
		$('#filter-identificationdate').daterangepicker();
		// $("#tditem-datatable").DataTable({
		// 	"ordering": false
		// });
	}
});