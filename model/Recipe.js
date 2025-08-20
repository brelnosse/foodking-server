const mongoose = require('mongoose')

const recipeSchema = mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    ingredients: {type: Array, required: true},
    category: {type: String, required: true},
    image_url: {type: String, required: false},
    video_url: {type: String, required: true},
    likes: {type: Array, required: false}
})

module.exports = mongoose.model('Recipe', recipeSchema)