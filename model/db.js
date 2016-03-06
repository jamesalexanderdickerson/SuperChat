var mongoose = require('mongoose')
var msgSchema = new mongoose.Schema({
    message: String
})

var Chat = mongoose.model('Messages', msgSchema)
mongoose.connect('mongodb://localhost/SuperChat', function (err) {
  if (err)
    throw err
  else {
    console.log("Connected to mongo")
  }
})
