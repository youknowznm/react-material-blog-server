// 取得写在配置内的站长邮箱
let ownerEmail = require("../config").ownerEmail

module.exports = {
    /**
    根据请求的session判定浏览者的权限级别
    */
    getAuthLevel(req) {
        let currentUserEmail = req.session.currentUserEmail
        let authLevel = 0
        if (currentUserEmail !== undefined && currentUserEmail !== '') {
            authLevel = 1
            if (currentUserEmail === ownerEmail) {
                authLevel = 2
            }
        }
        return authLevel
    },
    /**
    渲染404
    */
    render404(req, res, next) {
        res.status(404).render('common/404', {
            url: req._parsedOriginalUrl._raw,
        })
    },
}
