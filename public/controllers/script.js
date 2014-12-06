var mainApp = angular.module("mainApp", ['ngRoute']);

mainApp.config(['$routeProvider',
   function($routeProvider) {
      $routeProvider.
      when('/moment', {
         templateUrl: 'pages/moment.html',
         controller: 'AController'
      }).
      when('/ingred', {
         templateUrl: 'pages/ingredient/ingred.html',
         controller: 'BController'
      }).
      when('/recip', {
         templateUrl: 'pages/recipe/recip.html',
         controller: 'ProfileCtrl'
      }).
      when('/profile', {
         templateUrl: 'pages/profile/profile.html',
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
    "info": "pages/profile/info.html",
    "account": "pages/profile/account.html",
    "email": "pages/profile/email.html"
  }
});