const express = require('express');
const router = express.Router();
const User = require('./../models/user');
const mongoose = require('./../db/mongoose');
const async = require('async');
const nodemailer = require("nodemailer");


router.get('/contact', function(req, res) {
	console.log(req.session, req.sessionID);
	res.render('users/contact',{layout: false, messages: 'Form Validation', success: false, errors: req.session.errors});
  	req.session.errors = null;
});

router.post('/contact', function(req, res, next){
	const mailerOutput = `
	<p>You have a new contact request</p>
	<h3>Contact Details</h3>
	<ul>
		<li>Name: ${req.body.firstName,  req.body.lastName}</li>
		<li>Email: ${req.body.firstName}</li>
		<li>Phone #: ${req.body.firstName}</li>
		<li>Company website: ${req.body.website}</li>
	<ul>
	<h3>Message</h3>
	<p>${req.body.message}</p>
	`;
	// 'email' from the name attribute from the form
	req.check('email', 'Invalid email').isEmail()
	req.check('firstName', 'Check name again').isLength({min: 2, max: 20})
	
	var errors = req.validationErrors();
   	if(errors){
      	req.session.errors = errors;
      	req.session.success = false;
      	return res.redirect('/users/contact');
   	}
   	else{
      	req.session.success = true;

	    async function main(){
		
			var smtpTransport = nodemailer.createTransport({
				service: 'Gmail',
				host: 'smtp.gmail.com',
				secure: true,
				auth: {
					user: 'sliding.solutions.web@gmail.com',
					pass: 'Sliding109'
				}
			});
			var mailOptions = {
				from: req.body.name,
				to: 'sliding.solutions.web@gmail.com, b.vanderbush@yahoo.com',
				subject: 'Desert Contact Form',
				html: mailerOutput
			};
			smtpTransport.sendMail(mailOptions, function(err, info){
				if(err) console.log('An error sending mail: ' + err);
				console.log('Mail sent');
				// req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions');
					// res.render('users/contact', {layout: false})
			})
		}
		main().catch(function(err){
			if(err) console.log(err);
			
		});

      	var  user = new User({
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			phone: req.body.phone,
			message: req.body.message
			//Active if need login
			// password: req.body.password
		})

      	user.save().then((doc) => {
			res.render('users/contact',{layout: false} );
	  	}, (e) => {
	  		res.send('An error accoured saving user: ' + e)  
	  	})
    }
	
		
});
module.exports = router;