const db = require("../../firebaseSDK")
const jwt = require("jsonwebtoken")
const { base64URL } = require("../controllers/modules/base64URL")

module.exports = function (app) {
    app.post("/login/handleLogin", async (req, res) => {
        let inputGmail = atob(req.body.inputGmail)
        let inputPassword = atob(req.body.inputPassword)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(emailRegex.test(inputGmail) === false) {
            res.json({
                status: "E",
                message: "Gmail is invalid"
            })
        } else {
            let getCol = await db.collection(btoa(process.env.KEY_USER_ACCOUNT))
            let getDoc = await getCol.doc(btoa(inputGmail)).get()

            if (!(await getDoc).exists) {
                return res.json({
                    status: "E",
                    message: "Account is incorrect 1"
                })
            } else {
                if(atob(getDoc.data().password) != inputPassword) {
                    return res.json({
                        status: "E",
                        message: "Account is incorrect"
                    })
                } else {
                    let userID = atob(getDoc.data().userID)
                    let refreshToken

                    if (!getDoc.data().rfToken) {
                        refreshToken = jwt.sign({inputGmail, userID}, process.env.SCKEY, { expiresIn: "1d" })
                        await getCol.doc(btoa(inputGmail)).update({rfToken: btoa(refreshToken)})
                        
                    } else {
                        jwt.verify(getDoc.data().rfToken, process.env.SCKEY, async (err, decoded) => {
                            if (err) {
                                refreshToken = jwt.sign({inputGmail, userID}, process.env.SCKEY, { expiresIn: "1d" })
                                await getCol.doc(btoa(inputGmail)).update({rfToken: btoa(refreshToken)})
                            } else {
                                refreshToken = getDoc.data().rfToken
                            }
                        })
                    }
                    let getLimit = await db.collection("rules").doc("limitation").get()
                    let accessToken = jwt.sign({inputGmail, userID}, process.env.SCKEY, { expiresIn: "15m" })

                    res.cookie(base64URL(process.env.CK_acToken), base64URL(accessToken), {
                        httpOnly: true,
                        secure: true
                    })

                    res.cookie(base64URL(process.env.CK_rfToken), base64URL(refreshToken), {
                        httpOnly: true,
                        secure: true
                    })

                     return res.json({
                        status: "S",
                        message: "Login successfully",
                        l_Title: getLimit.data().title,
                        l_URL: getLimit.data().url,
                        l_Description: getLimit.data().description
                    })
                }
            }
        }
    })
}