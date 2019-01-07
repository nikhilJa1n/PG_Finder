const mongoose =require('mongoose');
const UserSchema=mongoose.Schema({
    username:{
        type:String,
        index:true
    },
    pgname:{
        type:String,
        index:true
    },
    numberofrooms:{
        type:Number,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    pgphoneno:{
        type:Number,
        required:true
    },
    roomtype:{
        type:String,
        required:true
    },
    roomfor:{
        type:String,
        required:true
    },
    roomprice:{
        type:Number,
        required:true
    },
    amenities:{
        type:Array
    }
})
var PgDetail = module.exports = mongoose.model('pgdetails', UserSchema);

module.exports.createPg = function(newUser,callback){
	newUser.save(callback);
}
module.exports.getPgByUsername = function(username,callback){
	var query = {username: username};
	PgDetail.findOne(query, callback);
}
