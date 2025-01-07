const { base64URL } = require("../controllers/modules/base64URL")


module.exports = function (app) {
    app.post("/logout", (req, res) => {
        res.clearCookie(base64URL(process.env.CK_acToken))
        res.clearCookie(base64URL(process.env.CK_rfToken))
        res.json({
            status: "S",
            message: "Logout successfully!"
        })
    })
}