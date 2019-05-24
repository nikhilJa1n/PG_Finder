var express  = require('express');
var app      = express();
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
var keys = require('./config/keys');

mongoose.connect(keys.mongodb.dbURI); 


app.use(express.static(__dirname + '/public'));
app.use(morgan('tiny')); 
app.use(cookieParser()); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.use(session({
    secret: 'secret', 
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); 
app.use(flash()); 

require('./routes/routes')(app,passport);
require('./config/passport')(app,passport);
// require('./routes/UserRooms')(app);
app.listen(8000);
console.log('port:8000');
