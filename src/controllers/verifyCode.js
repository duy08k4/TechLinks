import { showLoading, hideLoading } from "./modules/loading.js";
import { createAnnouceTag } from "./modules/announceTag.js";

// Countdown time
function CountdownForReSend (callback) {
    let resendBtn = document.querySelector(".verifyCodeForm--verifyCodeInputBox--resendBtn")
    resendBtn.classList.toggle("disabled")
    resendBtn.disabled = true
    resendBtn.innerHTML = "Resend (40s)" 
    let countDownTime = 0
    let startCountDown = setInterval(() => {
        ++countDownTime
        resendBtn.innerHTML = `Resend (${40 - countDownTime}s)`
        callback([countDownTime, startCountDown])
    }, 1000)
}

function startCountDown () {
    CountdownForReSend(([countDownTime, startCountDown]) => {
        if(countDownTime === 40) {
            clearInterval(startCountDown)
            let resendBtn = document.querySelector(".verifyCodeForm--verifyCodeInputBox--resendBtn")
            resendBtn.classList.toggle("disabled")
            resendBtn.innerHTML = "Resend"
            resendBtn.disabled = false
        }
    })
}

document.addEventListener("DOMContentLoaded", () => {
    startCountDown()
})

document.querySelector(".verifyCodeForm--verifyCodeInputBox--resendBtn").addEventListener("click", () => {
    fetch("/register/sendVerifyCode", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ typeRequest: "resend" })
    })
    .then(res => res.json())
    .then(data => {
        createAnnouceTag("S", "Verify code has been sent", 3)
        startCountDown()
    })
})

document.querySelector(".verifyCodeForm--verifyCodeBox--input").addEventListener("keydown", (e) => {
    if(e.key === "Enter") {
        document.querySelector(".verifyCodeForm--btnBox--verifyBtn").click()
    }
})

document.querySelector(".verifyCodeForm--btnBox--verifyBtn").addEventListener("click", () => {
    let inputCode = document.querySelector(".verifyCodeForm--verifyCodeBox--input").value
    if(!inputCode) {
        createAnnouceTag("W", "Vui lòng nhập mã xác nhận", 5)
        return
    }

    showLoading()

    fetch("/register/createAccount", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ inputCode })
    })
    .then(res => res.json())
    .then(async (data) => {
        hideLoading()
        document.querySelector(".verifyCodeForm--verifyCodeBox--input").value = ""

        if(data.status === "S") {
            document.querySelector(".verifyCodeForm--verifyCodeBox--input").value = ""
            createAnnouceTag(data.status, data.message, 3)

            setTimeout(() => {
                window.location.href = "/login"
            }, 3000)

        } else {
            createAnnouceTag(data.status, data.message, 5)
        }
    })
    .catch(error => {
        hideLoading()
        document.querySelector(".verifyCodeForm--verifyCodeBox--input").value = ""
        console.log(error)
    })
})