const CONFIG = {
    // 站点名
    siteName: 'rhaego',
    // 数据库的路径
    dbPath: 'mongodb://localhost/rhaego',

    // 验证邮件的加密字符串
    emailVerificationKey: 'verifyUser',
    // session的加密字符串
    sessionKey: 'ssecret',
    // 站长的登录邮箱
    ownerEmail: 'znm92@icloud.com'
    // 验证邮件的发送
    smtpConfig: {
        host: 'smtp.126.com',
        port: 465,
        auth: {
            user: 'rhaego@126.com',
            // 用于向新注册用户发送验证邮件的邮箱的客户端授权码，在邮箱官网的设置中可查到
            pass: 'shouquanma123',
        },
        senderNickname: 'Rhaego Support <rhaego@126.com>',
    }

}

module.exports = CONFIG
