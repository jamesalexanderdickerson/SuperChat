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
        } else if ((msg.match(/!\?!$/)) || (msg.match(/\?!\?$/))) {
          msg = msg.replace(/!/g, '')
          msg = msg.replace(/\?/g, '')
          msg = msg.replace(/\s/g, '<embed src="alphabet/space.svg" width=20 height=20 style="margin-bottom:-2px;margin-right:-5px">')
          msg = msg.replace(/A/g, '<embed src="alphabet/a.svg" width=20 height=20 style="margin-bottom:-2px;margin-right:-5px">')
          msg = msg.replace(/B/g, '<embed src="alphabet/b.svg" width=20 height=20 style="margin-bottom:-2px;margin-right:-5px">')
          msg = msg.replace(/C/g, '<embed src="alphabet/c.svg" width=20 height=20 style="margin-bottom:-2px;margin-right:-5px">')
          msg = msg.replace(/D/g, '<embed src="alphabet/d.svg" width=20 height=20 style="margin-bottom:-2px;margin-right:-5px">')
          msg = msg.replace(/E/g, '<embed src="alphabet/e.svg" width=20 height=20 style="margin-bottom:-2px;margin-right:-5px">')
          msg = msg.replace(/F/g, '<embed src="alphabet/f.svg" width=20 height=20 style="margin-bottom:-2px;margin-right:-5px">')
          msg = msg.replace(/G/g, '<embed src="alphabet/g.svg" width=20 height=20 style="margin-bottom:-2px;margin-right:-5px">')
          msg = msg.replace(/H/g, '<embed src="alphabet/h.svg" width=20 height=20 style="margin-bottom:-2px;margin-right:-5px">')
          msg = msg.replace(/I/g, '<embed src="alphabet/i.svg" width=20 height=20 style="margin-bottom:-2px;margin-right:-5px">')
          msg = msg.replace(/J/g, '<embed src="alphabet/j.svg" width=20 height=20 style="margin-bottom:-2px;margin-right:-5px">')
          msg = msg.replace(/K/g, '<embed src="alphabet/k.svg" width=20 height=20 style="margin-bottom:-2px;margin-right:-5px">')
          msg = msg.replace(/L/g, '<embed src="alphabet/l.svg" width=20 height=20 style="margin-bottom:-2px;margin-right:-5px">')
          msg = msg.replace(/M/g, '<embed src="alphabet/m.svg" width=20 height=20 style="margin-bottom:-2px;margin-right:-5px">')
          msg = msg.replace(/N/g, '<embed src="alphabet/n.svg" width=20 height=20 style="margin-bottom:-2px;margin-right:-5px">')
          msg = msg.replace(/O/g, '<embed src="alphabet/o.svg" width=20 height=20 style="margin-bottom:-2px;margin-right:-5px">')
          msg = msg.replace(/P/g, '<embed src="alphabet/p.svg" width=20 height=20 style="margin-bottom:-2px;margin-right:-5px">')
          msg = msg.replace(/Q/g, '<embed src="alphabet/q.svg" width=20 height=20 style="margin-bottom:-2px;margin-right:-5px">')
          msg = msg.replace(/R/g, '<embed src="alphabet/r.svg" width=20 height=20 style="margin-bottom:-2px;margin-right:-5px">')
          msg = msg.replace(/S/g, '<embed src="alphabet/s.svg" width=20 height=20 style="margin-bottom:-2px;margin-right:-5px">')
          msg = msg.replace(/T/g, '<embed src="alphabet/t.svg" width=20 height=20 style="margin-bottom:-2px;margin-right:-5px">')
          msg = msg.replace(/U/g, '<embed src="alphabet/u.svg" width=20 height=20 style="margin-bottom:-2px;margin-right:-5px">')
          msg = msg.replace(/V/g, '<embed src="alphabet/v.svg" width=20 height=20 style="margin-bottom:-2px;margin-right:-5px">')
          msg = msg.replace(/W/g, '<embed src="alphabet/w.svg" width=20 height=20 style="margin-bottom:-2px;margin-right:-5px">')
          msg = msg.replace(/X/g, '<embed src="alphabet/x.svg" width=20 height=20 style="margin-bottom:-2px;margin-right:-5px">')
          msg = msg.replace(/Y/g, '<embed src="alphabet/y.svg" width=20 height=20 style="margin-bottom:-2px;margin-right:-5px">')
          msg = msg.replace(/Z/g, '<embed src="alphabet/z.svg" width=20 height=20 style="margin-bottom:-2px;margin-right:-5px">')
          io.emit('chat message', '<embed src="alphabet/exclamation.svg" width=20 height=20 style="margin-bottom:-2px;margin-right:-5px"><embed src="alphabet/question.svg" width=20 height=20 style="margin-bottom:-2px;margin-right:-5px">'+msg+'<embed src="alphabet/question.svg" width=20 height=20 style="margin-bottom:-2px;margin-right:-5px"><embed src="alphabet/exclamation.svg" width=20 height=20 style="margin-bottom:-2px;margin-right:-5px">')
        } else {
          io.emit('chat message', msg)
        }



    })

  })
})

http.listen(3000, function () {
  console.log('Server running on port 3000...')
})
