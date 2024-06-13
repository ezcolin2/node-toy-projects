const mongoose = require('mongoose')
const {Schema} = mongoose
const roomSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    master: {
        type: String,
        required: true
    }
})
module.exports = mongoose.model('Room', roomSchema)