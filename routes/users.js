var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var PgDetail = require('../models/pgdetails');

//var Pg = require('../models/pg');
/* GET users listing. */
var usernamezz;

router.get('/signup', function(req, res, next) {
  res.render('signup');
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/profile', function(req,res,next){
  PgDetail.getPgByUsername(usernamezz,function(err,userr){
    if(userr){
    console.log(userr);
    res.render('profile',{
      username:userr.username,
      pgname:userr.pgname,
      numberofrooms:userr.numberofrooms,
      state:userr.state,
      city:userr.city,
      pgphoneno:userr.pgphoneno,
      roomtype:userr.roomtype,
      roomfor:userr.roomfor,
      roomprice:userr.roomprice,
      amenities:userr.amenities  
    });
  }
  else{
    res.redirect('/users/provider');
  }
  })
  
})
router.get('/provider', function(req, res, next) {
  res.render('provider');
});

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
      User.getUserByUsername(username,function(err,user){
        if(user){
          req.flash('error_msg','user already registred');
          res.redirect('/users/signup');
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
      })

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
            usernamezz=username;
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
  router.post('/login', passport.authenticate('local', {successRedirect:'/users/index', failureRedirect:'/users/login',failureFlash: 'invadid username and password'}), function(req,res){
    //req.flash('error_msg','wrong');
  //res.render('/users/cust');
  });
  
  router.get('/index', ensureAuthenticated, function(req, res) {
    if(req.user.selftype==1){
      PgDetail.getPgByUsername(usernamezz,function(err,userr){
        if(userr){
          res.redirect('/');    
        }
        else{
          res.redirect('/users/provider');
        }
      })
      
    } else{
      res.redirect('/');
    }
  });

//////////////////////////////////////////////////////////
router.post("/provider",function(req,res){
  var pgname=req.body.pgname;
  var numberofrooms=req.body.numberofrooms;
  var state=req.body.state;
  var city=req.body.city;
  var pgphoneno=req.body.pgphoneno;
  var roomtype=req.body.roomtype;
  var roomfor=req.body.roomfor;
  var roomprice = req.body.roomprice;
  var amenities = req.body.amenities;
  var username=req.body.username;
  
  req.checkBody('pgname','pgname is required').notEmpty();
  req.checkBody('numberofrooms','number of rooms is required').notEmpty();
  req.checkBody('state','state is required').notEmpty();
  req.checkBody('city','city is required').notEmpty();
  req.checkBody('pgphoneno','mobile number is not valid').isInt();
  req.checkBody('pgphoneno','mobile number is required').notEmpty();
  req.checkBody('roomprice','roomprice is required').notEmpty();
  req.checkBody('amenities','password is required').notEmpty();
  
  var errors = req.validationErrors();
  if(errors){
      res.render('provider',{
          errors:errors
      });
  }
  else{
      var newNewDetail =new PgDetail({
        username:username,
          pgname:pgname,
          numberofrooms:numberofrooms,
          state:state,
          city:city,
          pgphoneno:pgphoneno,
          roomtype:roomtype,
          roomfor:roomfor,
          roomprice:roomprice,
          amenities:amenities
      })
      PgDetail.createPg(newNewDetail, function(err,pgdetails){
        if(err) throw err;
        console.log(pgdetails);
    });
      res.redirect('/');
    }
});


/////////////////////////////////////////////////////



  
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
  