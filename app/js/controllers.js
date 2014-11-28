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
    foods:[
      {name:"steak",type:"protein",quantity:{numeric:1,units:"pound"}},
      {name:"apple",type:"fruit",quantity:{numeric:4,units:"item"}},
      {name:"spinach",type:"vegetable",quantity:{numeric:0.5,units:"pound"}},
      {name:"potato chips",type:"snack",quantity:{numeric:1,units:"item"}},
      {name:"celery",type:"vegetable",quantity:{numeric:0.5,units:"pound"}},
      {name:"rice",type:"grain",quantity:{numeric:1,units:"pound"}},
      {name:"black beans",type:"legume",quantity:{numeric:8,units:"ounce"}},
      {name:"yogurt",type:"dairy",quantity:{numeric:6,units:"ounce"}},
      {name:"orange",type:"fruit",quantity:{numeric:3,units:"item"}},
      {name:"bread",type:"grain",quantity:{numeric:1,units:"item"}}
    ]
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

  $scope.resetData = function(){
    $localStorage.$reset({
      foods:[
        {name:"steak",type:"protein",quantity:{numeric:1,units:"pound"}},
        {name:"apple",type:"fruit",quantity:{numeric:4,units:"item"}},
        {name:"spinach",type:"vegetable",quantity:{numeric:0.5,units:"pound"}},
        {name:"potato chips",type:"snack",quantity:{numeric:1,units:"item"}},
        {name:"celery",type:"vegetable",quantity:{numeric:0.5,units:"pound"}},
        {name:"rice",type:"grain",quantity:{numeric:1,units:"pound"}},
        {name:"black beans",type:"legume",quantity:{numeric:8,units:"ounce"}},
        {name:"yogurt",type:"dairy",quantity:{numeric:6,units:"ounce"}},
        {name:"orange",type:"fruit",quantity:{numeric:3,units:"item"}},
        {name:"bread",type:"grain",quantity:{numeric:1,units:"item"}}
      ]
    });
  };

}]);

phonecatControllers.controller('MainCtrl', function ($scope){
  
});
