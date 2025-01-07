const express = require("express")
const { engine } = require("express-handlebars")
const morgan = require("morgan")
const cookieParser = require("cookie-parser")

const app = express()
const path = require("path")
const dotenv = require("dotenv")
const { authorizeLogin, authorize } = require("./routers/middleware/authorize")
const port = 5000

// Logger
app.use(morgan("combined"))

// Configuration
dotenv.config()
app.use(cookieParser())

// Handlebars
app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", path.join(__dirname, "views"))

// Static files
app.use(express.static(path.join(__dirname, "public")))
app.use(express.static(path.join(__dirname, "controllers")))
app.use(express.static(path.join(__dirname, "routes")))

app.use(express.json())

// Router -------------------------------------------------------------
// MainPage
app.get("/", (req, res) => {
    res.render("mainPage", {
        layout: "LR",
        logined: false
    })
})

app.get("/logined", authorizeLogin, (req, res) => {
    res.render("mainPage", {
        layout: "LR",
        logined: true
    })
})

app.post("/addURL", authorize, (req, res) => {
    res.json({
        status: "S",
        message: "Add URL successfully!"
    })
})

// LoginForm
require("./routers/login")(app)

app.get("/login", (req, res) => {
    res.render("login", {
        layout: "LR"
    })
})

// VerifyForm
app.get("/register/verify", (req, res) => {
    res.render("verifyCode", {
        layout: "LR",
    })
})

// Send Code
require("./routers/sendVerifyCode")(app)

// RegisterForm
require("./routers/registerAccount")(app)

app.get("/register", (req, res) => {
    res.render("register", {
        layout: "LR"
    })
})




app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
})