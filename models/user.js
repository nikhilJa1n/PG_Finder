var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');


var userSchema = mongoose.Schema({
  name : String,
  gender: String,
  dob: String,
  num:Number,
  email: String,
  pwd: String,
  // fbid: String,
});

var roomSchema = mongoose.Schema({
  userid:String,
  pgname: String,
  roomfor: String,
  doorno: String,
  saddress:String,
  city:String,
  state:String,
  zipcode:Number,
  pgphoneno:Number,
  roomtype:String,
  rent : Number,
  deposit : Number,
  amenities : Array,
});

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
User = mongoose.model('User', userSchema);
Room = mongoose.model('Room', roomSchema);

module.exports = {
    User: User,
    Room: Room,
};
module.exports.getpgbylocation=function(city,callback){
  var query={city:city};
  Room.find(query,callback);
}
