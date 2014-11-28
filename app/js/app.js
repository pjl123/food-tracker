'use strict';

/* App Module */

var foodTrackerApp = angular.module('foodTrackerApp', [
  'ngRoute',
  'phonecatAnimations',

  'phonecatControllers',
  'phonecatFilters',
  'phonecatServices'
]);

foodTrackerApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/phones', {
        templateUrl: 'partials/phone-list.html',
        controller: 'PhoneListCtrl'
      }).
      when('/phones/:phoneId', {
        templateUrl: 'partials/phone-detail.html',
        controller: 'PhoneDetailCtrl'
      }).
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
