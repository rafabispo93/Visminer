homeApp.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'app/technicaldebt/evolution/evolution.html',
        controller: 'TDEvolutionCtrl'
      }).
      when('/technicaldebt/evolution', {
        templateUrl: 'app/technicaldebt/evolution/evolution.html',
        controller: 'TDEvolutionCtrl'
      }).
      when('/technicaldebt/analyzer', {
        templateUrl: 'app/technicaldebt/analyzer/analyzer.html',
        controller: 'TDAnalyzerCtrl'
      }).
      when('/technicaldebt/management', {
        templateUrl: 'app/technicaldebt/management/management.html',
        controller: 'TDManagementCtrl'
      }).
      when('/technicaldebt/committers', {
        templateUrl: 'app/technicaldebt/committers/committers.html',
        controller: 'TDCommittersCtrl'
      }).
      when('/codesmells/perspectiveone', {
        templateUrl: 'app/codesmells/perspectiveone/perspectiveone.html',
        controller: 'CSPerspectiveOneCtrl'
      }).
      when('/dev/treeMap', {
          templateUrl: 'app/dev/treemap/treeMap.html',
          controller: 'DEVTreeMapCtrl'
        }).
      otherwise({ redirectTo: '/technicaldebt/analyzer' });
    $locationProvider.html5Mode(true);
 }]);