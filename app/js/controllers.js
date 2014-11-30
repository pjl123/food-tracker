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

foodTrackerControllers.controller('FoodsCtrl', ['$scope','$localStorage','$route','$log', function ($scope,$localStorage,$route,$log){
  $scope.$storage = $localStorage.$default({
    recipes:[],
    foods:[
      {name:"steak",type:"protein",quantity:{numeric:1,units:"pound"},showEdit:false},
      {name:"apple",type:"fruit",quantity:{numeric:4,units:"item"},showEdit:false},
      {name:"spinach",type:"vegetable",quantity:{numeric:0.5,units:"pound"},showEdit:false},
      {name:"potato chips",type:"snack",quantity:{numeric:1,units:"item"},showEdit:false},
      {name:"celery",type:"vegetable",quantity:{numeric:0.5,units:"pound"},showEdit:false},
      {name:"rice",type:"grain",quantity:{numeric:1,units:"pound"},showEdit:false},
      {name:"black beans",type:"legume",quantity:{numeric:8,units:"ounce"},showEdit:false},
      {name:"yogurt",type:"dairy",quantity:{numeric:6,units:"ounce"},showEdit:false},
      {name:"orange",type:"fruit",quantity:{numeric:3,units:"item"},showEdit:false},
      {name:"bread",type:"grain",quantity:{numeric:1,units:"item"},showEdit:false}
    ]
  });
  $scope.foods = $scope.$storage.foods;
  $scope.food = {};

  $scope.query = "";
  $scope.category = 'name';
  $scope.reverse = false;

  $scope.addFood = function(){
    var newFood = $scope.food;
    newFood.showEdit=false;
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
        {name:"steak",type:"protein",quantity:{numeric:1,units:"pound"},showEdit:false},
        {name:"apple",type:"fruit",quantity:{numeric:4,units:"item"},showEdit:false},
        {name:"spinach",type:"vegetable",quantity:{numeric:0.5,units:"pound"},showEdit:false},
        {name:"potato chips",type:"snack",quantity:{numeric:1,units:"item"},showEdit:false},
        {name:"celery",type:"vegetable",quantity:{numeric:0.5,units:"pound"},showEdit:false},
        {name:"rice",type:"grain",quantity:{numeric:1,units:"pound"},showEdit:false},
        {name:"black beans",type:"legume",quantity:{numeric:8,units:"ounce"},showEdit:false},
        {name:"yogurt",type:"dairy",quantity:{numeric:6,units:"ounce"},showEdit:false},
        {name:"orange",type:"fruit",quantity:{numeric:3,units:"item"},showEdit:false},
        {name:"bread",type:"grain",quantity:{numeric:1,units:"item"},showEdit:false}
      ]
    });
    $route.reload();
  };

}]);

foodTrackerControllers.controller('RecipeCtrl', ['$scope','$localStorage','$http','$log', function($scope,$localStorage,$http,$log){
  $scope.$storage = $localStorage.$default({
    recipes:[],
    foods:[
      {name:"steak",type:"protein",quantity:{numeric:1,units:"pound"},showEdit:false},
      {name:"apple",type:"fruit",quantity:{numeric:4,units:"item"},showEdit:false},
      {name:"spinach",type:"vegetable",quantity:{numeric:0.5,units:"pound"},showEdit:false},
      {name:"potato chips",type:"snack",quantity:{numeric:1,units:"item"},showEdit:false},
      {name:"celery",type:"vegetable",quantity:{numeric:0.5,units:"pound"},showEdit:false},
      {name:"rice",type:"grain",quantity:{numeric:1,units:"pound"},showEdit:false},
      {name:"black beans",type:"legume",quantity:{numeric:8,units:"ounce"},showEdit:false},
      {name:"yogurt",type:"dairy",quantity:{numeric:6,units:"ounce"},showEdit:false},
      {name:"orange",type:"fruit",quantity:{numeric:3,units:"item"},showEdit:false},
      {name:"bread",type:"grain",quantity:{numeric:1,units:"item"},showEdit:false}
    ]
  });
  $scope.recipes = $scope.$storage.recipes;
  $scope.newRecipes = [];
  $scope.recipe = {};
  $scope.waitForSearch = false;

  $scope.query = "";
  $scope.category = 'name';
  $scope.reverse = false;

  var getRandomIngredients = function() {
    // copy food array
    var foods = $scope.$storage.foods.slice(0);
    // get 3 ingredients from the foods in pantry
    var num_ingredients = 3;
    var ingredients = '';
    for (var i = 0; i < num_ingredients && num_ingredients <= foods.length; i++) {
      // get random food that isn't a snack or beverage and remove it from temp food array
      var food = foods[Math.ceil(Math.random()*foods.length)-1];
      var j = foods.indexOf(food);
      foods.splice(j,1);
      if(food.type==="snack" || food.type==="beverage"){
        i--;
      }
      else{
        ingredients = ingredients + food.name;
      }
      if(!((i==num_ingredients-1) || (num_ingredients > foods.length))){
        ingredients = ingredients + ',';
      }
    }
    return ingredients;
  };

  var parseRecipeSearch = function(data){
    var newRecipe = {};
    var recipeData = data.Results[0];
    newRecipe.name = recipeData.Title;
    newRecipe.link = recipeData.WebURL;
    // TODO Read in the ingredients
    return newRecipe;
  };

  $scope.findRandomRecipe = function(){
    $scope.waitForSearch = true;
    var base_search_url = "http://api.bigoven.com/recipes";
    var base_get_url = "http://api.bigoven.com/recipe/";
    var apiKey = "dvxOdYo0h9AN8CCJ5mLa8SufcGu6wer4";
    var ingredients = getRandomIngredients();

    var params = {
      api_key: apiKey,
      responseType: 'json',
      rpp: 1,
      pg: Math.ceil(Math.random()*200),
      any_kw: ingredients
    };
    var config = {
      params: params
    };

    $http.get(base_search_url,config)
    .success(function(data,status){
      var newRecipe = parseRecipeSearch(data);
      $scope.newRecipes.push(newRecipe);
      $scope.waitForSearch = false;
    })
    .error(function(data,status,statusText,headers){
      $log.error('Error sending request: ' + status + '\n' + data);
      $scope.waitForSearch = false;
    });
  };

  $scope.saveRecipe = function(recipe){
    $scope.recipes.push(recipe);
    var i = $scope.newRecipes.indexOf(recipe);
    $scope.newRecipes.splice(i,1);
  };

  $scope.addRecipe = function(){
    var newRecipe = $scope.recipe;
    $scope.recipes.push(newRecipe);
    $scope.recipe = {};
  };

  $scope.removeRecipe = function(recipe){
    var i = $scope.recipes.indexOf(recipe);
    $scope.recipes.splice(i,1);
  };

}]);

foodTrackerControllers.controller('GroceryListCtrl', ['$scope', function($scope){
}]);