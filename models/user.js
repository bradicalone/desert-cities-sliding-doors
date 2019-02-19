var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
	firstName: {
		type: String,
  		required: true
	},
	lastName: {
		type: String,
  		required: true
	},
	email: {
  		type: String,
  		required: true
  	},
	website: {
		type: String,
  		required: false
	},
	password: {
		type: String,
  		required: false
	},
	message: {
		type: String,
  		required: false
	},

});
//Use this if going to use the password input, if so use the rest of requirements from bookmark nodejs - Authentication - tutorial with Node.js and MongoDB
// UserSchema.pre('save', function (next) {
//   	var user = this;
//   	bcrypt.hash(user.password, 10, function (err, hash){
//     	if (err) {
//       		return next(err);
//     	}
//     	user.password = hash;
//     	next();
//   	})
// });


var User = module.exports = mongoose.model('User', UserSchema);