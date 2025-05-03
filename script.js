let backgroundImageIndex = 0;
const backgroundImageUrls = [
  "images/20051101.jpg",
  "images/2006114.jpg",
  "images/2009114.jpg",
];

function changeBackground() {
  document.body.style.backgroundImage = `url('${backgroundImageUrls[backgroundImageIndex]}')`;
  backgroundImageIndex = (backgroundImageIndex + 1) % backgroundImageUrls.length;
}

setInterval(changeBackground, 60000);

const apiKey = "cc9db6a4457354e1cd3df3c561e6c0eb";
const pearApiUrl = "https://api.pearapi.com/tts?text=${weatherDescription}&voice=纳西妲&api_key=${459903f9c13f30df}";
let currentCity = "Beijing";

function getWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&lang=zh_cn&units=metric`;
  return fetch(url).then(response => response.json());
}

function getForecast(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&lang=zh_cn&units=metric`;
  return fetch(url).then(response => response.json());
}

function displayWeather(data) {
  const weatherInfo = document.getElementById("weather-info");
  weatherInfo.innerHTML = `
    <p>温度: ${data.main.temp}°C</p>
    <p>湿度: ${data.main.humidity}%</p>
    <p>风速: ${data.wind.speed} m/s</p>
    <p>天气状况: ${data.weather[0].description}</p>
    <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Weather Icon">
  `;
}

function displayForecast(forecastData) {
  const forecast = document.getElementById("forecast");
  forecast.innerHTML = "";
  const today = new Date();
  const maxDate = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
  const filteredData = forecastData.list.filter(item => {
    const date = new Date(item.dt_txt);
    return date >= today && date <= maxDate;
  });
  
  const uniqueDates = new Set(filteredData.map(item => new Date(item.dt_txt).toDateString()));
  
  uniqueDates.forEach(date => {
    const dailyForecast = filteredData.filter(item => new Date(item.dt_txt).toDateString() === date);
    const dailyItem = document.createElement("div");
    dailyItem.innerHTML = `
      <h3>${date}</h3>
      <p>温度范围: ${Math.min(...dailyForecast.map(f => f.main.temp_min))}°C - ${Math.max(...dailyForecast.map(f => f.main.temp_max))}°C</p>
      <p>湿度: ${dailyForecast[0].main.humidity}%</p>
      <p>风速: ${dailyForecast[0].wind.speed} m/s</p>
      <p>天气状况: ${dailyForecast[0].weather[0].description}</p>
      <img src="http://openweathermap.org/img/wn/${dailyForecast[0].weather[0].icon}@2x.png" alt="Weather Icon">
    `;
    forecast.appendChild(dailyItem);
  });
}

function displayHourlyForecast(forecastData) {
  const hourlyForecast = document.getElementById("hourly-forecast");
  hourlyForecast.innerHTML = "";
  const hourlyItems = forecastData.list.filter((_, index) => index % 3 === 0 && index < 12);
  const hourlyContainer = document.createElement("div");
  hourlyContainer.style.display = "flex";
  hourlyContainer.style.flexWrap = "wrap";
  hourlyItems.forEach(item => {
    const hourlyItem = document.createElement("div");
    hourlyItem.style.margin = "10px";
    hourlyItem.innerHTML = `
      <p>${new Date(item.dt_txt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
      <p>温度: ${item.main.temp}°C</p>
      <p>天气状况: ${item.weather[0].description}</p>
      <img src="http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="Weather Icon">
    `;
    hourlyContainer.appendChild(hourlyItem);
  });
  hourlyForecast.appendChild(hourlyContainer);
}

function playWeather() {
  const weatherInfo = document.getElementById("weather-info").innerText;
  fetch(pearApiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      text: weatherInfo,
      voice: "纳西妲"
    })
  }).then(response => response.json()).then(data => {
    const audio = new Audio(data.url);
    audio.play();
  });
}

document.getElementById("play-weather").addEventListener("click", playWeather);

document.getElementById("search-btn").addEventListener("click", () => {
  const city = document.getElementById("city-search").value;
  if (city) {
    currentCity = city;
    getWeather(city).then(displayWeather);
    getForecast(city).then(data => {
      displayForecast(data);
      displayHourlyForecast(data);
    });
  }
});

if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(position => {
    const { latitude, longitude } = position.coords;
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&lang=zh_cn&units=metric`)
      .then(response => response.json())
      .then(data => {
        currentCity = data.name;
        document.getElementById("location").innerText = `当前城市: ${currentCity}`;
        displayWeather(data);
        getForecast(currentCity).then(data => {
          displayForecast(data);
          displayHourlyForecast(data);
        });
      });
  });
} else {
  document.getElementById("location").innerText = "无法获取位置信息";
}

setInterval(() => {
  getWeather(currentCity).then(displayWeather);
  getForecast(currentCity).then(data => {
    displayForecast(data);
    displayHourlyForecast(data);
  });
}, 21600000);
