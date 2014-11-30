'use strict';

/* Controllers */

var foodTrackerControllers = angular.module('foodTrackerControllers', ['ngStorage']);

foodTrackerControllers.controller('NavCtrl', ['$scope', '$location', function($scope, $location){
  $scope.getPage = function(){
    if($location.path()==="/"){
      return 0;
    }
    else if($location.path()==="/foods"){
      return 1;
    }
    else if($location.path()==="/recipes"){
      return 2;
    }
    else if($location.path()==="/groceryList"){
      return 3;
    };
  };
}]);

foodTrackerControllers.controller('MainCtrl', function ($scope){
  
});

foodTrackerControllers.controller('FoodsCtrl', ['$scope','$localStorage','$route', function ($scope,$localStorage,$route){
  $scope.$storage = $localStorage.$default({
    recipes:[],
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
  $scope.category = 'name';
  $scope.reverse = false;

  $scope.addFood = function(){
    var newFood = $scope.food;
    $scope.foods.push(newFood);
    $scope.food = {};
  };

  $scope.removeFood = function(food){
    var i = $scope.foods.indexOf(food);
    $scope.foods.splice(i,1);
  };

  $scope.resetData = function(){
    $localStorage.$reset({
      recipes:$scope.$storage.recipes,
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
    $route.reload();
  };

}]);

foodTrackerControllers.controller('RecipeCtrl', ['$scope','$localStorage','$http','$log', function($scope,$localStorage,$http,$log){
  $scope.$storage = $localStorage.$default({
    recipes:[],
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
  $scope.recipes = $scope.$storage.recipes;
  $scope.newRecipes = [];
  $scope.recipe = {};

  $scope.query = "";
  $scope.category = 'name';
  $scope.reverse = false;

  var getRandomIngredients = function() {
    // copy food array
    var foods = $scope.$storage.foods.slice(0);
    // get random of ingredients between 1 and number of foods in pantry
    var num_ingredients = Math.ceil(Math.random()*foods.length);
    var ingredients = '';
    for (var i = 0; i < num_ingredients && num_ingredients <= foods.length; i++) {
      // get random food and remove it from temp food array
      var food = foods[Math.ceil(Math.random()*foods.length)-1];
      var j = foods.indexOf(food);
      foods.splice(j,1);
      ingredients = ingredients + food.name;
      if(!((i==num_ingredients-1) || (num_ingredients > foods.length))){
        ingredients = ingredients + ',';
      }
    }
    return ingredients;
  };

  $scope.findRandomRecipe = function(){
    var base_search_url = "http://api.bigoven.com/recipes";
    var base_get_url = "http://food2fork.com/api/get";
    var apiKey = "dvxOdYo0h9AN8CCJ5mLa8SufcGu6wer4";
    var ingredients = getRandomIngredients();

    var params = {
      api_key: apiKey,
      responseType: 'json'
      //q: ingredients
    };
    var config = {
      params: params
    };

    $http.get(base_search_url,config)
    .success(function(data,status){
      $log.log(status + '\n' + data);
      var recipe = {};
      recipe.name = data.count;
      $scope.recipes.push(recipe);
    })
    .error(function(data,status,statusText,headers){
      $log.error('Error sending request: ' + status + '\n' + data);
    });
  };

  $scope.addFood = function(){
    var newRecipe = $scope.recipe;
    $scope.recipes.push(newRecipe);
    $scope.recipe = {};
  };

  $scope.removeFood = function(recipe){
    var i = $scope.recipes.indexOf(recipe);
    $scope.recipes.splice(i,1);
  };

}]);

foodTrackerControllers.controller('GroceryListCtrl', ['$scope', function($scope){
}]);