import { createAnnouceTag } from "./modules/announceTag.js"
import { hideLoading, showLoading } from "./modules/loading.js"

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
    .then(data => {
        hideLoading()
        if(data.status == "S") {
            createAnnouceTag(data.status, data.message, 3)
        } else {
            if(data.redirect) {
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