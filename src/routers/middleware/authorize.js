const { base64URL } = require("../../controllers/modules/base64URL")
const jwt = require("jsonwebtoken")

// AUTHORIZE FOR LOGIN
const authorizeLogin = (req, res, next) => {
    let getAccessToken = atob(req.cookies[base64URL(process.env.CK_acToken)])
    let getRefreshToken = atob(req.cookies[base64URL(process.env.CK_rfToken)])
    let newAccessToken

    if(getAccessToken && getRefreshToken) {
        jwt.verify(getAccessToken, process.env.SCKEY, (err, decoded) => {
            if(err) {
                jwt.verify(getRefreshToken, process.env.SCKEY, (err, rfData) => {
                    if(err) {
                        console.log("Error: ")
                        res.redirect("/login")
                    } else {
                        newAccessToken = jwt.sign({inputGmail: rfData.inputGmail, userID: rfData.userID}, process.env.SCKEY, { expiresIn: "20s" })
                        next()
                    }
                })
            } else {
                console.log("Data: ", decoded)
                next()
            }
        })
    } else {
        res.redirect("/login")
    }
}

// AUTHORIZE FOR FUNCTION
const authorize = (req, res, next) => {
    let getAccessToken = atob(req.cookies[base64URL(process.env.CK_acToken)])
    let getRefreshToken = atob(req.cookies[base64URL(process.env.CK_rfToken)])
    let newAccessToken

    if(getAccessToken && getRefreshToken) {
        jwt.verify(getAccessToken, process.env.SCKEY, (err, decoded) => {
            if(err) {
                jwt.verify(getRefreshToken, process.env.SCKEY, (err, rfData) => {
                    if(err) {
                        console.log("Error: ")
                        return res.json({
                            status: "E",
                            message: "Token is invalid",
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
        res.redirect("/login")
    }
}

module.exports = { authorizeLogin, authorize }