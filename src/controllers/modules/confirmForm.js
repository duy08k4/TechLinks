function removeConfirmForm() {
    document.querySelector(".confirmForm").remove()
}

async function createConfirmForm (title) {
    return new Promise((resolve) => {
        let confirmForm = document.createElement("div")
        confirmForm.classList.add("confirmForm")
        confirmForm.innerHTML = `
            <div class="confirmForm--confirmBox">
                <div class="confirmForm--confirmBox--titleBox">
                    <h1 class="confirmForm--confirmBox--titleBox--title noSelect">${title}</h1>
                </div>
    
                <div class="confirmForm--confirmBox--btnBox">
                    <button class="confirmForm--confirmBox--btnBox--btn confirmForm--confirmBox--btnBox--declineBtn"><i class="fas fa-times"></i> No</button>
                    <button class="confirmForm--confirmBox--btnBox--btn confirmForm--confirmBox--btnBox--acceptBtn"><i class="fas fa-check"></i> Yes</button>
                </div>
            </div>
        `

        document.querySelector(".LRcontainer").appendChild(confirmForm)

        document.querySelector(".confirmForm--confirmBox--btnBox--declineBtn").addEventListener("click", () => {
            resolve(false)
            removeConfirmForm()
        })

        document.querySelector(".confirmForm--confirmBox--btnBox--acceptBtn").addEventListener("click", () => {
            resolve(true)
            removeConfirmForm()
        })
    })

}

export { createConfirmForm }