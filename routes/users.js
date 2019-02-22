const express = require('express');
const router = express.Router();
const User = require('./../models/user');
const mongoose = require('./../db/mongoose');
const async = require('async');
const nodemailer = require("nodemailer");
const { body } = require('express-validator/check');


router.get('/contact', function(req, res) {
	res.render('users/contact',{layout: false, messages: 'Form Validation', success: false, errors: req.session.errors});
  	req.session.errors = null;
});

router.post('/contact', [body('message').trim().escape().escape().blacklist()], function(req, res, next){
	
	
	req.check('firstName', 'Check name again, and make sure it\s at least 2 characters long').isLength({min: 2, max: 20})
	req.check('lastName', 'Check last name again')
	req.check('email', 'Invalid email').isEmail().normalizeEmail()
	req.check('phone', 'Invalid phone number').trim()
	req.check('webiste', 'Invalid email').trim()
	req.check('message', 'Can\'t be empty').trim().escape()
    

	const mailerOutput = `
	<p>You have a new contact request</p>
	<h3>Contact Details</h3>
	<ul>
		<li>Name: ${req.body.firstName} ${req.body.lastName}</li>
		<li>Email: ${req.body.email}</li>
		<li>Phone #: ${req.body.phone}</li>
		<li>Company website: ${req.body.website}</li>
	<ul>
	<h3>Message</h3>
	<p>${req.body.message}</p>`;
	
	
	var errors = req.validationErrors();

   	if(errors){
   		
      	req.session.errors = errors;
      	req.session.success = false;
      	console.log('errors in the errors: ', errors);
      	return res.redirect('/users/contact');
   	}
   	else{

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
				// to: 'sliding.solutions.web@gmail.com',
				to: 'sliding.solutions.web@gmail.com, officemanager.slidingsolutions@gmail.com',
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
      		console.log('database doc: ',doc);
			res.render('users/contact', {layout: false, success: true});

	  	}, (e) => {
	  		res.send('An error accoured saving user: ' + e)  
	  	})
    }
	
		
});
module.exports = router;