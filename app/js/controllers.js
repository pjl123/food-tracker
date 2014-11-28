'use strict';

/* Controllers */

var phonecatControllers = angular.module('phonecatControllers', ['ngStorage']);

phonecatControllers.controller('PhoneListCtrl', ['$scope', 'Phone',
  function($scope, Phone) {
    $scope.phones = Phone.query();
    $scope.orderProp = 'age';
  }]);

phonecatControllers.controller('PhoneDetailCtrl', ['$scope', '$routeParams', 'Phone',
  function($scope, $routeParams, Phone) {
    $scope.phone = Phone.get({phoneId: $routeParams.phoneId}, function(phone) {
      $scope.mainImageUrl = phone.images[0];
    });

    $scope.setImage = function(imageUrl) {
      $scope.mainImageUrl = imageUrl;
    }
  }]);

phonecatControllers.controller('FoodsCtrl', ['$scope','$localStorage', function ($scope,$localStorage){
  $scope.$storage = $localStorage.$default({
    foods:[]
  });
  $scope.foods = $scope.$storage.foods;
  $scope.food = {};
  $scope.query = "";
  $scope.category = "";

  $scope.addFood = function(){
    var newFood = $scope.food;
    $scope.foods.push(newFood)
    $scope.food = {};
  };

  $scope.removeFood = function(food){
    var i = $scope.foods.indexOf(food);
    $scope.foods.splice(i,1);
  };

}]);

phonecatControllers.controller('MainCtrl', function ($scope){
  
});
