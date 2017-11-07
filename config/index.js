module.exports = {
    // 站点名
    siteName: 'YouKnowznM',
    // 数据库的路径
    dbPath: 'mongodb://localhost/rhaego',
    // session的加密字符串
    sessionKey: 'ssecret',
    // 站长的登录邮箱
    ownerEmail: 'znm92@icloud.com',
    // 用于验证用户身份的加密字符串
    accountVerificationKey: 'verifyUser',
    // 用于向新注册用户发送验证邮件的邮箱设置，可在邮箱的官网设置项中查询，以下均为必需
    smtpConfig: {
        // 主机名
        host: 'smtp.126.com',
        // 端口
        port: 465,
        // 发件邮箱名
        auth: {
            user: 'rhaego@126.com',
            // 该邮箱的客户端授权码
            pass: 'shouquanma123',
        },
        // 发件人的信息
        senderInfo: 'Rhaego Support <rhaego@126.com>',
    },
    // 不同环境的站点地址
    siteAddress: process.env.NODE_ENV === 'development' ? 'localhost:5000' : '140.143.188.149'
}