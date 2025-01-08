import { createAnnouceTag } from "./modules/announceTag.js"
import { hideLoading, showLoading } from "./modules/loading.js"
import { createPopup } from "./modules/popup.js"
import { createConfirmForm } from "./modules/confirmForm.js"

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
    if(count == 0) resetCount()
})

document.querySelector(".mainPageContainer--servicesBox--URLForm--inputForm--inputBox--input__URL").addEventListener("input", (e) => {
    let count = e.target.value.length
    e.target.setAttribute("maxlength", parseInt(localStorage.getItem("l_URL")))
    document.querySelector(".mainPageContainer--servicesBox--URLForm--inputForm--inputBox--tag--characterCountURL").innerHTML = `${count}/${localStorage.getItem("l_URL")}`
    if(count == 0) resetCount()
})

document.querySelector(".mainPageContainer--servicesBox--URLForm--inputForm--inputBox--input__description").addEventListener("input", (e) => {
    let count = e.target.value.length
    e.target.setAttribute("maxlength", parseInt(localStorage.getItem("l_Description")))
    document.querySelector(".mainPageContainer--servicesBox--URLForm--inputForm--inputBox--tag--characterCountDescription").innerHTML = `${count}/${localStorage.getItem("l_Description")}`
    if(count == 0) resetCount()
})

function resetCount() {
    document.querySelectorAll(".mainPageContainer--servicesBox--URLForm--inputForm--inputBox--tag--characterCount").forEach(val => {
        val.innerHTML = ""
    })
}

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
            document.querySelector(".mainPageContainer--servicesBox--URLForm--inputForm--inputBox--input__title").value = ""
            document.querySelector(".mainPageContainer--servicesBox--URLForm--inputForm--inputBox--input__URL").value = ""
            document.querySelector(".mainPageContainer--servicesBox--URLForm--inputForm--inputBox--input__description").value = ""
            resetCount()

            createAnnouceTag(data.status, data.message, 3)
            await getURLData()
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


// Show all URL
function showAllURL(data) {
    let getData = data
    let getAllKey = Object.keys(data)
    let listURL = document.querySelector(".mainPageContainer--servicesBox--URLListBox--listURL")
    listURL.innerHTML = ""

    getAllKey.forEach(key => {
        let URLCard = document.createElement("div")
        URLCard.classList.add("mainPageContainer--servicesBox--URLListBox--listURL--card")
        URLCard.id = key
        URLCard.innerHTML = `
            <div class="mainPageContainer--servicesBox--URLListBox--listURL--card--titleBox noSelect">
                <p class="mainPageContainer--servicesBox--URLListBox--listURL--card--titleBox--title">${data[key].title}</p>
            </div>
    
            <div class="mainPageContainer--servicesBox--URLListBox--listURL--card--urlBox">
                <a href="${data[key].url}" target="_blank" rel="noopener noreferrer" class="mainPageContainer--servicesBox--URLListBox--listURL--card--urlBox--url">${data[key].url}</a>
            </div>
    
            <div class="mainPageContainer--servicesBox--URLListBox--listURL--card--actionBox">
                <button class="mainPageContainer--servicesBox--URLListBox--listURL--card--actionBox--action mainPageContainer--servicesBox--URLListBox--listURL--card--actionBox--actionRemove ${key}" name="${key}"><i class="far fa-trash-alt" name="${key}"></i></button>
            </div>
    
            <div class="mainPageContainer--servicesBox--URLListBox--listURL--card--descriptionBox">
                <p>${data[key].description || "No description"}</p>
            </div>
        `
        listURL.appendChild(URLCard)

        document.querySelector(`.${key}`).addEventListener('click', (event) => {
            removeURL(event.target.getAttribute('name'));
        })
    })
    countAmountCard()
}

function countAmountCard(key) {
    if(key) {
        document.querySelector(`#${key}`).remove()
    }

    let amountCard = document.querySelectorAll(".mainPageContainer--servicesBox--URLListBox--listURL--card").length
    document.querySelector(".mainPageContainer--servicesBox--URLListBox--titleBox__ammountURL").innerHTML = `${amountCard}/${localStorage.getItem("limitAmountLink")}`
}

async function removeURL(key) {
    let confirm = await createConfirmForm("Are you sure?")
    if(confirm) {
        showLoading()
        fetch("/removeURL", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ key })
        }).then(res => res.json())
        .then(data => {
            hideLoading()
            if(data.status == "S") {
                countAmountCard(key)
                createAnnouceTag(data.status, data.message, 3)
            } else {
                createAnnouceTag(data.status, data.message, 3)
            }
        })
        .catch(err => {
                console.log(err)
                hideLoading()
            })
    }
}

async function getURLData() {
    await fetch("/getURL")
    .then(res => res.json())
    .then(data => {
        if(!data.redirect) {
            if(data.status == "S") {
                showAllURL(data.data)
            }
        }
    }).catch(err => {
        console.log(err)
    })
}

document.addEventListener("DOMContentLoaded", getURLData)
