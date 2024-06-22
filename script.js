const urlInput = document.getElementById("url-input");
const searchButton = document.getElementById("search-button");
const errorMessage = document.getElementById("error-message");

const apiBaseUrl = "https://ipwhois.app/json/";
const responseFields = "?objects=ip,success,message,country,city,latitude,longitude,isp,timezone_gmt";

function generateMap(latitude, longitude) {
    const mapContainer = L.DomUtil.get('map');
    if (mapContainer) mapContainer._leaflet_id = null;

    const map = L.map('map').setView([+latitude, +longitude], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([+latitude, +longitude], {
        icon: L.icon({ iconUrl: "./images/icon-location.svg" })
    }).addTo(map);
}

function updateInfoDisplay({ ip, city, country, timezone_gmt, isp }) {
    document.getElementById("ip-address").textContent = ip;
    document.getElementById("city").textContent = `${city}, ${country}`;
    document.getElementById("timezone").textContent = timezone_gmt;
    document.getElementById("isp").textContent = isp;
}

function getIPGeolocationData(query) {
    fetch(query)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if (!data.success) {
                showError(data.message);
                return;
            }
            errorMessage.style.display = "none";
            generateMap(data.latitude, data.longitude);
            updateInfoDisplay(data);
        })
        .catch(error => showError(error.message));
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
}

function sanitizeInput(inputValue) {
    return inputValue.trim().toLowerCase();
}

searchButton.addEventListener("click", e => {
    e.preventDefault();
    getIPGeolocationData(apiBaseUrl + sanitizeInput(urlInput.value) + responseFields);
});

document.addEventListener("DOMContentLoaded", () => {
    getIPGeolocationData(apiBaseUrl + responseFields);
});
