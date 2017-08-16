const CONFIG = {
    // 站点名
    siteName: 'rhaego',
    // 数据库的路径
    dbPath: 'mongodb://localhost/rhaego',
    // session的加密字符串
    sessionKey: 'ssecret',
    // 站长的登录邮箱
    ownerEmail: 'znm92@icloud.com',
    // 用于验证用户身份的加密字符串
    accountVerificationKey: 'verifyUser',
    // 用于向新注册用户发送验证邮件的邮箱设置，可在邮箱的官网设置项中查询
    smtpConfig: {
        host: 'smtp.126.com',
        port: 465,
        auth: {
            user: 'rhaego@126.com',
            // 该邮箱的客户端授权码
            pass: 'shouquanma123',
        },
        // 发件人的信息
        senderInfo: 'Rhaego Support <rhaego@126.com>',
    }
}

module.exports = CONFIG
