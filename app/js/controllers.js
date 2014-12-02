'use strict';

/* Controllers */

var foodTrackerControllers = angular.module('foodTrackerControllers', ['ngStorage']);

/*    Navigation Controller    */
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

/*    Main Page Controller    */
foodTrackerControllers.controller('MainCtrl', function ($scope){
  
});

/*    Food Controller    */
foodTrackerControllers.controller('FoodsCtrl', ['$scope','$localStorage','$route','$log', function ($scope,$localStorage,$route,$log){
  $scope.$storage = $localStorage.$default({
    groceryLists:[],
    recipes:[],
    foods:[]
  });
  $scope.foods = $scope.$storage.foods;
  $scope.food = {};

  $scope.query = "";
  $scope.category = 'name';
  $scope.reverse = false;

  $scope.fieldsIncorrect = function(){
    return ($scope.food.name === undefined || $scope.food.name.$dirty && $scope.food.name.$invalid)
      || ($scope.food.type === undefined ||$scope.food.type.$dirty && $scope.food.type.$invalid)
      || ($scope.food.quantity === undefined)
      || ($scope.food.quantity.numeric === undefined ||$scope.food.quantity.numeric.$dirty && $scope.food.quantity.numeric.$invalid)
      || ($scope.food.quantity.units === undefined ||$scope.food.quantity.units.$dirty && $scope.food.quantity.units.$invalid);
  };

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
      groceryLists:$scope.$storage.groceryLists,
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

/*    Recipe Controller    */
foodTrackerControllers.controller('RecipeCtrl', ['$scope','$localStorage','$http','$log', function($scope,$localStorage,$http,$log){
  $scope.$storage = $localStorage.$default({
    groceryLists:[],
    recipes:[],
    foods:[]
  });
  $scope.recipes = $scope.$storage.recipes;
  $scope.newRecipes = [];
  $scope.recipe = {};
  $scope.waitForSearch = false;
  $scope.noFoods = false;

  $scope.query = "";
  $scope.category = 'name';
  $scope.reverse = false;

  var getRandomIngredients = function() {
        // copy food array
    var foods = $scope.$storage.foods.slice(0);

    var num_ingredients = 3 < foods.length ? 3 : foods.length;
    if (num_ingredients === 0) { return undefined; };

    // get 3 ingredients from the foods in pantry
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

  var getIngredients = function(recipe){
    var base_get_url = "http://api.bigoven.com/recipe/";
    var apiKey = "dvxOdYo0h9AN8CCJ5mLa8SufcGu6wer4";
    var params = {
      api_key: apiKey
    };
    var config = {
      params: params
    };

    var ingredients = [];
    $http.get(base_get_url + recipe.recipeId,config)
    .success(function(data){
      recipe.instructions = data.Instructions;
      var ingredientData = data.Ingredients;

      for (var i = 0; i < ingredientData.length; i++) {
        if(!(ingredientData[i].IngredientInfo === undefined)){
          var ingredient = {};
          ingredient.quantity = {};
          ingredient.name = ingredientData[i].IngredientInfo.Name;
          if(ingredientData[i].Quantity === undefined){
            ingredient.quantity.numeric = ingredientData[i].MetricQuantity;
            ingredient.quantity.units = ingredientData[i].MetricUnit;
          }
          else{
            ingredient.quantity.numeric = ingredientData[i].Quantity;
            ingredient.quantity.units = ingredientData[i].Unit;
          }
          ingredients.push(ingredient);
          $log.log(ingredient);
        }
      };
    });
    recipe.ingredients = ingredients;
  };

  var parseRecipeSearch = function(data){
    var newRecipe = {};
    var recipeData = data.Results[0];
    newRecipe.recipeId = recipeData.RecipeID;
    newRecipe.name = recipeData.Title;
    newRecipe.link = recipeData.WebURL;
    getIngredients(newRecipe);
    return newRecipe;
  };

  $scope.findRandomRecipe = function(){
    $scope.waitForSearch = true;
    $scope.noFoods = false;
    var base_search_url = "http://api.bigoven.com/recipes";
    var apiKey = "dvxOdYo0h9AN8CCJ5mLa8SufcGu6wer4";
    var ingredients = getRandomIngredients();
    if (ingredients === undefined) { $scope.waitForSearch = false; $scope.noFoods = true; return; };

    var params = {
      api_key: apiKey,
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
      newRecipe.expand = false;
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

/*    Grocery List Controller    */
foodTrackerControllers.controller('GroceryListCtrl', ['$scope','$localStorage','$log', function($scope,$localStorage,$log){
  $scope.$storage = $localStorage.$default({
    groceryLists:[],
    recipes:[],
    foods:[]
  });

  $scope.groceryLists = $scope.$storage.groceryLists;
  $scope.groceryList = {};
  $scope.groceryList.foods = {};
  $scope.groceryList.recipe = {};
  $scope.query = "";
  $scope.reverse = false;

  $scope.fieldsIncorrect = function(){
    return ($scope.groceryList.name === undefined || $scope.groceryList.name.$dirty && $scope.groceryList.name.$invalid)
      || ($scope.groceryList.recipe.name === undefined ||$scope.groceryList.recipe.name.$dirty && $scope.groceryList.name.recipe.$invalid);
  };

  var getRecipe = function(name){
    for (var i = 0; i < $scope.$storage.recipes.length; i++) {
      if(name === $scope.$storage.recipes[i].name){
        return $scope.$storage.recipes[i];
      }
    };
  };

  $scope.removeFood = function(groceryList,food){
    var i = groceryList.foods.indexOf(food);
    groceryList.foods.splice(i,1);
  };

  $scope.removeList = function(groceryList){
    var i = $scope.groceryLists.indexOf(groceryList);
    $scope.groceryLists.splice(i,1);
  };


  $scope.createListFromRecipe = function(){
    var newList = $scope.groceryList;
    newList.recipe = getRecipe(newList.recipe.name);
    newList.foods = [];
    var ingredients = newList.recipe.ingredients;
    var foods = $scope.$storage.foods;

    for (var i = 0; i < ingredients.length; i++) {
      var foodNeeded = true;
      for(var j = 0; j < foods.length; j++){
        if(ingredients[i].name.toUpperCase().search(foods[j].name.toUpperCase()) > -1){
          if(foods[j].quantity.numeric >= ingredients[i].quantity.numeric){
            foodNeeded = false;
            break;
          }
          else{
            var f = {name: ingredients[i].name, quantity: {numeric: ingredients[i].quantity.numeric - foods[j].quantity.numeric, units: ingredients[i].quantity.units}};
            newList.foods.push(f);
            foodNeeded = false;
            break;
          }
        }
      }
      if(foodNeeded){
        var f = {name: ingredients[i].name, quantity: {numeric: ingredients[i].quantity.numeric, units: ingredients[i].quantity.units}};
        newList.foods.push(f);
      }
    };
    $scope.groceryLists.push(newList);
    $scope.groceryList = {};
  };

}]);