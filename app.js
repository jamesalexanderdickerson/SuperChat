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
  mongoose = require('mongoose'),
  termImg = require('term-img')

/*
 * Connect to database
 */
mongoose.connect('mongodb://localhost/SuperChat', function (err) {
  if (err)
    throw err
  else {
    console.log("Connected to mongo...")
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


/*
 * Database Schema
 */
var msgSchema = new mongoose.Schema({
    message: String,
    timestamp: {type: Date, default: Date.now}
})
var usrSchema = new mongoose.Schema({
    username: String,
    password: String,
    timestamp: {type: Date, default: Date.now}
})
var User = mongoose.model('User', usrSchema)
var Chat = mongoose.model('Message', msgSchema)

/*
 * Routes
 */
app.get('/chat', function (req,res) {
  Chat.find(function (err, msgs) {
    if (err)
      res.send(err)
    else {
      res.json(msgs)
    }
  }).limit(10).sort({timestamp: -1})
})

app.get('/user', function (req,res) {
  User.find(function (err, usr) {
    if (err)
      res.send(err)
    else {
      res.render('superchat',
        { title: 'SuperChat' })
    }
  })
})

app.get('/', function (req, res) {
  res.render('index',
    { title: 'Home' })
})

app.get('/:name', function (req, res) {
    var name = req.params.name
    res.render('superchat',
      { title: name })
})

app.get('*', function (req, res) {
    res.render('index')
})


/*
 * Socket.io connection
 */
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
          msg = msg.replace(';)', '<img src="emojis/winky.svg" width=20 height=20 style="margin-bottom:-2px;">')
          io.emit('chat message', msg)
        } else if (msg.match(/:\)/g)) {
          msg = msg.replace(':)', '<img src="emojis/smiley.svg" width=20 height=20 style="margin-bottom:-2px;">')
          io.emit('chat message', msg)
        } else if ((msg.match(/i\slove\syou/gi)) || (msg.match(/i\sluv\su/gi)) || (msg.match(/i\sluv\syou/gi)) || (msg.match(/i\slove\su/gi))) {
          msg = '<img src="emojis/heart.svg" width=20 height=20 style="margin-bottom:-2px;"> ' + msg + ' <img src="emojis/heart.svg" width=20 height=20 style="margin-bottom:-2px;">'
          io.emit('chat message', msg)
        } else if (msg.match(/:P/g)) {
          msg = msg.replace(':P', '<img src="emojis/tongue.svg" width=20 height=20 style="margin-bottom:-2px;">')
          io.emit('chat message', msg)
        } else if (msg.match(/:p/g)) {
          msg = msg.replace(':p', '<img src="emojis/tongue.svg" width=20 height=20 style="margin-bottom:-2px;">')
          io.emit('chat message', msg)
        } else if (msg.match(/:\*/g)) {
          msg = msg.replace(':*', '<img src="emojis/kiss.svg" width=20 height=20 style="margin-bottom:-2px;">')
          io.emit('chat message', msg)
        } else if ((msg.match(/!\?!$/)) || (msg.match(/\?!\?$/))) {
          msg = msg.replace(/!/g, '')
          msg = msg.replace(/\?/g, '')
          msg = msg.replace(/\s/g, '<img src="alphabet/space.svg" width=20 height=20 style="margin-bottom:-2px;margin-right:-5px">')
          msg = msg.replace(/A/g, '<img src="alphabet/a.svg" width=20 height=20 style="margin-bottom:-2px;margin-right:-5px">')
          msg = msg.replace(/B/g, '<img src="alphabet/b.svg" width=20 height=20 style="margin-bottom:-2px;margin-right:-5px">')
          msg = msg.replace(/C/g, '<img src="alphabet/c.svg" width=20 height=20 style="margin-bottom:-2px;margin-right:-5px">')
          msg = msg.replace(/D/g, '<img src="alphabet/d.svg" width=20 height=20 style="margin-bottom:-2px;margin-right:-5px">')
          msg = msg.replace(/E/g, '<img src="alphabet/e.svg" width=20 height=20 style="margin-bottom:-2px;margin-right:-5px">')
          msg = msg.replace(/F/g, '<img src="alphabet/f.svg" width=20 height=20 style="margin-bottom:-2px;margin-right:-5px">')
          msg = msg.replace(/G/g, '<img src="alphabet/g.svg" width=20 height=20 style="margin-bottom:-2px;margin-right:-5px">')
          msg = msg.replace(/H/g, '<img src="alphabet/h.svg" width=20 height=20 style="margin-bottom:-2px;margin-right:-5px">')
          msg = msg.replace(/I/g, '<img src="alphabet/i.svg" width=20 height=20 style="margin-bottom:-2px;margin-right:-5px">')
          msg = msg.replace(/J/g, '<img src="alphabet/j.svg" width=20 height=20 style="margin-bottom:-2px;margin-right:-5px">')
          msg = msg.replace(/K/g, '<img src="alphabet/k.svg" width=20 height=20 style="margin-bottom:-2px;margin-right:-5px">')
          msg = msg.replace(/L/g, '<img src="alphabet/l.svg" width=20 height=20 style="margin-bottom:-2px;margin-right:-5px">')
          msg = msg.replace(/M/g, '<img src="alphabet/m.svg" width=20 height=20 style="margin-bottom:-2px;margin-right:-5px">')
          msg = msg.replace(/N/g, '<img src="alphabet/n.svg" width=20 height=20 style="margin-bottom:-2px;margin-right:-5px">')
          msg = msg.replace(/O/g, '<img src="alphabet/o.svg" width=20 height=20 style="margin-bottom:-2px;margin-right:-5px">')
          msg = msg.replace(/P/g, '<img src="alphabet/p.svg" width=20 height=20 style="margin-bottom:-2px;margin-right:-5px">')
          msg = msg.replace(/Q/g, '<img src="alphabet/q.svg" width=20 height=20 style="margin-bottom:-2px;margin-right:-5px">')
          msg = msg.replace(/R/g, '<img src="alphabet/r.svg" width=20 height=20 style="margin-bottom:-2px;margin-right:-5px">')
          msg = msg.replace(/S/g, '<img src="alphabet/s.svg" width=20 height=20 style="margin-bottom:-2px;margin-right:-5px">')
          msg = msg.replace(/T/g, '<img src="alphabet/t.svg" width=20 height=20 style="margin-bottom:-2px;margin-right:-5px">')
          msg = msg.replace(/U/g, '<img src="alphabet/u.svg" width=20 height=20 style="margin-bottom:-2px;margin-right:-5px">')
          msg = msg.replace(/V/g, '<img src="alphabet/v.svg" width=20 height=20 style="margin-bottom:-2px;margin-right:-5px">')
          msg = msg.replace(/W/g, '<img src="alphabet/w.svg" width=20 height=20 style="margin-bottom:-2px;margin-right:-5px">')
          msg = msg.replace(/X/g, '<img src="alphabet/x.svg" width=20 height=20 style="margin-bottom:-2px;margin-right:-5px">')
          msg = msg.replace(/Y/g, '<img src="alphabet/y.svg" width=20 height=20 style="margin-bottom:-2px;margin-right:-5px">')
          msg = msg.replace(/Z/g, '<img src="alphabet/z.svg" width=20 height=20 style="margin-bottom:-2px;margin-right:-5px">')
          io.emit('chat message', '<img src="alphabet/exclamation.svg" width=20 height=20 style="margin-bottom:-2px;margin-right:-5px"><img src="alphabet/question.svg" width=20 height=20 style="margin-bottom:-2px;margin-right:-5px">'+msg+'<img src="alphabet/question.svg" width=20 height=20 style="margin-bottom:-2px;margin-right:-5px"><img src="alphabet/exclamation.svg" width=20 height=20 style="margin-bottom:-2px;margin-right:-5px">')
        } else {
          io.emit('chat message', msg)
        }
    })
  })
})

/*
 * Start Server
 */

function fallback () {
    console.log('Listening on port 3000...')
}

http.listen(3000, function () {
    termImg('logo.png', {fallback})
    console.log('Listening on port 3000...')
})

