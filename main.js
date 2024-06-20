const apiKey = "37c90e976b872a70b6bda8468ece6d2f";
const sideBar = document.getElementById("mySidenav");
const searchButton = document.getElementById("searchButton");
const locationText = document.getElementById("location");
const timeText = document.getElementById("time");
const temperatureText = document.getElementById("temperature");
const weatherType = document.getElementById("description");

searchButton.addEventListener("click", () => {
  var locationInput = document.getElementById("locationInput").value;
  document.getElementById('searchError').style.opacity = 0;
  if (locationInput){
    fetchLocation(locationInput);
    openNav();
  }else{
    document.getElementById('searchError').style.opacity = 1;
  }
});


function fetchLocation(location) {
  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=5&appid=${apiKey}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      for (const x of data) {
        createSelectWeather(x);
      }
    })
    .catch((error) => {
      console.error("geo location error:", error);
    });
}
function createSelectWeather(data) {
  if (data.state) {
    var cityName = `${data.name}, ${data.state}, ${data.country}`;
  } else {
    var cityName = `${data.name}, ${data.country}`; // some cities dont have states/provinces
  }
  const cityTitle = document.createElement("h2");
  const citylocation = document.createElement("h4");
  cityTitle.textContent = `${cityName}`;
  citylocation.textContent = `lat:${data.lat}, long:${data.lon}`;

  const cityContainer = document.createElement("div");
  cityContainer.className = "locationSelect";
  cityContainer.appendChild(cityTitle);
  cityContainer.appendChild(citylocation);
  sideBar.appendChild(cityContainer);
  cityContainer.addEventListener("click", () => {
    fetchWeather(cityName, data.lat, data.lon);
    closeNav();
  });
}
function fetchWeather(name, lat, lon) {
  // console.log(lat, lon);
  // Metric: celsius, imperial: farenheit
  url2 = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  fetch(url2)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      locationText.textContent = name;
      // Converts time to the selected city's timezone
      d = new Date();
      localTime = d.getTime();
      localOffset = d.getTimezoneOffset() * 60000;
      utc = localTime + localOffset;
      date = new Date(utc + 1000 * data.timezone);
      timeText.textContent = date.toLocaleString();

      let weatherText = `Temperature: ${Math.round(
        data.main.temp
      )}°C \r\nFeels like ${data.main.feels_like}°C`;
      weatherText += `\r\nHumidity: ${data.main.humidity}%`;
      weatherText += `\r\nWind Speed: ${data.main.humidity} m/s`;
      temperatureText.textContent = weatherText;
      weatherType.textContent = data.weather[0].description.toUpperCase();
      openWeather();
    })
    .catch((error) => {
      console.error("weather current time error:", error);
    });
}

function openNav() {
  sideBar.style.width = "100%";
}

function closeNav() {
  sideBar.style.width = "0%";
  const closebtn = document.getElementById("closeSideBar");
  const sideBarHeading = document.querySelector(".sideBarHeading");
  sideBar.textContent = "";
  sideBar.appendChild(closebtn);
  sideBar.appendChild(sideBarHeading);
}

function openWeather() {
  document.getElementById("weatherOutput").style.width = "100%";
}

function exitWeather() {
  document.getElementById("weatherOutput").style.width = "0";
}
