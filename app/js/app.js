'use strict';

/* App Module */

var foodTrackerApp = angular.module('foodTrackerApp', [
  'ngRoute',
  'phonecatAnimations',
  'foodTrackerControllers',
  'phonecatFilters',
  'phonecatServices'
]);

foodTrackerApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/',{
        templateUrl: 'partials/main.html',
        controller: 'MainCtrl'
      }).
      when('/foods',{
        templateUrl: 'partials/foods-list.html',
        controller: 'FoodsCtrl'
      }).
      otherwise({
        redirectTo:'/'
      });
  }]);
