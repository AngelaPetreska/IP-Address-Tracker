const urlInput = document.getElementById("url-input")
const searchButton = document.getElementById("search-button")
const errorMessage = document.getElementById("error-message")

const API_BASE_URL = "https://ipwhois.app/json/"
const responseFields = "?objects=ip,success,message,country,city,latitude,longitude,isp,timezone_gmt"

function generateMap(latitude, longitude) {
    latitude = +latitude
    longitude = +longitude

    // check if map exists
    const container = L.DomUtil.get('map')
    if (container !== null) {
        container._leaflet_id = null
    }

    // generate map
    const map = L.map('map').setView([latitude, longitude], 13)
    const marker = L.icon({ iconUrl: "./images/icon-location.svg" })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map)

    L.marker([latitude, longitude], { icon: marker }).addTo(map)
}

function updateInfoDisplay(ip, city, country, timezone, isp) {
    document.getElementById("ip-address").textContent = ip
    document.getElementById("city").textContent = city + ", " + country
    document.getElementById("timezone").textContent = timezone
    document.getElementById("isp").textContent = isp
}

function getIPGeolocationData(query) {
    fetch(query)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            if (!data.success) {
                errorMessage.textContent = data.message
                errorMessage.style.display = "block"
                return
            }
            errorMessage.style.display = "none"
            generateMap(data.latitude, data.longitude)
            updateInfoDisplay(data.ip, data.city, data.country, data.timezone_gmt, data.isp)
        })
        .catch(error => {
            console.log(error)
            errorMessage.textContent = error.message
            errorMessage.style.display = "block"
        })
}

function sanitizeInput(inputValue) {
    return inputValue.trim().toLowerCase()
}

searchButton.addEventListener("click", (e) => {
    e.preventDefault()

    getIPGeolocationData(API_BASE_URL + sanitizeInput(urlInput.value) + responseFields)
})

document.addEventListener("DOMContentLoaded", getIPGeolocationData(API_BASE_URL + responseFields))

