var mainApp = angular.module("mainApp", ['ngRoute']);

mainApp.config(['$routeProvider',
   function($routeProvider) {
      $routeProvider.
      when('/moment', {
         templateUrl: 'moment.html',
         controller: 'AController'
      }).
      when('/ingred', {
         templateUrl: 'ingred.html',
         controller: 'BController'
      }).
      when('/regis', {
         templateUrl: 'regis.html',
         controller: 'RegisCtrl'
      }).
      when('/recip', {
         templateUrl: 'recip.html',
         controller: 'ProfileCtrl'
      }).
      when('/profile', {
         templateUrl: 'profile.html',
         controller: 'RouteCtrl'
      }).
      otherwise({
         redirectTo: '/moment'
      });
   }]);

mainApp.controller('AController', function($scope) {
   $scope.message = "This page A Java";
});

mainApp.controller('BController', function($scope) {
   $scope.message = "This page B Rmutt";
});

mainApp.controller('RouteCtrl', function($scope) {
  /** create $scope.template **/
  $scope.template = {
    "info": "info.html",
    "account": "account.html"
  }
});