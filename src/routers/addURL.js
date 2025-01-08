const { authorize } = require("./middleware/authorize")
const {db} = require("../../firebaseSDK")
const { base64URL } = require("../controllers/modules/base64URL")

function createURLID(title) {
    let getDate = new Date()
    let URLID = getDate.getFullYear() + getDate.getMonth() + getDate.getDay() + getDate.getHours().toString() + getDate.getMinutes().toString() + getDate.getSeconds().toString() + title
    return base64URL(URLID)
}

module.exports = function (app) {
    app.post("/addURL", authorize, async (req, res) => {
        let getTitle = req.body.title
        let getURL = req.body.url
        let getDescription = req.body.description
        let getListURL = await db.collection(btoa(process.env.KEY_URL)).doc(btoa(req.user.inputGmail)).get()

        if(!getListURL.exists) {
            let createID = createURLID(getTitle)
            await db.collection(btoa(process.env.KEY_URL)).doc(btoa(req.user.inputGmail)).set({
                [createID]: {
                    title: getTitle,
                    url: getURL,
                    description: getDescription
                }
            }).then(() => {
                return res.json({
                    status: "S",
                    message: "Successfully added URL!"
                })
            })
        } else {
            let countURL = Array(getListURL.data()).length
            let limitAmountLink = req.cookies[base64URL(process.env.ammountLink)]
            
            if(countURL >= limitAmountLink) {
                return res.json({
                    status: "E",
                    message: "You have reached the limitation"
                })
            } else {
                let createID = createURLID(getTitle)
                await db.collection(btoa(process.env.KEY_URL)).doc(btoa(req.user.inputGmail)).update({
                    [createID]: {
                        title: getTitle,
                        url: getURL,
                        description: getDescription
                    }
                }).then(() => {
                    return res.json({
                        status: "S",
                        message: "Successfully added URL!"
                    })
                })
            }
        }
    })
}