import { createAnnouceTag } from "./modules/announceTag.js"
import { hideLoading, showLoading } from "./modules/loading.js"
import { createPopup } from "./modules/popup.js"

let getLogoutBtn = document.querySelector(".menu--btn")
if(getLogoutBtn) {
    getLogoutBtn.addEventListener("click", () => {
        fetch("/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(res => res.json())
        .then(data => {
            window.location.href = "/login"
        })
    })
}

document.querySelector(".mainPageContainer--servicesBox--URLForm--btnBox--addBtn").addEventListener("click", () => {
    showLoading()
    fetch("/addURL", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({})
    })
    .then(res => res.json())
    .then(async(data) => {
        hideLoading()
        if(data.status == "S") {
            createAnnouceTag(data.status, data.message, 3)
        } else {
            if(data.redirect) {
                await createPopup(data.message)
                window.location.href = data.redirect
            } else {
                createAnnouceTag(data.status, data.message, 3)
            }
        }
    })
    .catch(err => {
        hideLoading()
        console.log(err)
    })
})