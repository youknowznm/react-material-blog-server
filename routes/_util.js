const nodemailer = require('nodemailer')
const smtpAuthCode = require('../config').smtpAuthCode

/**
从固定发件邮箱发送邮件
@param optionsArg {Object} to, subject, html 收件人、主题、标记内容
*/
function sendmail(optionsArg) {

    if (typeof optionsArg.to !== 'String'
        || typeof optionsArg.subject !== 'String'
        || typeof optionsArg.html !== 'String'
    ) {
        throw new Error('must provide TO, SUBJECT and HTML')
    }

    let smtpConfig = {
        host: 'smtp.126.com',
        port: 465,
        auth: {
            user: 'rhaego@126.com',
            pass: smtpAuthCode
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