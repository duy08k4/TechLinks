import { createAnnouceTag } from "./modules/announceTag.js"
import { hideLoading, showLoading } from "./modules/loading.js"

document.querySelectorAll(".loginForm--inputForm--inputBox--input").forEach((input) => {
    input.addEventListener("keydown", (e) => {
        if (e.keyCode === 13) {
            document.querySelector(".loginForm--btnBox--btnLogin").click()
        }
    })
})

document.querySelector(".loginForm--btnBox--btnLogin").addEventListener("click", () => {
    let inputGmail = document.querySelector(".loginForm--inputForm--inputBox--input__gmail").value
    let inputPassword = document.querySelector(".loginForm--inputForm--inputBox--input__password").value

    if(!inputGmail && !inputPassword) {
        createAnnouceTag("E", "Please complete the form!", 3)
        return
    }

    if(!inputGmail || !inputPassword) {
        createAnnouceTag("E", "Please complete the form!", 3)
        return
    }

    if(inputGmail.replaceAll(" ", "").length == 0 || inputPassword.replaceAll(" ", "").length == 0) {
        createAnnouceTag("W", "Please enter valid information!", 3)
        return
    }

    showLoading()
    fetch("/login/handleLogin", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
            inputGmail: btoa(inputGmail), 
            inputPassword: btoa(inputPassword) 
        })
    })
    .then(res => res.json())
    .then(data => {
        hideLoading()
        if(data.status == "S") {
            localStorage.setItem("l_Title", data.l_Title)
            localStorage.setItem("l_URL", data.l_URL)
            localStorage.setItem("l_Description", data.l_Description)
            localStorage.setItem("limitAmountLink", data.limitAmountLink)
            window.location.href = "/"
        } else {
            createAnnouceTag(data.status, data.message, 3)
        }

    })
    .catch(err => {
        console.log(err)
        hideLoading()
    })
})