const mongoose = require('mongoose')

const recipeSchema = mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    ingredients: {type: Array, required: true},
    category: {type: String, required: true},
    image_url: {type: String, required: true},
    video_url: {type: String, required: true}
})

module.exports = mongoose.model('Recipe', recipeSchema)