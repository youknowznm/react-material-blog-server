let UserModel = require('../models/user')
let nodemailer = require('nodemailer')
let Hashes= require('jshashes')
let shortid = require('shortid')

let emailVerificationKey = require('../config').emailVerificationKey
let smtpAuthKey = require('../config').smtpAuthKey

/**
从固定发件邮箱发送邮件
@param optionsArg {Object} to(String) subject(String) html(String)
*/
const sendEmail = (function(optionsArg) {

    // 邮件配置
    const SMTP_CONFIG = {
        host: 'smtp.126.com',
        port: 465,
        auth: {
            user: 'rhaego@126.com',
            pass: smtpAuthKey
        }
    }
    const DEFAULT_OPTIONS = {
        from: "Rhaego Support <rhaego@126.com>"
    }
    let transporter = nodemailer.createTransport(SMTP_CONFIG)

    return function(optionsArg) {
        let options = Object.assign(DEFAULT_OPTIONS, optionsArg)
        console.log('--- sending email --- : ', options)
        transporter.sendMail(options, function(error, response) {
            if (error) {
                console.log("Sending email failed: " + error)
            } else {
                console.log("success: " + response.messageID)
            }
        })
    }

})()

// 根据email取得用户文档
function getUserByEmail(email, cb) {
    UserModel.findOne(
        { email },
        function(e, doc) {
            if (e) {
                console.error(e)
            }
            cb(doc)
        }
    )
}

// 保存用户文档
function saveUser(params, cb) {
    let email = params.email
    let userDoc = new UserModel({
        _id: shortid.generate(),
        email: params.email,
        nickname: params.nickname,
        password: params.password,
        verified: params.verified,
    })
    getUserByEmail(email, function(doc) {
        if (doc === null) {
            userDoc.save(function(e) {
                if (e) {
                    console.error(e)
                }
                sendVerifyEmail(userDoc)
                cb(true)
            })
        } else {
            cb(false)
        }
    })
}

// 生产加盐的密钥，作为验证邮箱url的pathname，发送至该邮箱
function sendVerifyEmail(doc) {
    let email = doc.email
    let key = new Hashes.SHA1().hex_hmac(emailVerificationKey, email) + '!' + email
    sendEmail({
        to: email,
        subject: 'Rhaego Account Verification',
        html: `
            <h3>
                Dear ${doc.nickname},
            </h3>
            <p>
                <a href="http://localhost:5000/verify/${key}">Click here</a> to verify your Rhaego account.
            </p>
            <p>
                Please ignore this mail if you haven't registered at Rhaego.
            </p>
        `,
    })
}

// 验证邮箱
function verifyEmail(key, cb) {
    let _hash = key.split('!')[0]
    let _email = key.split('!')[1]
    let targetKey = new Hashes.SHA1().hex_hmac(emailVerificationKey, _email) + '!' + _email
    if (targetKey === key) {
        getUserByEmail(_email, function(doc) {
            UserModel.update(
                doc,
                {verified: true},
                function() {
                    console.log('--- verified ---');
                    cb(true)
                }
            )
        })
    } else {
        cb(false)
    }
}

module.exports = exports = {
    getUserByEmail,
    saveUser,
    sendVerifyEmail,
    verifyEmail,
}