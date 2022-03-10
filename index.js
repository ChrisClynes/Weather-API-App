const APP_LOCATION = document.getElementById("location");
const APP_ICON = document.getElementById("weather-icon");
const APP_DEGREES = document.getElementById("degrees");
const APP_DESCRIPTION = document.getElementById("description");
const input = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const refreshBtn = document.getElementById("refresh-btn");
const moreInfo = document.getElementById("more-info");
const fahrenheitCountry = ["us", "bs", "ky", "lr", "pw", "fm", "mh" ]//List of countries or territories that use fahrenheit

//-----------------State Variables------------------------------

let currentKelvin = null;
let currentLocation = null;

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
        APP_LOCATION.innerHTML="location data no available, use search";
        APP_LOCATION.style.backgroundColor="rgba(255, 255, 255, 0.644)";
        return;//if location data cannot be pulled from browser, display message and return out of function
    }else {
        fetchWeatherData(apiUrl)
    }     
}
//--------------------On page load----------------------
//window.onload = getGeoLocation();

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
    const country = data.sys.country.toLowerCase();
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;
    fahrenheit = convertKelvinToFar(data.main.temp);
    celsius = convertKelvinToCel(data.main.temp);
    
    //APP_LOCATION.style.backgroundColor="rgba(255, 255, 255, 0.644)";
    APP_LOCATION.innerHTML=city;
    APP_ICON.src=`https://openweathermap.org/img/wn/${icon}@2x.png`;
    APP_DESCRIPTION.innerHTML=description;
    moreInfo.style.display="flex";
    

    if (fahrenheitCountry.includes(country)){
        APP_DEGREES.innerHTML=fahrenheit;
    }else {
        APP_DEGREES.innerHTML=celsius;
    }
    currentKelvin = data.main.temp;
    currentLocation = city;//sets current weather location for refresh use.
    console.log(data);
}


function convertKelvinToFar(kelvin) {
    let fahrenheit = String(Math.floor(eval(`(${kelvin}-273.15)*(9/5)+32`)));
    return `${fahrenheit}°F`;
}
function convertKelvinToCel(kelvin) {
    let celsius = String(Math.floor(eval(`(${kelvin}-273.15)`)));
    return `${celsius}°C`;
}


//----------Buttons and clickable elements------------------
function toggleDegrees() {
    let temp = document.getElementById("degrees").innerHTML;
    let regEx = /°F/;
     if (regEx.test(temp)){
         APP_DEGREES.innerHTML=convertKelvinToCel(currentKelvin);
     }else {
        APP_DEGREES.innerHTML=convertKelvinToFar(currentKelvin);
     }
}

function refreshWeather() {
    let apiUrl =`https://api.openweathermap.org/data/2.5/weather?q=${currentLocation}&appid=`
    if (currentLocation == null || currentLocation == undefined){
        return
    }else {
        citySearchWeather(apiUrl);
    }
}

//--------------------Event Listeners----------------------

searchBtn.addEventListener('click', citySearchWeather);
refreshBtn.addEventListener('click', refreshWeather);
APP_DEGREES.addEventListener('click', toggleDegrees);

//allow enter key to be used with searchbar
input.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();// Cancels browser default action for this event
      searchBtn.click();// Triggers click action on search button
    }
  });













  //fix background loading
  //apply icons
  //add search api dropdown
  //error handle city not found search
  //fix geo location on load.