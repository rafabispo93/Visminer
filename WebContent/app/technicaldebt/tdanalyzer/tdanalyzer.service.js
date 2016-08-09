homeApp.service('tdAnalyzerService', function($http){

	var typeData = [];
	var duplicatedCodeData = [];

	this.loadData = function(tags, callback){
		var tagsIds = [];
		var tagsNames = [];
		for (i in tags) {
			tagsIds.push("'"+tags[i].id+"'");
			tagsNames.push(tags[i].name);
		}
		$http.get('TypeServlet', {params:{"action": "getDebtsByListOfTags", "ids": '['+tagsIds.join(',')+']'}})
		.success(function(data) {
			console.log('found', data.length, 'types');
			typeData = data;
			$http.get('TagAnalysisServlet', {params:{"action": "getAllByTagsName", "tagsName": '['+tagsNames.join(',')+']'}})
			.success(function(data) {
				duplicatedCodeData = data;
				callback();
			})
		});
	}

	this.getTypeData = function() {
		return typeData;
	}

	this.getDuplicatedCodeData = function() {
		return duplicatedCodeData;
	}
});