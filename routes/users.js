var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

//var Pg = require('../models/pg');
/* GET users listing. */

router.get('/signup', function(req, res, next) {
  res.render('signup');
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/profile', function(req,res,next){
  res.render('profile');
})

router.post("/signup",function(req,res){
    var username=req.body.username;
    var fname=req.body.fname;
    var lname=req.body.lname;
    var mobile=req.body.mobile;
    var email=req.body.email;
    var password=req.body.password;
    var selftype = req.body.optradio;
    
    req.checkBody('username','username is required').notEmpty();
    req.checkBody('fname','First name is required').notEmpty();
    req.checkBody('lname','last name is required').notEmpty();
    req.checkBody('mobile','mobile number is required').notEmpty();
    req.checkBody('mobile','mobile number is not valid').isInt();
    req.checkBody('email','Email is required').notEmpty();
    req.checkBody('email','Email is not valid').isEmail();
    req.checkBody('password','password is required').notEmpty();
    
    var errors = req.validationErrors();
    if(errors){
        res.render('signup',{
            errors:errors
        });
    }
    else{
        var newUser =new User({
            username:username,
            fname:fname,
            lname:lname,
            mobile:mobile,
            email:email,
            password:password,
            selftype:selftype
        })
  	    User.createUser(newUser, function(err,user){
            if(err) throw err;
            console.log(user);
        });
        req.flash('success_msg', 'You are registered');
        res.redirect('/users/login');
      }
});
passport.use(new LocalStrategy(
    function (username, password, done) {
      User.getUserByUsername(username, function(err, user){
        if(err) throw err;
        if(!user){
          return done(null,false, {message:' Unknown User'});
        }
        User.comparePassword(password, user.password, function(err, isMatch){
          if(err) throw err;
          if(isMatch){
            return done(null,user);
          }
          else{
            return done(null,false,{message: 'Invalid Password'});
          }
        });
      });
      }));
  
  passport.serializeUser(function(user, done){
    done(null,user.id);
  });
  
  passport.deserializeUser(function(id, done){
    User.getUserById(id, function(err, user){
      done(err, user);
    });
  });
  router.post('/login', passport.authenticate('local', {successRedirect:'/users/index', failureRedirect:'/users/login',failureFlash: true}), function(req,res){
  res.render('/users/index');
  });
  
  router.get('/index', ensureAuthenticated, function(req, res) {
    if(req.user.selftype==1){
      res.render('provider');
    } else{
      res.render('gainer');
    }
  });
  
  function ensureAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
      return next();
    } else {
      req.flash('error_msg','Please login first');
      res.redirect('/users/login');
    }
  }
  
  router.get('/logout',function(req,res){
    req.logout();
    req.flash('success_msg','You are  logged out');
    res.redirect('/users/login');
  });
  module.exports = router;
  