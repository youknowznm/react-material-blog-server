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

// 根据email取得用户doc
function getUserByEmail(email, cb) {
    UserModel.findById(email, function(e, doc) {
        if (e) {
            console.error(e)
        }
        cb(doc)
    })
}

// 保存用户doc
function saveUser(params, cb) {
    let email = params.email
    let userDoc = new UserModel({
        // 把邮箱地址用作_id
        _id: email,
        nickname: params.nickname,
        password: params.password,
        verified: params.verified,
    })
    getUserByEmail(email, function(doc) {
        if (doc === null) {
            // userDoc._id = email
            console.log('cn',userDoc);
            userDoc.save(function(e) {
                if (e) {
                    console.error(e)
                }
                sendVerifyEmail(userDoc)
                cb(true)
            })
        } else {
            console.log('--- save failed --- : email already exists')
            cb(false)
        }
    })
}

//
function sendVerifyEmail(doc) {
    let _nickname = doc.nickname
    let _email = doc._id
    let key = new Hashes.SHA1().hex_hmac(
        emailVerificationKey,
        _nickname + _email
    )
    sendEmail({
        to: _email,
        subject: 'Rhaego Account Verification',
        html: `
            <h3>
                Dear <strong>${_nickname}</strong>,
                <br />
            </h3>
            <p>
                <a href="https://www.rhaego.com/verify/${key}">Click here</a> to verify your Rhaego account.
                <br />
                Please ignore this mail if you haven't registered at Rhaego.
            </p>
        `,
    })
}

module.exports = exports = {
    getUserByEmail,
    saveUser,
    sendVerifyEmail,
}