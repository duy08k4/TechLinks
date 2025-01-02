let announceTagStatus = {
    S: {
        title: "Thành công",
        color: "lime",
        icon: "fas fa-check"
    },
    E: {
        title: "Thất bại",
        color: "red",
        icon: "fas fa-times"
    },
    W: {
        title: "Cảnh báo",
        color: "orange",
        icon: "fas fa-exclamation"
    },
    I: {
        title: "Nhắc nhở",
        color: "blue",
        icon: "fas fa-info"
    }
}

function createAnnouceTag (status, content, time){
    let container = document.querySelector(".announceBox")
    let getStatus = announceTagStatus[status]
    let announceTag = document.createElement("div")
    announceTag.classList.add("announceTag")
    announceTag.setAttribute("style", `--t: ${time}s; border-left-color: ${getStatus.color};`)
    announceTag.innerHTML = `
        <i class="${getStatus.icon}" style="color: ${getStatus.color};"></i>
        <p class="announceTag--content">${content}</p>
    
    `

    container.appendChild(announceTag)

    setTimeout(() => {
        announceTag.remove()
    }, time * 1000); 
}

export {createAnnouceTag}