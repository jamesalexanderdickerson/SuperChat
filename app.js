#!/usr/local/bin/nodemon
/*
 * Module dependencies
 */
var app = require('express')(),
  express = require('express'),
  path = require('path'),
  http = require('http').Server(app),
  bodyParser = require('body-parser'),
  io = require('socket.io')(http),
  stylus = require('stylus'),
  nib = require('nib'),
  mongoose = require('mongoose'),
  session = require('express-session'),
  termImg = require('term-img'),
  jwt = require('jsonwebtoken')
  port = process.env.PORT || 3000

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
app.use(session({
  secret:'SuperSecretSecretSquirrel',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))
app.use(express.logger('dev'))
app.use(express.bodyParser())
app.use(stylus.middleware(
  { src: __dirname + '/public',
    compile: compile
    }
))
app.use(express.static(__dirname + '/public'))

function ensureAuthorized(req, res, next) {
  var bearerToken
  var bearerHeader = req.headers["authorization"]
  if (typeof bearerHeader !== 'undefined') {
    var bearer = bearerHeader.split(" ")
    bearerToken = bearer[1]
    req.token = bearerToken
    next()
  } else {
    res.send(403)
  }
}
/*
 * Database Schema
 */
 var msgSchema = new mongoose.Schema({
     message: String,
     timestamp: {type: Date, default: Date.now}
 })

var User = require('./models/User')
var Chat = mongoose.model('Messages', msgSchema)

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

app.get('/superchat', ensureAuthorized, function (req,res) {
  User.findOne({token: req.token}, function (err, user) {
    if (err) {
      res.json({
        type: false,
        data: 'Error occured ' + err
      })
    } else {
      res.render('superchat', {title: 'SuperChat', name: req.username})
    }
  })
  res.render('superchat',
    { title: 'SuperChat' }
  )
})

app.get('/', function (req, res) {
  res.render('index',
    { title: 'Home' })
})

app.post('/authenticate', function (req, res) {
    User.findOne({username: req.body.uname, password: req.body.pword}, function (err, user) {
      if (err) {
        res.render('error')
      } else {
        if (user) {
            res.render('superchat', {title: 'SuperChat', username: req.body.uname})
        } else {
          res.render('error')
        }
      }
    })
})

app.post('/newuser', function (req, res) {
  User.findOne({uname: req.body.username, password: req.body.password}, function (err,user) {
    if (err) {
      res.json({
        type: false,
        data: 'Error occurred: ' + err
      })
    } else {
      if (user) {
        res.json({
          type: false,
          data: 'User already exists!'
        })
      } else {
        var userModel = new User()
        userModel.fname = req.body.fname
        userModel.lname = req.body.lname
        userModel.username = req.body.username
        userModel.password = req.body.password
        userModel.save(function (err, user) {
          user.token = jwt.sign(user, process.env.JWT_SECRET || 'SuperSecretSecretSquirrel')
          user.save(function (err, user1) {
            res.json({
              type: true,
              data: user1,
              token: user1.token
            })
          })
        })
      }
    }
  })
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
    console.log('Starting SuperChat...')
}

http.listen(port, function () {
    termImg('logo.png', {fallback})
    console.log('Listening on port '+port+'...')
})
