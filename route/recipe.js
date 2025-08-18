const express = require('express');
const route = express.Router();
const recipeCtrl = require('../controller/recipe')
const multer = require('../middleware/multer-config');
const { checkAuth } = require('../middleware/auth');

route.post('/create', checkAuth, multer, recipeCtrl.createRecipe)
route.get('/recipes', recipeCtrl.getRecipes)
module.exports = route;