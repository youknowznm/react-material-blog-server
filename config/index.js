const CONFIG = {
    // 站点名
    siteName: 'rhaego',
    // 数据库的路径
    dbPath: 'mongodb://localhost/rhaego',
    // 用于向新注册用户发送验证邮件的邮箱的客户端授权码
    smtpAuthKey: 'shouquanma123',
    // 验证邮件的加密字符串
    emailVerificationKey: 'verifyUser',
    // session的加密字符串
    sessionKey: 'ssecret',
    // 站长的邮箱
    ownerEmail: 'znm92@icloud.com'
}

module.exports = CONFIG
