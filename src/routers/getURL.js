const { authorize } = require("./middleware/authorize")
const { db } = require("../../firebaseSDK")

module.exports = function(app) {
    app.get("/getURL", authorize, async (req, res) => {
        console.log(req.user)
        let gmail = req.user.inputGmail
        let userID = req.user.userID
        let getAllURL = await db.collection(btoa(process.env.KEY_URL)).doc(btoa(gmail)).get()

        if(getAllURL.exists) {
            res.json({
                status: "S",
                message: "Get URL successfully",
                data: getAllURL.data(),
                limitAmountLink: req.user.limitAmountLink
            })
        } else {
            res.json({
                status: "E",
                message: "You have not added any URL yet"
            })
        }
    })
}