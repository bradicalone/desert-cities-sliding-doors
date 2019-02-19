var mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();


mongoose.promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI,{ useNewUrlParser: true }, function(error){
	if(error) console.log('Error connecting: ',error);
		console.log('Connection successful');
});


module.exports = {mongoose};
