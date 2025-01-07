const { authorize } = require("./middleware/authorize")

module.exports = function (app) {
    app.post("/addURL", authorize, (req, res) => {
        let getTitle = req.body.title
        let getURL = req.body.url
        let getDescription = req.body.description
        console.log(getTitle, getURL, getDescription)
        
        res.json({
            status: "S",
            message: "Chưa có chức năng nha bồ. Thông kam :>"
        })
    })
}