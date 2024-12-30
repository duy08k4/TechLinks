const express = require("express")
const app = express()
const { engine } = require("express-handlebars")
const path = require("path")
const dotenv = require("dotenv")
const port = 5000

// Dotenv configuration
dotenv.config()

// Handlebars
app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", path.join(__dirname, "views"))

// Static files
app.use(express.static(path.join(__dirname, "public")))

// Router -------------------------------------------------------------
// LoginForm
app.get("/", (req, res) => {
    res.render("login", {
        layout: "LR"
    })
})

// RegisterForm
app.get("/register", (req, res) => {
    res.render("register", {
        layout: "LR"
    })
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
})