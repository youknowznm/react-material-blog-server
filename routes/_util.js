const nodemailer = require('nodemailer')
const smtpAuthKey = require('../config').smtpAuthKey
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const userProxy = require('../proxy/user')

passport.use(new LocalStrategy(
    {
        emailField: 'Email',
        passwordField: 'Password',
    },
    function(email, password, cb) {

    }
))

/**
@param optionsArg {Object} to(String) subject(String) html(String)
*/
function auth(optionsArg) {



}


/**
从固定发件邮箱发送邮件
@param optionsArg {Object} to(String) subject(String) html(String)
*/
function sendmail(optionsArg) {

    if (typeof optionsArg.to !== 'String'
        || typeof optionsArg.subject !== 'String'
        || typeof optionsArg.html !== 'String'
    ) {
        throw new Error('Invalid arguments.')
    }

    let smtpConfig = {
        host: 'smtp.126.com',
        port: 465,
        auth: {
            user: 'rhaego@126.com',
            pass: smtpAuthKey
        }
    }

    let transporter = nodemailer.createTransport(smtpConfig)

    let options = Object.assign(
        {
            from: "Rhaego Support <rhaego@126.com>"
        },
        optionsArg
    )

    transporter.sendMail(options, function(error, response) {
        if (error) {
            console.log("Sending email failed: " + error)
        } else {
            console.log("success: " + response.messageID)
        }
    })
}

module.exports = {
    sendmail
}