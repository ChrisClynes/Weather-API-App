const API_URL = "api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}";

function uesLocationWeather() {
    
    // get lat and long

}

function citySearchWeather() {
    console.log("button clicked");
}

function convertDegrees() {
    console.log("degrees");
}

function refreshWeather() {
    console.log("refresh")
}

document.getElementById("search-btn").addEventListener('click', citySearchWeather);
document.getElementById("refresh-btn").addEventListener('click', refreshWeather);
document.getElementById("degrees").addEventListener('click', convertDegrees);