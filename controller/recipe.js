const Recipe = require('../model/Recipe');

exports.createRecipe = (req, res) => {
    delete req.body._id;

    // Construire l'URL de l'image seulement si un fichier a été uploadé
    let imageUrl = null;
    if (req.file && req.file.filename) {
        imageUrl = req.protocol + '://' + req.get('host') + '/images/' + req.file.filename;
    } else if (req.body && req.body.image_url) {
        // Accepter une URL d'image fournie dans le corps (optionnel)
        imageUrl = req.body.image_url;
    }

    const recipe = new Recipe({
        ...req.body,
        image_url: imageUrl,
        likes: []
    });

    recipe.save()
        .then(() => {
            res.status(201).json({data: 'The recipe has been successfully created!'})
        })
        .catch((error) => {
            res.status(400).json({error})
        });
}

exports.getRecipes = (req, res)=>{
    Recipe.find()
    .then((recipes)=> res.status(200).json({recipes: recipes}))
    .catch((error)=> res.status(400).json({error}))
}
exports.getCategories = (req, res)=>{
    Recipe.find()
    .then((recipes)=>{
        let categories = recipes.map((el)=>{
            return el.category;
        }) 
        let filteredCat = []

        for(let i = 0; i < categories.length; i++){
            if(!filteredCat.includes(categories[i])){
                filteredCat.push(categories[i]);
            }
        }

        res.status(200).json({categories: filteredCat})
    })
    .catch(recipes => res.status(400).json({error}))
}

exports.getRecipesByName = (req, res)=>{
    Recipe.find()
    .then((recipes)=>{
        let values = recipes.map((el)=>{
            if(el.title.startsWith(req.params.name) || el.title.endsWith(req.params.name) || el.title.split(' ').includes(req.params.name)){
                return el;
            }
        })
        values = values.filter((el)=>{
            return el
        })
        res.status(200).json({recipes: values})
    })
    .catch(error => res.status(400).json({error}))
}

exports.getRecipe = (req, res)=>{
    Recipe.findOne({_id: req.params.id})
    .then((recipe)=> {
        res.status(200).json({recipe: recipe})
    })
    .catch(error=> res.status(400).json({error}))
}

exports.getRecipesByCategory = (req, res)=>{
    Recipe.find()
    .then((recipes)=>{
        let recipesByC = recipes.map((el)=>{
            if(el.category.startsWith(req.params.name)){
                return el
            }
        })
        recipesByC = recipesByC.filter((el)=>{
            return el;
        })
        res.status(200).json({recipes: recipesByC})
    })
    .catch((error)=> res.status(500).json({error}))
}

exports.updateLike = (req, res) => {
    const recipeId = req.params.id;
    Recipe.findOne({_id: recipeId})
    .then((recipe) => {
        if (!recipe) {
            return res.status(404).json({error: 'Recipe not found'});
        }

        const likes = recipe.likes || [];
        const userIp = req.headers['x-forwarded-for'].split(',')[0] || req.connection.remoteAddress;

        if (!likes.includes(userIp)) {
            // Add like
            likes.push(userIp);
        } else {
            // Remove like
            const index = likes.indexOf(userIp);
            likes.splice(index, 1);
        }

        Recipe.updateOne({_id: recipeId}, {likes: likes})
        .then(() => {
            res.status(200).json({data: userIp, likes: likes});
        })
        .catch(error => res.status(400).json({error}));
    })
    .catch(error => res.status(400).json({error}));
}

exports.getLikes = (req, res)=>{
    Recipe.find()
    .then((recipes)=>{
        let likes = recipes.map(el =>{
            return {
                id: el._id,
                likes: el.likes
            }
        })
        const userIp = req.headers['x-real-ip'] || req.headers['x-forwarded-for']?.split(',')[0] || req.connection?.remoteAddress?.replace(/^.*:/, '') || '127.0.0.1';
        likes.push(userIp)
        res.status(200).json({data: likes})
    })
    .catch((error)=> {
        res.status(400).json({error: 'hi'})
    })
}

// Update a recipe by id. If a new image is uploaded, replace the old file.
exports.updateRecipe = (req, res) => {
    const recipeId = req.params.id;
    // Trouver la recette existante
    Recipe.findOne({_id: recipeId})
    .then((existing) => {
        if (!existing) return res.status(404).json({ error: 'Recipe not found' });

        // Construire l'objet de mise à jour
        const updatedFields = { ...req.body };

        if (req.file && req.file.filename) {
            // Nouvelle image uploadée
            updatedFields.image_url = req.protocol + '://' + req.get('host') + '/images/' + req.file.filename;
        }

        // Mettre à jour la base
        Recipe.updateOne({ _id: recipeId }, { ...updatedFields })
        .then(() => {
            // Si une ancienne image existait et a été remplacée, la supprimer du disque
            if (req.file && req.file.filename && existing.image_url) {
                const oldFilename = existing.image_url.split('/images/')[1];
                if (oldFilename) {
                    const fs = require('fs');
                    const path = require('path');
                    const filePath = path.join(__dirname, '..', 'images', oldFilename);
                    fs.unlink(filePath, (err) => {
                        if (err) console.warn('Failed to delete old image:', err.message || err);
                    });
                }
            }
            res.status(200).json({ data: 'Recipe updated' });
        })
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(400).json({ error }));
}

// Delete a recipe by id and remove associated image file if present
exports.deleteRecipe = (req, res) => {
    const recipeId = req.params.id;
    Recipe.findOne({ _id: recipeId })
    .then((recipe) => {
        if (!recipe) return res.status(404).json({ error: 'Recipe not found' });

        // Supprimer le document
        Recipe.deleteOne({ _id: recipeId })
        .then(() => {
            // Supprimer le fichier image si présent
            if (recipe.image_url) {
                const oldFilename = recipe.image_url.split('/images/')[1];
                if (oldFilename) {
                    const fs = require('fs');
                    const path = require('path');
                    const filePath = path.join(__dirname, '..', 'images', oldFilename);
                    fs.unlink(filePath, (err) => {
                        if (err) console.warn('Failed to delete image during recipe delete:', err.message || err);
                    });
                }
            }
            res.status(200).json({ data: 'Recipe deleted' });
        })
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(400).json({ error }));
}