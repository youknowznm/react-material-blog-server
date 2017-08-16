let UserModel = require('../models/user')
let nodemailer = require('nodemailer')
let Hashes= require('jshashes')
let shortid = require('shortid')

let accountVerificationKey = require('../config').accountVerificationKey
let smtpConfig = require('../config').smtpConfig

/**
从固定发件邮箱发送邮件
@param optionsArg {Object} to(String) subject(String) html(String)
*/
const sendEmail = (function(optionsArg) {

    // 邮件配置
    const SMTP_CONFIG = {
        host: smtpConfig.host,
        port: smtpConfig.port,
        auth: smtpConfig.auth
    }
    const DEFAULT_OPTIONS = {
        from: smtpConfig.senderInfo
    }
    let transporter = nodemailer.createTransport(SMTP_CONFIG)

    return function(optionsArg) {
        let options = Object.assign(DEFAULT_OPTIONS, optionsArg)
        console.log('--- sending email --- \n', options)
        transporter.sendMail(options, function(error, response) {
            if (error) {
                console.log("--- sending email fail --- \n" + error)
            } else {
                console.log("--- sending email success --- \n" + response.messageID)
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
    let key = new Hashes.SHA1().hex_hmac(accountVerificationKey, email) + '!' + email
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
    let targetKey = new Hashes.SHA1().hex_hmac(accountVerificationKey, _email) + '!' + _email
    if (targetKey === key) {
        getUserByEmail(_email, function(doc) {
            UserModel.update(
                doc,
                {verified: true},
                function() {
                    console.log('--- verified --- \n');
                    cb(true)
                }
            )
        })
    } else {
        cb(false)
    }
}

/**
登录
回调参数映射：
0 该邮箱尚未注册
1 登陆成功
2 密码错误
3 尚未验证该邮箱
4 服务器错误
*/
function login(email, password, cb) {
    UserModel.findOne(
        { email },
        function(e, doc) {
            if (e) {
                console.error(e)
                cb(4)
            } else {
                if (doc === null) {
                    // 该邮箱尚未注册
                    cb(0)
                } else {
                    if (doc.password !== password) {
                        // 密码错误
                        cb(2)
                    } else {
                        if (doc.verified === false) {
                            // 尚未验证该邮箱
                            cb(3)
                        } else {
                            // 登陆成功
                            cb(1)
                        }
                    }
                }
            }
        }
    )
}

module.exports = {
    getUserByEmail,
    saveUser,
    sendVerifyEmail,
    verifyEmail,
    login,
}