const express = require('express');
const route = express.Router();
const recipeCtrl = require('../controller/recipe')
const multer = require('../middleware/multer-config');
const { checkAuth } = require('../middleware/auth');

route.post('/create', checkAuth, multer, recipeCtrl.createRecipe);
// Update a recipe (optionally with a new image)
route.put('/recipes/:id', checkAuth, multer, recipeCtrl.updateRecipe);
// Delete a recipe (and its image file if present)
route.delete('/recipes/:id', checkAuth, recipeCtrl.deleteRecipe);
route.get('/recipes', recipeCtrl.getRecipes);
route.get('/recipes/categories', recipeCtrl.getCategories);
route.get('/recipes/categories/:name', recipeCtrl.getRecipesByCategory);
route.get('/recipes/search/:name', recipeCtrl.getRecipesByName)
route.get('/recipes/:id', recipeCtrl.getRecipe)
route.get('/recipes/like/:id', recipeCtrl.updateLike);
route.get('/recipes/likes/all', recipeCtrl.getLikes)

module.exports = route;