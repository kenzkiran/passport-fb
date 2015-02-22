// dependencies
var fs = require('fs');
var http = require('http');
var express = require('express');
var routes = require('./routes');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var MongoStore = require('connect-mongo')(expressSession);
var User = require('./lib/User.js');

// initialize facebook login.
var passport = require('./lib/passport-fb.js')();

var app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

// using mongo store
var mStore =  new MongoStore({url:'mongodb://localhost:27017/passport-fb'});
app.use(expressSession({store: mStore, secret: 'mysecret', resave: false, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));


// routes
app.get('/', routes.index);
app.get('/ping', routes.ping);


app.get('/account', ensureAuthenticated, function(req, res) {
    User.findById(req.session.passport.user, function(err, user) {
        if(err) {
            console.log(err);
        } else {
            res.render('account',{user: user});
        };
    });
});

app.get('/', function(req, res){
    res.render('login', { user: req.user });
});

app.get('/auth/facebook',
    passport.authenticate('facebook'),
    function(req, res){
    });

app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/' }),
    function(req, res) {
        res.redirect('/account');
    });
app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

// port
app.listen(3000);

// test authentication
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/')
}