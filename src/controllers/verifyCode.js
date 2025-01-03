import { showLoading, hideLoading } from "./modules/loading.js";
import { createAnnouceTag } from "./modules/announceTag.js";
import { createConfirmForm } from "./modules/confirmForm.js";

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
        console.log(error)
    })
})