var mongoose = require('mongoose')

var usrSchema = new mongoose.Schema({
    username: String,
    password: String,
    timestamp: {type: Date, default: Date.now}
})
module.exports = mongoose.model('User', usrSchema)
