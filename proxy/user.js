let UserModel = require('../models/user').UserModel
let nodemailer = require('nodemailer')
let Hashes= require('jshashes')
let shortid = require('shortid')

let accountVerificationKey = require('../config').accountVerificationKey
let smtpConfig = require('../config').smtpConfig

/**
从固定发件邮箱发送邮件
@param optionsArg {object} 参数对象，包含to(收件邮箱)、subject(主题)、html(内容)
@param cb {?function} 可选的发送完成回调，成功传入true，失败传入false
*/
const sendEmail = (function(optionsArg, cb) {

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
                if (typeof cb === 'function') {
                    cb(true)
                }
            } else {
                console.log("--- sending email success --- \n" + response.messageID)
                if (typeof cb === 'function') {
                    cb(false)
                }
            }
        })
    }

})()

/**
根据email取得用户文档
@param email {string} 目标账户的邮箱
@param cb {function} 查找完成回调，传入找到的文档
*/
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

/**
保存用户文档
@param params {object} 参数对象，包含_id、邮箱、昵称、密码、是否已验证
@param cb {function} 保存行为的回调，成功保存传入true，邮箱已存在传入false
*/
function saveUser(params, cb) {
    let email = params.email
    let userDoc = new UserModel({
        _id: shortid.generate(),
        email: params.email,
        nickname: params.nickname,
        password: params.password,
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

/**
生产加盐的密钥，作为验证邮箱url的pathname，发送至该邮箱
@param doc {object} 目标用户的文档
*/
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

/**
验证账户邮箱
@param key {string} 从邮件提供的url中取得的字符串
@param cb {function} 验证完成的回调，成功传入该邮箱字符串，失败不传参
*/
function verifyEmail(key, cb) {
    let _hash = key.split('!')[0]
    let _email = key.split('!')[1]
    let targetKey = new Hashes.SHA1().hex_hmac(accountVerificationKey, _email) + '!' + _email
    if (targetKey === key) {
        getUserByEmail(_email, function(doc) {
            UserModel.update(
                doc,
                { verified: true },
                function() {
                    console.log('--- verified --- \n');
                    cb(_email)
                }
            )
        })
    } else {
        cb()
    }
}

/**
登录
@param email {string} 用户邮箱
@param password {string} 用户密码
@param cb {function} 登录回调，参数说明：
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
                // 服务器错误
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