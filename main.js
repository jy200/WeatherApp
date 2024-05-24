const apiKey = 'INSERT API';
const sideBar = document.getElementById('mySidenav');
const closebtn = document.getElementById('closeSideBar');
const locationInput = document.getElementById('locationInput');
const searchButton = document.getElementById('searchButton');
const locationText = document.getElementById('location');
const timeText = document.getElementById('time');
const temperatureText = document.getElementById('temperature');
const weatherType = document.getElementById('description');



searchButton.addEventListener('click', () => {
    const location = locationInput.value;
    if (location) {
        fetchLocation(location);
    }
});

function fetchLocation(location) {
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=5&appid=${apiKey}`
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // console.log(data)
            for (const x of data){
                createSelectWeather(x);
            }
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}
function createSelectWeather(data){
    const para = document.createElement("p");
    if (data.state){
        var cityName = `${data.name}, ${data.state}, ${data.country}`
    }else{
        var cityName = `${data.name}, ${data.country}`  // some cities dont have states/provinces
    }
    para.textContent = `${cityName}     |     lat:${data.lat}, long:${data.lon}`;
    para.className  = "locationSelect";
    sideBar.appendChild(para);
    
    para.addEventListener('click', () => {
        fetchWeather(cityName, data.lat, data.lon);
        closeNav();
    });
}
function fetchWeather(name, lat, lon){
    // console.log(lat, lon);
    // Metric: celsius, imperial: farenheit
    url2 = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
    fetch(url2)
        .then(response => response.json())
        .then(data => {
            locationText.textContent = name;
            // Converts time to the selected city's timezone
            d = new Date()
            localTime = d.getTime()
            localOffset = d.getTimezoneOffset() * 60000
            utc = localTime + localOffset
            date = new Date(utc + (1000 * data.timezone))
            timeText.textContent = date.toLocaleString();

            let weatherText = `Temperature: ${Math.round(data.main.temp)}°C \r\nFeels like ${data.main.feels_like}°C`
            weatherText += `\r\nHumidity: ${data.main.humidity}%`
            weatherText += `\r\nWind Speed: ${data.main.humidity} m/s`
            temperatureText.textContent = weatherText;
            weatherType.textContent = data.weather[0].description.toUpperCase();
            openWeather();
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}

function openNav() {
    document.getElementById("mySidenav").style.width = "100%";
}
  
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    // Clear sidebar elements except close and title
    while (sideBar.childNodes.length > 2) {
        sideBar.removeChild(sideBar.lastChild);
    }
}

function openWeather() {
    document.getElementById("weatherOutput").style.width = "100%";
}
  
function exitWeather() {
    document.getElementById("weatherOutput").style.width = "0";
}