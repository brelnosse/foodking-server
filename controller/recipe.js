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

        res.status(200).json({categories: categories})
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