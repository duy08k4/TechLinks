const db = require("../../firebaseSDK")

function createUserID() {
    let userID = "techlinksUser::"
    let date = new Date()
    let getDateTime = (date.getTime()).toString()
    let randomnNumber = (Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join('')).toString()

    userID += getDateTime + randomnNumber

    let createTime = `${date.getDate()} THG ${date.getMonth() + 1}, ${date.getFullYear()}`

    return { userID, createTime }
}

async function createAccount(email, password, req, res) {
    // Tạo tài khoản
    let { userID, createTime } = createUserID()

    await db.collection(btoa(process.env.KEY_USER_ACCOUNT)).doc(btoa(email)).set({
        userID: btoa(userID),
        email: btoa(email),
        password: btoa(password),
        createTime: createTime,
        role: "userBasic"
    })
    .then(() => {
        res.clearCookie("verifyCode").clearCookie("email").clearCookie("password")
    
        return res.json({
            status: "S",
            message: "Successfully created account!"
        })
    })
    .catch(err => {
        console.log(err)
        return res.json({
            status: "E",
            message: "Failed to create account!"
        })
    })
    
}

module.exports = function(app) {
    app.post("/register/createAccount", async (req, res) => {
        let inputVerifyCode = req.body.inputCode
        let trueVerifyCode = req.cookies.verifyCode
        
        if(trueVerifyCode === undefined) {
            return res.json({
                status: "E",
                message: "Verify code has expired"
            })
        } else {
            if(inputVerifyCode === trueVerifyCode) {
                return await createAccount(atob(req.cookies.email), atob(req.cookies.password), req, res)
            } else {
                res.json({
                    status: "E",
                    message: "Verify code is incorrect"
                })
            }
        }
    })
}