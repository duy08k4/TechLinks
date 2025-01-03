import { createAnnouceTag } from "./modules/announceTag.js"
import { showLoading, hideLoading } from "./modules/loading.js"

document.querySelector(".registerForm--requireForInput--btn").addEventListener("click", () => {
    document.querySelector(".registerForm--tutorialsBox").classList.toggle("open")
})

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".registerForm--inputForm--inputBox--input").forEach(val => {
        val.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                document.querySelector(".registerForm--btnBox--btnRegister").click()
            }
        })
    })

})

document.querySelector(".registerForm--btnBox--btnRegister").addEventListener("click", async (e) => {
    let gmail = document.querySelector(".registerForm--inputForm--inputBox--input__gmail").value
    let password = document.querySelector(".registerForm--inputForm--inputBox--input__password").value
    let confirmPassword = document.querySelector(".registerForm--inputForm--inputBox--input__confirmPassword").value

    if (!gmail && !password && !confirmPassword) {
        createAnnouceTag("E", "Please complete the form!", 3)
        return
    }

    if (!gmail || !password || !confirmPassword) {
        createAnnouceTag("E", "Please complete the form!", 3)
        return
    }

    if (gmail.replaceAll(" ", "").length == 0
        || password.replaceAll(" ", "").length == 0
        || confirmPassword.replaceAll(" ", "").length == 0) {
        createAnnouceTag("W", "Please enter valid information!", 3)
        return
    }

    if (password.length >= 8 && password.length <= 20) {
        if (password != password.toUpperCase() || password != password.toLowerCase()) {
            const regex = /\d/
            if (!regex.test(password)) {
                createAnnouceTag("W", "Password must contain at least one number!", 3)
                return
            }
        } else {
            createAnnouceTag("W", "Password must contain both uppercase and lowercase letters!", 3)
            return
        }
    } else {
        createAnnouceTag("W", "Password must be between 8 and 20 characters!", 3)
        return
    }

    if (password !== confirmPassword) {
        createAnnouceTag("E", "Passwords do not match!", 3)
        return
    }

    let data = {
        email: gmail,
        password: password
    }

    showLoading()
    fetch("/register/sendVerifyCode", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(data => {
            hideLoading()
            if (data.status === "S") {
                document.querySelector(".registerForm--inputForm--inputBox--input__gmail").value = ""
                document.querySelector(".registerForm--inputForm--inputBox--input__password").value = ""
                document.querySelector(".registerForm--inputForm--inputBox--input__confirmPassword").value = ""
                
                createAnnouceTag(data.status, data.message, 3)

                setTimeout(() => {
                    window.location.href = "/register/verify"
                }, 3000)

            } else {
                createAnnouceTag(data.status, data.message, 5)
            }
        })
})