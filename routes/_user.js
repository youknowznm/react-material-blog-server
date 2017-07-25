let userProxy = require('../proxy/user')
let nodemailer = require('nodemailer')
let smtpAuthKey = require('../config').smtpAuthKey

// 邮件配置
let smtpConfig = {
    host: 'smtp.126.com',
    port: 465,
    auth: {
        user: 'rhaego@126.com',
        pass: smtpAuthKey
    }
}
let defaultMailOptions = {
    from: "Rhaego Support <rhaego@126.com>"
}
let transporter = nodemailer.createTransport(smtpConfig)

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

    let options = Object.assign(defaultMailOptions, optionsArg)

    transporter.sendMail(options, function(error, response) {
        if (error) {
            console.log("Sending email failed: " + error)
        } else {
            console.log("success: " + response.messageID)
        }
    })
}

module.exports = function(router) {

    /*

    */
    router.post('/register', function(req, res, next){
        let email = req.body.email;
        let params = {
            email,
            password: req.body.password,
            nickname: req.body.nickname,
            verified: false,
        }
        userProxy.getUserByEmail(email, function(e, doc) {
            if (!doc) {
                // 尚未存在该邮箱的账号
                saveUser(params, function(e, doc) {
                    userProxy.sendVerifyEmail(doc)
                })
                res.end(true)
            } else {
                // 已存在
                res.end(false)
            }
        })
    })

}