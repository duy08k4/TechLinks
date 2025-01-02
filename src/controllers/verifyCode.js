import { showLoading, hideLoading } from "./modules/loading.js";
import { createAnnouceTag } from "./modules/announceTag.js";

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

    fetch("/register/createAccount", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ inputCode })
    })
    .then(res => res.json())
    .then(data => {
        if(data.status === "S") {
            window.location.href = "/login"
        } else {
            createAnnouceTag(data.status, data.message, 5)
        }
    })
    .catch(error => console.log(error))
})