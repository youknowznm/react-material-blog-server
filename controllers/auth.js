/**
浏览者的权限判定
*/
let ownerEmail = require("../config").ownerEmail

module.exports = {
    getAuthLevel(req) {
        let currentUserEmail = req.session.currentUserEmail
        let authLevel = 0
        if (currentUserEmail !== undefined) {
            authLevel = 1
            if (currentUserEmail === ownerEmail) {
                authLevel = 2
            }
        }
        return authLevel
    }
}
