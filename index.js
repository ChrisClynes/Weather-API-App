const APP_LOCATION = document.getElementById("location");
const APP_ICON = document.getElementById("weather-icon");
const APP_DEGREES = document.getElementById("degrees");
const APP_DESCRIPTION = document.getElementById("description");
const APP_FEELSLIKE = document.getElementById("feels-like");
const APP_HIGHTEMP = document.getElementById("high-temp");
const APP_LOWTEMP = document.getElementById("low-temp");
const APP_HUMIDITY = document.getElementById("humidity");
const APP_WINDSPEED = document.getElementById("windspeed");
const APP_WINDDIRECTION = document.getElementById("wind-direction");
const input = document.getElementById("search-input");
const detailedWeather = document.getElementById("detailed-weather");
const searchBtn = document.getElementById("search-btn");
const refreshBtn = document.getElementById("refresh-btn");
const degreeToggle = document.getElementById("degree-toggle");
const moreInfo = document.getElementById("more-info");
const fahrenheitCountry = ["us", "bs", "ky", "lr", "pw", "fm", "mh" ];//List of countries or territories that use fahrenheit

//-----------------State Variables------------------------------

let currentKelvin = null;
let feelsLikeKelvin = null;
let highKelvin = null;
let lowKelvin = null;
let currentLocation = null;

//---------------check for geo location-------------------------
function getGeoLocation() {
    if ("geolocation" in navigator){
       navigator.geolocation.getCurrentPosition(setCoords, showError); 
    }else {
        console.log("No location data available")
    }
}
function setCoords(position){
    let lat = position.coords.lattitude;
    let long = position.coords.longitude;
    console.log(position.coords.lattitude)
    geoLocationWeather(lat, long);
}
function showError(error){
    document.getElementById("location").innerHTML=error.message;
    document.getElementById("description").innerHTML="Unable to obtain weather data";
}

function geoLocationWeather(lattitude, longitude) {
    let apiUrl =`api.openweathermap.org/data/2.5/weather?lat=${lattitude}&lon=${longitude}&appid=`
    if (lattitude == undefined || longitude == undefined){
        APP_LOCATION.innerHTML="location data not available, please use search";
        return;//if location data cannot be pulled from browser, display message and return out of function
    }else {
        fetchWeatherData(apiUrl)
    }     
}
//--------------------On page load----------------------
window.onload = getGeoLocation();

//------------------fetch API data---------------
function fetchWeatherData(url) {
    const key = "948344ca1222b060d61dc459cc378305";
    fetch(url+key)
        .then((response) => response.json())
        .then((data) => cityErrorCheck(data));
}
function citySearchWeather() {
    let searchInput = document.getElementById('search-input').value;
    let apiUrl =`https://api.openweathermap.org/data/2.5/weather?q=${searchInput}&appid=`
    fetchWeatherData(apiUrl);
}
function cityErrorCheck(data){
    if (data.sys == undefined){
        APP_LOCATION.innerHTML="city or location not found";
        resetDisplay();
        return;
    }else {
        displayWeatherData(data);
    }
}
//--------------DOM Manipulation--------------------------
function displayWeatherData(data){
    const city = data.name;
    const country = data.sys.country.toLowerCase();
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    const windDirection = data.wind.deg;
    fahrenheit = convertKelvinToFar(data.main.temp);
    celsius = convertKelvinToCel(data.main.temp);
    
    //APP_LOCATION.style.backgroundColor="rgba(255, 255, 255, 0.644)";
    APP_LOCATION.innerHTML=city;
    APP_ICON.src=`https://openweathermap.org/img/wn/${icon}@2x.png`;
    APP_DESCRIPTION.innerHTML=description;
    APP_HUMIDITY.innerHTML=`Humidity: ${humidity}%`;
    APP_WINDDIRECTION.innerHTML=`Wind direction: ${windDirection}°`;
    APP_WINDSPEED.innerHTML=`Wind speed: ${windSpeed}m/s`;
    moreInfo.style.display="flex";

    currentKelvin = data.main.temp;//sets state value to use for converting back and forth fahrenheit and celsius without making another api call
    feelsLikeKelvin = data.main.feels_like;
    highKelvin = data.main.temp_max;
    lowKelvin = data.main.temp_min;
    currentLocation = city;//sets current weather location for refresh use.
    

    if (fahrenheitCountry.includes(country)){
        APP_DEGREES.innerHTML=fahrenheit;
        APP_FEELSLIKE.innerHTML=`Feels like: ${convertKelvinToFar(feelsLikeKelvin)}`
        APP_HIGHTEMP.innerHTML=`High temp: ${convertKelvinToFar(highKelvin)}`
        APP_LOWTEMP.innerHTML=`Low temp: ${convertKelvinToFar(lowKelvin)}`
    }else {
        APP_DEGREES.innerHTML=celsius;
        APP_FEELSLIKE.innerHTML=`Feels like: ${convertKelvinToCel(feelsLikeKelvin)}`
        APP_HIGHTEMP.innerHTML=`High temp: ${convertKelvinToCel(highKelvin)}`
        APP_LOWTEMP.innerHTML=`Low temp: ${convertKelvinToCel(lowKelvin)}`
    }
    
    console.log(data);
}

//------------------reset all displayed data----------------
function resetDisplay(){
    APP_ICON.src='';
    APP_DEGREES.innerHTML="-°F";
    APP_DESCRIPTION.innerHTML= null;
    APP_FEELSLIKE.innerHTML= null;
    APP_HIGHTEMP.innerHTML= null;
    APP_LOWTEMP.innerHTML= null;
    APP_HUMIDITY.innerHTML= null;
    APP_WINDDIRECTION.innerHTML= null;
    APP_WINDSPEED.innerHTML= null;
    moreInfo.style.display="none";
}

//-------------------temp conversions-----------------------
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
    if (APP_DEGREES.innerHTML == "-°F"){
        return;
    }else {
        if (regEx.test(temp)){
            APP_DEGREES.innerHTML=convertKelvinToCel(currentKelvin);
            APP_FEELSLIKE.innerHTML=`Feels like: ${convertKelvinToCel(feelsLikeKelvin)}`
            APP_HIGHTEMP.innerHTML=`High temp: ${convertKelvinToCel(highKelvin)}`
            APP_LOWTEMP.innerHTML=`Low temp: ${convertKelvinToCel(lowKelvin)}`
        }else {
           APP_DEGREES.innerHTML=convertKelvinToFar(currentKelvin);
           APP_FEELSLIKE.innerHTML=`Feels like: ${convertKelvinToFar(feelsLikeKelvin)}`
           APP_HIGHTEMP.innerHTML=`High temp: ${convertKelvinToFar(highKelvin)}`
           APP_LOWTEMP.innerHTML=`Low temp: ${convertKelvinToFar(lowKelvin)}`
        }
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

function moreInformation() {
    console.log("triggered")
    if (detailedWeather.style.display == "none" || detailedWeather.style.display == "") {
        detailedWeather.style.display="grid";
        moreInfo.innerHTML="less information"
    }else {
        detailedWeather.style.display="none";
        moreInfo.innerHTML="more information"
    }     
}

//--------------------Event Listeners----------------------

searchBtn.addEventListener('click', citySearchWeather);
moreInfo.addEventListener('click', moreInformation);
refreshBtn.addEventListener('click', refreshWeather);
degreeToggle.addEventListener('click', toggleDegrees);

//allow enter key to be used with searchbar
input.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();// Cancels browser default action for this event
      searchBtn.click();// Triggers click action on search button
    }
  });












  
  //add search api dropdown
  //fix geo location on load.