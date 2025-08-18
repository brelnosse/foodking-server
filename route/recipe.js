const express = require('express');
const route = express.Router();
const recipeCtrl = require('../controller/recipe')
const multer = require('../middleware/multer-config');
const { checkAuth } = require('../middleware/auth');

route.post('/create', checkAuth, multer, recipeCtrl.createRecipe);
route.get('/recipes', recipeCtrl.getRecipes);
route.get('/recipes/categories', recipeCtrl.getCategories);
route.get('/recipes/categories/:name', recipeCtrl.getRecipesByCategory);
route.get('/recipes/search/:name', recipeCtrl.getRecipesByName)
route.get('/recipes/:id', recipeCtrl.getRecipe)

module.exports = route;