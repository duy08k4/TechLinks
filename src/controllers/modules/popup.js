function createPopup (title){
    return new Promise((resolve) => {
        let popup = document.createElement("div")
        popup.classList.add("popup")
        popup.innerHTML = `
            <div class="popup--box">
                <h2 class="popup--title">${title}</h2>
                <button class="popup--btn">OK</button>
            </div>
        `
    
        document.querySelector(".LRcontainer").appendChild(popup)

        document.querySelector(".popup--btn").addEventListener("click", () => {
            resolve(true) //User recieved the popup
            popup.remove()
        })
    })
}

export {createPopup}