var LocalStrategy    = require('passport-local').Strategy;

var models = require('../models/user');


module.exports = function(app, passport) {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({    
        usernameField : 'email',
        passwordField : 'pwd',
        passReqToCallback : true
    },
    function(req, email, password, done) {
        process.nextTick(function() {
            if (!req.user) {
                models.User.findOne({ 'email' :  email }, function(err, user) {
                    if (err)
                        return done(err);
                    if (user)
                        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                    else {

                        var data=req.body;
                        console.log(req.body);
                        var newUser = models.User(data);
                        newUser.save(function(err,user) {
                            if (err)
                                return done(err);
                                return done(null, newUser);
                        });
                        
                    }

                });
            }

        });

    }));

    passport.use('local-login', new LocalStrategy({    
        usernameField : 'email',
        passwordField : 'pwd',
        passReqToCallback : true
    },
    function(req, email, pwd, done) {
        process.nextTick(function() {
            if (!req.user) {
                models.User.findOne({ 'email' :  email }, function(err, user) {
                    if (err)
                        return done(err);
                    if (user)
                    {
                        models.User.findOne({'pwd':pwd},function(errr,userr){
                            if(errr)
                            return done(err);
                            else
                            return done(null,userr);
                        })
                    }
                    else
                    {
                        return done(null, false, req.flash('signinMessage', 'Login Error !!'));    
                    }

                });
            }

        });

    }));


};
