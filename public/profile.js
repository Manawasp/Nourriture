var App = angular.module("App", ['ngRoute']);

App.config(['$routeProvider',
   function($routeProvider) {
      $routeProvider.
      when('/profile', {
         templateUrl: 'profile.html',
         controller: 'ProfileCtrl'
      }).
      otherwise({
         redirectTo: '/A'
      });
   }]);

App.controller('AController', function($scope) {
   $scope.message = "This page A Java";
});

App.controller('BController', function($scope) {
   $scope.message = "This page B Rmutt";
});