
module.exports = function (app) {
    app.post("/login/handleLogin", (req, res) => {
        let inputGmail = atob(req.body.inputGmail)
        let inputPassword = atob(req.body.inputPassword)
        
        res.json({})

    })
}