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
app.get("/", authorizeLogin, (req, res) => {
    if(req.user) {
        res.render("mainPage", {
            layout: "LR",
            logined: req.user.logined,
            user: req.user.inputGmail,
            limitAmountLink: req.user.limitAmountLink
        })
    } else {
        res.render("mainPage", {
            layout: "LR",
            logined: false
        })
    }
})

// Get all URL
require("./routers/getURL")(app)

// Remove URL
require("./routers/removeURL")(app)

// Add URL
require("./routers/addURL")(app)

// LoginForm
require("./routers/login")(app)

app.get("/login", authorizeLogin, (req, res) => {
    if(req.user) {
        res.redirect("/")
    } else {
        res.render("login", {
            layout: "LR"
        })
    }
})

// VerifyForm
app.get("/register/verify", authorizeLogin, (req, res) => {
    if(req.user) {
        res.redirect("/")
    } else {
        res.render("verifyCode", {
            layout: "LR",
        })
    }
})

// Send Code
require("./routers/sendVerifyCode")(app)

// RegisterForm
require("./routers/registerAccount")(app)

app.get("/register", authorizeLogin, (req, res) => {
    if(req.user) {
        res.redirect("/")
    } else {
        res.render("register", {
            layout: "LR"
        })
    }
})

// Logout
require("./routers/logout")(app)

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
})