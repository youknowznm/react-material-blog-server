let UserModel = require('../models/user')
let util = require('../routes/_util')

function getUserByEmail(email, cb) {
    UserModel.findOne(
        { email },
        function(e, doc) {
            if (e) {
                console.error(e)
            }
            return cb(doc);
        }
    )
}

function saveUser(params, cb) {
    let email = params.email
    let userDoc = new UserModel({
        email,
        password: params.password,
        verified: params.verified,
    })
    UserModel.getUserByEmail(email, function(e, doc) {
        if (!doc) {
            userDoc.save(function(e) {
                if (e) {
                    console.error(e)
                }
                return cb()
            })
        } else {
            UserModel.update(
                { email },
                userDoc,
                function(e) {
                    if (e) {
                        console.error(e)
                    }
                    return cb()
                }
            )
        }
    })
}

function sendVerifyEmail(email) {
    util.sendVerifyEmail{
        to: email,
        subject: 'Rhaego Account Verification',
        html: `
            Please click here
        `,
    }
}

module.exports = exports = {
    getUserByEmail,
}