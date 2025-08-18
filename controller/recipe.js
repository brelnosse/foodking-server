const Recipe = require('../model/Recipe');

exports.createRecipe = (req, res)=>{
    delete req.body._id;
    const recipe = new Recipe({
        ...req.body,
        image_url: req.protocol+'://'+req.get('host')+'/images/'+req.file.filename
    })

    recipe.save()
    .then(()=> {
        res.status(200).json({data: 'The recipe has been successfuly created !'})    
    })
    .catch((error)=> {
        res.status(400).json({error})    
    })
}

exports.getRecipes = (req, res)=>{
    Recipe.find()
    .then((recipes)=> res.status(200).json({recipes: recipes}))
    .catch((error)=> res.status(400).json({error}))
}