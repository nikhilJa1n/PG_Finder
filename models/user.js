const mongoose =require('mongoose');
var bcrypt = require('bcryptjs');
const UserSchema=mongoose.Schema({
    username:{
        type:String,
        index:true
    },
    fname:{
        type:String,
        required:true
    },
    lname:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    selftype:{
        type:Number
    },
    gender:{
        type:String,
    }
})
var User = module.exports = mongoose.model('User', UserSchema);
module.exports.createUser = function(newUser,callback){
	bcrypt.genSalt(10,function(err,salt){
		bcrypt.hash(newUser.password, salt, function(err,hash){
			newUser.password = hash;
			newUser.save(callback);
		})
	})
}
module.exports.getUserByUsername = function(username,callback){
	var query = {username: username};
	User.findOne(query, callback);
}
module.exports.getUserById = function(id,callback){
	User.findById(id, callback);
}
module.exports.comparePassword = function(candidatePassword, hash,callback){
	bcrypt.compare(candidatePassword, hash,function(err,isMatch){
		if(err) throw err;
		callback(null,isMatch);
	})
}