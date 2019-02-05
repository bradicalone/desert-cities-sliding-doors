const express = require('express');
const router = express.Router();
const User = require('./../models/user');
// const mongoose = require('./../db/mongoose');
const async = require('async');
const nodemailer = require("nodemailer");

router.get('/contact', function(req, res, next) {
  	res.render('users/contact', {layout: false});
});

// router.post('/contact', function(req, res){
// 	failureFlash: true;
	
// 	console.log(req.body.email,req.body.firstName);
// 	var  user = new User({
// 		firstName: req.body.firstName,
// 		lastName: req.body.lastName,
// 		email: req.body.email
// 	})
// 	async function main(){
	
// 		var smtpTransport = nodemailer.createTransport({
// 			service: 'Gmail',
// 			auth: {
// 				user: 'sliding.solutions.web@gmail.com',
// 				pass: 'Sliding109'
// 			}
// 		});
// 		var mailOptions = {
// 			to: user.email,
// 			from: 'bradvanderbush@gmail.com',
// 			subject: 'Desert Contact Form',
// 			text: 'Email working' 
// 		};
// 		smtpTransport.sendMail(mailOptions, function(err, info){
// 			console.log('mail sent');
// 			// req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions');
// 				res.render('users/contact', {layout: false})
// 		})
// 	}
// 	main().catch(function(err){
// 		if(err) console.log(err);
		
// 	});

// 	// console.log('user object ',user);
// 	// user.save().then((doc) => {
//  //    	res.render('users/contact', {layout: false})
//  //  	}, (e) => {
//  //  		res.send(e)  
//  //  	})	
// });
module.exports = router;