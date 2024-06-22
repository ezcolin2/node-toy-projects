const mongoose = require('mongoose')
const {Schema} = require('mongoose')
const json = require('jsonwebtoken')

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('User', userSchema)

