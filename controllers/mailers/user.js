var 	haml 				= require('haml')
	, 	nodemailer 	= require('nodemailer')
 	,		smtpTransport = require('nodemailer-smtp-transport')
  ,  	fs 					= require('fs')
	,	 	transporter = nodemailer.createTransport(smtpTransport({port: 1025,
																						secure: false,
																						ignoreTLS: true}))
 // 	,		transport 	= nodemailer.createTransport("SMTP", {port: 1025});


var 	confirmationHaml 	= fs.readFileSync(__dirname +
																				'/views/confirmEmail.haml', 'utf8')
	,		resetPasswordHaml = fs.readFileSync(__dirname +
																				'/views/resetPassword.haml', 'utf8')

exports.confirmation = function(email, pseudo) {
	html = haml.render(confirmationHaml, {locals: {pseudo: pseudo}})
	console.log(email)
	mailOpts = {
		from: 'welcome@goodrecipes.com',
		to: email,
		//replace it with id you want to send multiple must be separated by ,(comma)
		subject: 'Welcome to Goodrecipes',
		text: "Welcome to goodrecipes",
		html: html
	};
	transporter.sendMail(mailOpts, function (error, response) {
		//Email not sent
		if (error) {
			console.log("Email send Falied");
			console.log(error)
		}
		//email sent successfully
		else {
			console.log("Email sent successfully");
		}
	});
	// print html
	console.log(html)
}

exports.resetPassword = function(email, pseudo, hash) {
	html = haml.render(resetPasswordHaml, {locals: {pseudo: pseudo, token:
		'<a class="button" href="http://localhost:3000/#/resetpassword?action=resetpassword&token=' + token + '">Reset my password</a>'}})
	console.log(email)
	mailOpts = {
		from: 'account-management@goodrecipes.com',
		to: email,
		//replace it with id you want to send multiple must be separated by ,(comma)
		subject: 'Reset Password',
		text: "Welcome to goodrecipes",
		html: html
	};
	transporter.sendMail(mailOpts, function (error, response) {
		//Email not sent
		if (error) {
			console.log("Email send Falied");
			console.log(error)
		}
		//email sent successfully
		else {
			console.log("Email sent successfully");
		}
	});
	// print html
	console.log(html)
}
