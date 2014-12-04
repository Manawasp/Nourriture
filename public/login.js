      var loginApp = angular.module("loginApp", ['ngRoute']);
      
      loginApp.config(['$routeProvider',
         function($routeProvider) {
            $routeProvider.
               when('/', {
                  templateUrl: 'regis.html',
                  controller: 'RegisCtrl'
               }).
               when('/login', {
                  templateUrl: 'login.html',
                  controller: 'LoginCtrl'
               }).
               otherwise({
                  redirectTo: '/'
               });
         }]);

         /*loginApp.controller('AController', function($scope) {
            $scope.message = "This page A Java";
         });

         loginApp.controller('BController', function($scope) {
            $scope.message = "This page B Rmutt";
         });*/