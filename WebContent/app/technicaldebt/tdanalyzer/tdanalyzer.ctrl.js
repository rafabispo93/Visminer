homeApp = angular.module('homeApp');

homeApp.controller('TDAnalyzerCtrl', function($scope, $http, $location, $route,
 TDItem, Commit, Committer, DuplicatedCode, // Models
 sidebarService, alertModalService, tdItemModalService, typeSmellsDetailsService){
	var thisCtrl = this;
	
	$scope.currentPage = sidebarService.getCurrentPage();
	$scope.filtered.repository = sidebarService.getRepository();
	$scope.filtered.tags = sidebarService.getTags();
	$scope.filtered.commits = sidebarService.getCommits();
	$scope.filtered.committers = sidebarService.getCommitters();
	$scope.filtered.debts = sidebarService.getDebts();
	$scope.selectedTag = $scope.filtered.tags[0];
	sidebarService.setTdItems([]);
	$scope.tdItems = sidebarService.getTdItems();
	$scope.tdItemFiltered = $scope.tdItems;
	$scope.types = [];
	$scope.typesAnalized = 0;
	$scope.currentDesignDebt = null;
	$scope.currentCodeDebt = null;

	$scope.filter = {
		type: ['Code Debt', 'Design Debt'],
		tdItem: ['Duplicated Code', 'Long Method'],
		isTdItem: ['true', 'false']
	}

	// Apply filter parameters
	$scope.filterApply = function() {
		var tdItemFiltered = [];
		if ($scope.filter.identificationDate != "") {
			var dates = $scope.filter.identificationDate.split(' - ');
			var identificationDateIni = new Date(dates[0]);
			var identificationDateEnd = new Date(dates[1]);
		}
		for (i in $scope.tdItems) {
			var obj = $scope.tdItems[i];
			var accept = 0;
			var foundDate = false;
			var foundType = false;
			var foundTdItem = false;
			var foundIsTdItem = false;
			if (identificationDateIni) {
				if (identificationDateIni <= obj.identificationDate && obj.identificationDate <= identificationDateEnd) {
					foundDate = true;
				}
			} else {
				foundDate = true;
			}
			if ($scope.filter.type.indexOf(obj.type) > -1) {
				foundType = true;
			}
			if ($scope.filter.tdItem.indexOf(obj.tdItem) > -1) {
				foundTdItem = true;
			}
			if ($scope.filter.isTdItem.indexOf(String(obj.isTdItem)) > -1) {
				foundIsTdItem = true;
			}
			if (foundDate && foundType && foundTdItem && foundIsTdItem) {
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

	thisCtrl.loadTypes = function(tagId) {
		console.log('loadTypes', tagId)
		$http.get('TypeServlet', {params:{"action": "getListOfTypesByListOfTags", "ids": '['+tagId+']'}})
		.success(function(typeData) {
			typeData = typeData[0];
			console.log('found', typeData.length, 'types');
			$scope.getDuplicatedCodeDebts($scope.selectedTag.name, function(duplicatedCodeData) {
				// duplicatedCodeData = duplicatedCodeData[0];
				for (var i = 0; i < typeData.length; i++) {
					$scope.types.push(typeData[i]);
					var commit = null;
					var committer = null;
					var diffs = [];
					for (x in $scope.filtered.commits) {
						if ($scope.filtered.commits[x]._id == typeData[i].commit) {
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
					console.log('committer', committer)
					var debts = thisCtrl.getDebts(typeData[i]);
					for (x in debts) {
						// $scope.tdItems.push({
						// 	"repository": typeData[i].repository,
						// 	"commit": commit._id,
						// 	"identificationDate": new Date(typeData[i].commit_date.$date),
						// 	"type": debts[x].type,
						// 	"tdIndicator": debts[x].name,
						// 	"metrics": (debts.length > 0) ? typeData[i].abstract_types[0].metrics : [],
						// 	"incurredBy": {
						// 		"name": committer.name,
						// 		"email": committer.email,
						// 		"avatar": committer.avatar
						// 	},
						// 	"diffs": $scope.getDiffs(typeData[i]),
						// 	"location": debts[x].method,
						// 	"locationType": "method",
						// 	"method": typeData[i].method,
						// 	"file": typeData[i].file,
						// 	"package": typeData[i].package,
						// 	"isTdItem": false,
						// 	"principal": "",
						// 	"interestAmount": "",
						// 	"interestProbability": "",
						// 	"notes": ""
						// });
					}
					$scope.typesAnalized++;
				}


				for (i in duplicatedCodeData) {
					// console.log('duplicatedCodeData[i]', duplicatedCodeData[i])
					if (duplicatedCodeData[i].code_smells.length > 0 && duplicatedCodeData[i].code_smells[0].occurrences.length > 0) {
						var committer = null;
						for (x in $scope.filtered.commits) {
							if ($scope.filtered.commits[x]._id == duplicatedCodeData[i].commit) {
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
						console.log('committer', committer)
						$scope.tdItems.push(
							new TDItem(
								duplicatedCodeData[i].repository, 
								new Commit(duplicatedCodeData[i].commit, new Date(duplicatedCodeData[i].commit_date.$date)), 
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
						// $scope.tdItems.push({
						// 	"repository": duplicatedCodeData[i].repository,
						// 	"commit": duplicatedCodeData[i].commit,
						// 	"identificationDate": new Date(duplicatedCodeData[i].commit_date.$date),
						// 	"type": 'Code Debt',
						// 	"tdIndicator": 'Duplicated Code',
						// 	"metrics": [],
						// 	"incurredBy": {
						// 		"name": committer.name,
						// 		"email": committer.email,
						// 		"avatar": committer.avatar
						// 	},
						// 	"diffs": [],
						// 	"location": "file",
						// 	"locationType": "file",
						// 	"method": null,
						// 	"file": files.join(';'),
						// 	"package": null,
						// 	"details": sourceCodeSlice.join("\n\n--------------------\n\n"),
						// 	"isTdItem": false,
						// 	"principal": "",
						// 	"interestAmount": "",
						// 	"interestProbability": "",
						// 	"notes": ""
						// });
					}
				}
				console.log('$scope.tdItems', $scope.tdItems)
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

	$scope.getDuplicatedCodeDebts = function(tagName, callback) {
		$http.get('TagAnalysisServlet', {params:{"action": "getAllByTag", "tagName": tagName}})
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
					if (codesmells.name == 'Long Method') { 
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
		thisCtrl.loadTypes($scope.selectedTag._id);
		$('.sidebar-toggle').click();
		$('#filter-identificationdate').daterangepicker();
		// $("#tditem-datatable").DataTable({
		// 	"ordering": false
		// });
	}
});