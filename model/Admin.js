const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    email: {type: String, required: true},
    pwd: {type: String, required: true}
})

module.exports = mongoose.model('Admin', userSchema);