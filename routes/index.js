var express = require('express');
var router = express.Router();
var User = require('../models/user');
var PgDetail = require('../models/pgdetails');
/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index');
	console.log('home');
	
});

router.post("/",function(req,res){
	var location=req.body.location;
	var gender=req.body.gender;
	var rtype=req.body.rtype;
	req.checkBody('location','location is required').notEmpty();
	req.checkBody('gender','room for is required').notEmpty();
	var errors = req.validationErrors();
	if(errors){
		res.render('index',{
			errors:errors
		});
	}
	else{
		PgDetail.getPgByLocation(location,gender,rtype,function(err,locos){
			console.log(locos);
			res.render('locationresults',{locos:locos});
		})

		
	}
  })

function ensureAuthenticated(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	else{
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}
module.exports = router;
