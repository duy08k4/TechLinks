const { base64URL } = require("../../controllers/modules/base64URL")
const jwt = require("jsonwebtoken")

// AUTHORIZE FOR LOGIN
const authorizeLogin = (req, res, next) => {
    let getAccessToken = req.cookies[base64URL(process.env.CK_acToken)] ? atob(req.cookies[base64URL(process.env.CK_acToken)]) : undefined
    let getRefreshToken = req.cookies[base64URL(process.env.CK_rfToken)] ? atob(req.cookies[base64URL(process.env.CK_rfToken)]) : undefined
    let newAccessToken

    if(getAccessToken && getRefreshToken) {
        jwt.verify(getAccessToken, process.env.SCKEY, (err, decoded) => {
            if(err) {
                jwt.verify(getRefreshToken, process.env.SCKEY, (err, rfData) => {
                    if(err) {
                        
                    } else {
                        newAccessToken = jwt.sign({inputGmail: rfData.inputGmail, userID: rfData.userID}, process.env.SCKEY, { expiresIn: "20s" })
                        res.cookie(base64URL(process.env.CK_acToken), base64URL(newAccessToken), {
                            httpOnly: true,
                            secure: true
                        })

                        req.user = {
                            inputGmail: rfData.inputGmail,
                            userID: rfData.userID,
                            logined: true
                        }
                    }
                })
            } else {
                console.log("Data: ", decoded)
                req.user = {
                    inputGmail: decoded.inputGmail,
                    userID: decoded.userID,
                    logined: true
                }
            }
        })
    }
    next()
}

// AUTHORIZE FOR FUNCTION
const authorize = (req, res, next) => {
    let getAccessToken = req.cookies[base64URL(process.env.CK_acToken)] ? atob(req.cookies[base64URL(process.env.CK_acToken)]) : undefined
    let getRefreshToken = req.cookies[base64URL(process.env.CK_rfToken)] ? atob(req.cookies[base64URL(process.env.CK_rfToken)]) : undefined
    let newAccessToken

    if(getAccessToken && getRefreshToken) {
        jwt.verify(getAccessToken, process.env.SCKEY, (err, decoded) => {
            if(err) {
                jwt.verify(getRefreshToken, process.env.SCKEY, (err, rfData) => {
                    if(err) {
                        return res.json({
                            status: "E",
                            message: "Your session has expired. Please login again.",
                            redirect: "/login"
                        })
                    } else {
                        newAccessToken = jwt.sign({inputGmail: rfData.inputGmail, userID: rfData.userID}, process.env.SCKEY, { expiresIn: "15m" })
                        res.cookie(base64URL(process.env.CK_acToken), base64URL(newAccessToken), {
                            httpOnly: true,
                            secure: true
                        })

                        next()
                    }
                })
            } else {
                next()
            }
        })
    } else {
        return res.json({
            status: "E",
            message: "You haven't logged in yet. Please login first.",
            redirect: "/login"
        })
    }
}

module.exports = { authorizeLogin, authorize }