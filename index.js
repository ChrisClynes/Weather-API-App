const APP_LOCATION = document.getElementById("location");
const APP_DEGREES = document.getElementById("degrees");
const APP_DESCRIPTION = document.getElementById("description");

//-----------------STATE Variables------------------------------
let tempFlag = 'fahrenheit';

//---------------check for geo location-------------------------
function getGeoLocation() {
    if ("geolocation" in navigator){
       navigator.geolocation.getCurrentPosition(setCoords, showError);
       function setCoords(position){
           let lat = position.coords.lattitude;
           let long = position.coords.longitude;
           geoLocationWeather(lat, long);
       }
       function showError(error){
        document.getElementById("location").innerHTML=error.message;
        document.getElementById("description").innerHTML="Unable to obtain weather data";
    }
        
    }else {
        console.log("No location data available")
    }
}

function geoLocationWeather(lattitude, longitude) {
    let apiUrl =`https://api.openweathermap.org/data/2.5/weather?lat=${lattitude}&lon=${longitude}&appid=`
    if (lattitude == undefined || longitude == undefined){
        return;
    }else {
        fetchWeatherData(apiUrl)
    }     
}

//------------------fetch API data---------------
function fetchWeatherData(url) {
    const key = "948344ca1222b060d61dc459cc378305";
    fetch(url+key)
        .then((response) => response.json())
        .then((data) => displayWeatherData(data));
}
function citySearchWeather() {
    let searchInput = document.getElementById('search-input').value;
    let apiUrl =`https://api.openweathermap.org/data/2.5/weather?q=${searchInput}&appid=`
    fetchWeatherData(apiUrl);
}

//--------------DOM Manipulation--------------------------
function displayWeatherData(data){
    const city = data.name;
    const tempF = `${convertKelvinToFar(data.main.temp)}°F`;
    const tempC = `${convertKelvinToCel(data.main.temp)}°C`;
    const description = data.weather[0].description;

    APP_LOCATION.innerHTML=city;
    APP_DEGREES.innerHTML=tempC;
    APP_DESCRIPTION.innerHTML=description;
    console.log(data)
}


function convertKelvinToFar(kelvin) {
    let fahrenheit = String(Math.floor(eval(`(${kelvin}-273.15)*(9/5)+32`)));
    return fahrenheit;
}
function convertKelvinToCel(kelvin) {
    let celsius = String(Math.floor(eval(`(${kelvin}-273.15)`)));
    return celsius;
}

//----------Buttons and clickable elements------------------
function convertDegrees() {
    console.log("degrees");
}

function refreshWeather() {
    console.log("refresh")
}

document.getElementById("search-btn").addEventListener('click', citySearchWeather);
document.getElementById("refresh-btn").addEventListener('click', getGeoLocation);
document.getElementById("degrees").addEventListener('click', convertDegrees);