const { authorize } = require("./middleware/authorize")
const { db, FieldValue } = require("../../firebaseSDK")

module.exports = function(app) {
    app.post("/removeURL", authorize, async (req, res) => {
        let key = req.body.key
        const docRef = db.collection(btoa(process.env.KEY_URL)).doc(btoa(req.user.inputGmail))
        await db.collection(btoa(process.env.KEY_URL)).doc(btoa(req.user.inputGmail)).update({
            [key]: FieldValue.delete()
        })
        .then(() => {
            if(!docRef.get().exists) {
                console.log(true)
            } else console.log(false)
            res.json({
                status: "S",
                message: "Successfully removed URL!"
            })
        })
        .catch(err => {
            console.log(err)
            res.json({
                status: "E",
                message: "Failed to remove URL!"
            })
        })
    })
}