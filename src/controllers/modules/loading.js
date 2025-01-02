function showLoading() {
    let LRContainer = document.querySelector(".LRcontainer")
    let loadingContainer = document.createElement("div")
    loadingContainer.classList.add("loading")
    loadingContainer.innerHTML = `
        <div class="loader"></div>
    `

    LRContainer.appendChild(loadingContainer)
}

function hideLoading() {
    let loadingContainer = document.querySelector(".loading")
    if(loadingContainer) loadingContainer.remove()
}

export { showLoading, hideLoading }