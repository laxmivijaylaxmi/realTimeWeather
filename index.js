

let cityInput = document.getElementById("city_input");
let searchBtn = document.getElementById("searchBtn");
let locationBtn = document.getElementById("locationBtn");

let api_key = "70b7fa52905065c6545e7dac76b88bb7";

let currentWeatherCard = document.querySelector(".weather-left .card"),
  fiveDaysForecastCard = document.querySelector(".day-forecast"),
  aqiCard = document.querySelector(".hightlights .card"),
  sunriseCard = document.querySelectorAll(".hightlights .card")[1],
  humidityVal = document.getElementById("humidityVal"),
  pressureVal = document.getElementById("pressureVal"),
  VisibilityVal = document.getElementById("VisibilityVal"),
  windSpeedVal = document.getElementById("windSpeedVal"),
  feelsVal = document.getElementById("feelsVal"),
  hourlyForecastCard = document.querySelector(".hourly-forecast");

let aqiList = ["Good", "Fair", "Very Poor", "Moderate", "Poor"];

// Function to get weather details
function getWeatherDetails(name, lat, lon, country, state) {
  let FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`;
  let WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`;
  let AIR_POLLUTION_API_URL = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${api_key}`;

  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  let months = ["Jan", "Feb", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // Fetch Air Pollution Data
  fetch(AIR_POLLUTION_API_URL)
    .then(res => res.json())
    .then(data => {
      let { co, no, no2, o3, so2, pm2_5, pm10, nh3 } = data.list[0].components;

      aqiCard.innerHTML = `
        <div class="card-head">
          <p>Air Quality Index</p>
          <p class="air-index aqi-${data.list[0].main.aqi}">${aqiList[data.list[0].main.aqi - 1]}</p>
        </div>
        <div class="air-indices">
          <i class="fa-solid fa-wind fa-3x"></i>
          <div class="item"><p>PM2.5</p><h2>${pm2_5}</h2></div>
          <div class="item"><p>PM10</p><h2>${pm10}</h2></div>
          <div class="item"><p>SO2</p><h2>${so2}</h2></div>
          <div class="item"><p>CO</p><h2>${co}</h2></div>
          <div class="item"><p>NO</p><h2>${no}</h2></div>
          <div class="item"><p>NO2</p><h2>${no2}</h2></div>
          <div class="item"><p>NH3</p><h2>${nh3}</h2></div>
          <div class="item"><p>O3</p><h2>${o3}</h2></div>
        </div>`;
    })
    .catch(() => alert("Failed to fetch Air Pollution data"));

  // Fetch Current Weather Data
  fetch(WEATHER_API_URL)
    .then(res => res.json())
    .then(data => {
      let date = new Date();
      currentWeatherCard.innerHTML = `
        <div class="current-weather">
          <div class="details">
            <p>Now</p>
            <h2>${(data.main.temp - 273.15).toFixed(2)}&deg;C</h2>
            <p>${data.weather[0].description}</p>
          </div>
          <div class="weather-icon">
            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="weather-icon">
          </div>
        </div>
        <hr>
        <div class="card-footer">
          <p><i class="fa-solid fa-calendar"></i> ${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}</p>
          <p><i class="fa-solid fa-location-dot"></i> ${name}, ${country}</p>
        </div>`;

        let { sunrise, sunset, timezone } = data.sys;
        let { visibility } = data;  
        let { humidity, pressure, feels_like } = data.main;
        let { speed } = data.wind;
        

      let sRiseTime = moment.utc(sunrise, "X").add(timezone, "seconds").format("hh:mm A");
      let sSetTime = moment.utc(sunset, "X").add(timezone, "seconds").format("hh:mm A");

      sunriseCard.innerHTML = `
        <div class="card-head"><p>Sunrise & Sunset</p></div>
        <div class="sunrise-sunset">
          <div class="item">
            <div class="icon"><i class="fa-solid fa-sun fa-2x"></i></div>
            <div><p>Sunrise</p><h2>${sRiseTime}</h2></div>
          </div>
          <div class="item">
            <div class="icon"><i class="fa-solid fa-cloud-sun fa-2x"></i></div>
            <div><p>Sunset</p><h2>${sSetTime}</h2></div>
          </div>
        </div>`;

      humidityVal.innerHTML = `${humidity}%`;
      pressureVal.innerHTML = `${pressure} hPa`;
      VisibilityVal.innerHTML = visibility !== undefined ? `${(visibility / 1000).toFixed(1)} km` : "N/A";

      windSpeedVal.innerHTML = `${speed} m/s`;
      feelsVal.innerHTML = `${(feels_like - 273.15).toFixed(2)}&deg;C`;
    })
    .catch(() => alert("Failed to fetch current weather data"));

  // Fetch Forecast Data
  fetch(FORECAST_API_URL)
    .then(res => res.json())
    .then(data => {
      let hourlyForecast = data.list.slice(0, 8);
      hourlyForecastCard.innerHTML = "";

      hourlyForecast.forEach(hour => {
        let hrForecastDate = new Date(hour.dt_txt);
        let hr = hrForecastDate.getHours();
        let a = hr >= 12 ? "PM" : "AM";
        if (hr == 0) hr = 12;
        if (hr > 12) hr -= 12;

        hourlyForecastCard.innerHTML += `
          <div class="card">
            <p>${hr} ${a}</p>
            <img src="https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png" alt="weather-icon">
            <p>${(hour.main.temp - 273.15).toFixed(2)}&deg;C</p>
          </div>`;
      });

      let uniqueForeCastDays = [];
      let fiveDaysForecast = data.list.filter(forecast => {
        let forecastDate = new Date(forecast.dt_txt).getDate();
        if (!uniqueForeCastDays.includes(forecastDate)) {
          return uniqueForeCastDays.push(forecastDate);
        }
      });

      fiveDaysForecastCard.innerHTML = "";
      fiveDaysForecast.forEach(day => {
        let date = new Date(day.dt_txt);
        fiveDaysForecastCard.innerHTML += `
          <div class="forecast-item">
            <div class="icon-wrapper">
              <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather-icon">
              <span>${(day.main.temp - 273.15).toFixed(2)}&deg;C</span>
            </div>
            <p>${date.getDate()} ${months[date.getMonth()]}</p>
            <p>${days[date.getDay()]}</p>
          </div>`;
      });
    })
    .catch(() => alert("Failed to fetch forecast weather"));
}

// Function to get city coordinates using Geocoding API
function getCityCoordinates() {
  let cityName = cityInput.value.trim();
  cityInput.value = "";
  if (!cityName) return;

  let GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${api_key}`;

  fetch(GEOCODING_API_URL)
    .then((res) => res.json())
    .then((data) => {
      let { name, lat, lon, country, state } = data[0];
      getWeatherDetails(name, lat, lon, country, state);
    })
    .catch(() => {
      alert(`Failed to fetch API for city: ${cityName}`);
    });
}

// Event listener for search button
if (searchBtn) {
  searchBtn.addEventListener("click", getCityCoordinates);
} else {
  console.error("Element with ID 'searchBtn' not found.");
}

