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

document.querySelector(".mainPageContainer--servicesBox--URLForm--inputForm--inputBox--input__title").addEventListener("input", (e) => {
    let count = e.target.value.length
    e.target.setAttribute("maxlength", parseInt(localStorage.getItem("l_Title")))
    document.querySelector(".mainPageContainer--servicesBox--URLForm--inputForm--inputBox--tag--characterCountTitle").innerHTML = `${count}/${localStorage.getItem("l_Title")}`
})

document.querySelector(".mainPageContainer--servicesBox--URLForm--inputForm--inputBox--input__URL").addEventListener("input", (e) => {
    let count = e.target.value.length
    e.target.setAttribute("maxlength", parseInt(localStorage.getItem("l_URL")))
    document.querySelector(".mainPageContainer--servicesBox--URLForm--inputForm--inputBox--tag--characterCountURL").innerHTML = `${count}/${localStorage.getItem("l_URL")}`
})

document.querySelector(".mainPageContainer--servicesBox--URLForm--inputForm--inputBox--input__description").addEventListener("input", (e) => {
    let count = e.target.value.length
    e.target.setAttribute("maxlength", parseInt(localStorage.getItem("l_Description")))
    document.querySelector(".mainPageContainer--servicesBox--URLForm--inputForm--inputBox--tag--characterCountDescription").innerHTML = `${count}/${localStorage.getItem("l_Description")}`
})

document.querySelectorAll(".mainPageContainer--servicesBox--URLForm--inputForm--inputBox--input").forEach(input => {
    input.addEventListener("keydown", (e) => {
        if(e.key == "Enter") {
            document.querySelector(".mainPageContainer--servicesBox--URLForm--btnBox--addBtn").click()
        }
    })
})

document.querySelector(".mainPageContainer--servicesBox--URLForm--btnBox--addBtn").addEventListener("click", () => {
    let getTitle = document.querySelector(".mainPageContainer--servicesBox--URLForm--inputForm--inputBox--input__title").value
    let getURL = document.querySelector(".mainPageContainer--servicesBox--URLForm--inputForm--inputBox--input__URL").value
    let getDescription = document.querySelector(".mainPageContainer--servicesBox--URLForm--inputForm--inputBox--input__description").value

    if(getTitle == "" || getURL == "") {
        createAnnouceTag("E", "Please fill in all fields.", 3)
        return
    }

    let timeOutForShowLoading = setTimeout(() => {
        showLoading()
    }, 1000)

    fetch("/addURL", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: getTitle,
            url: getURL,
            description: getDescription
        })
    })
    .then(res => res.json())
    .then(async (data) => {
        clearTimeout(timeOutForShowLoading)
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