const db = require("../../firebaseSDK")

async function createAccount(email, password, req, res) {
    // Tạo tài khoản
    
    res.clearCookie("verifyCode").clearCookie("email").clearCookie("password")

    return res.json({
        status: "S",
        message: "Tạo tài khoản thành công"
    })
}

module.exports = function(app) {
    app.post("/register/createAccount", async (req, res) => {
        let inputVerifyCode = req.body.inputCode
        let trueVerifyCode = req.cookies.verifyCode
        
        if(trueVerifyCode === undefined) {
            return res.json({
                status: "E",
                message: "Mã xác nhận đã hết hạn"
            })
        } else {
            if(inputVerifyCode === trueVerifyCode) {
                return await createAccount(atob(req.cookies.email), atob(req.cookies.password), req, res)
            } else {
                res.json({
                    status: "E",
                    message: "Mã xác nhận không đúng"
                })
            }
        }
    })
}