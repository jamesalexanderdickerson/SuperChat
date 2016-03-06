/*
 * Module dependencies
 */
var app = require('express')(),
  express = require('express'),
  path = require('path'),
  http = require('http').Server(app),
  io = require('socket.io')(http),
  stylus = require('stylus'),
  nib = require('nib'),
  mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/SuperChat', function (err) {
  if (err)
    throw err
  else {
    console.log("Connected to mongo")
  }
})
function compile (str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib())
};
app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
app.use(express.logger('dev'))
app.use(stylus.middleware(
  { src: __dirname + '/public',
    compile: compile
    }
))
app.use(express.static(__dirname + '/public'))

var msgSchema = new mongoose.Schema({
    message: String,
    timestamp: {type: Date, default: Date.now}
})
var Chat = mongoose.model('Message', msgSchema)

app.get('/chat', function (req,res) {
  Chat.find(function (err, msgs) {
    if (err)
      res.send(err)
    else {
      res.json(msgs)
    }
  }).limit(10).sort({timestamp: -1})

})

app.get('/', function (req, res) {
  res.render('index',
    { title: 'Home' })
})

io.on('connection', function (socket) {
  console.log('*** a user has connected ***')
  socket.on('disconnect', function () {
    console.log('*** a user has disconnected ***')
  })
  socket.on('chat message', function (msg) {
    console.log('message: ' + msg)
    var newMsg = new Chat({ message: msg })
    newMsg.save(function () {
        if (msg.match(/;\)/g)) {
          msg = msg.replace(';)', '<embed src="emojis/winky.svg" width=20 height=20 style="margin-bottom:-2px;">')
          io.emit('chat message', msg)
        } else if (msg.match(/:\)/g)) {
          msg = msg.replace(':)', '<embed src="emojis/smiley.svg" width=20 height=20 style="margin-bottom:-2px;">')
          io.emit('chat message', msg)
        } else if ((msg.match(/i\slove\syou/gi)) || (msg.match(/i\sluv\su/gi)) || (msg.match(/i\sluv\syou/gi)) || (msg.match(/i\slove\su/gi))) {
          msg = '<embed src="emojis/heart.svg" width=20 height=20 style="margin-bottom:-2px;"> ' + msg + ' <embed src="emojis/heart.svg" width=20 height=20 style="margin-bottom:-2px;">'
          io.emit('chat message', msg)
        } else if (msg.match(/:P/g)) {
          msg = msg.replace(':P', '<embed src="emojis/tongue.svg" width=20 height=20 style="margin-bottom:-2px;">')
          io.emit('chat message', msg)
        } else if (msg.match(/:p/g)) {
          msg = msg.replace(':p', '<embed src="emojis/tongue.svg" width=20 height=20 style="margin-bottom:-2px;">')
          io.emit('chat message', msg)
        } else if (msg.match(/:\*/g)) {
          msg = msg.replace(':*', '<embed src="emojis/kiss.svg" width=20 height=20 style="margin-bottom:-2px;">')
          io.emit('chat message', msg)
        } else {
          io.emit('chat message', msg)
        }



    })

  })
})

http.listen(3000, function () {
  console.log('Server running on port 3000...')
})
