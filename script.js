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
  forecastData.list.forEach(entry => {
    const forecastItem = document.createElement("div");
    forecastItem.innerHTML = `
      <p>${entry.dt_txt}</p>
      <p>温度: ${entry.main.temp}°C</p>
      <p>湿度: ${entry.main.humidity}%</p>
      <p>天气状况: ${entry.weather[0].description}</p>
      <img src="http://openweathermap.org/img/wn/${entry.weather[0].icon}@2x.png" alt="Weather Icon">
    `;
    forecast.appendChild(forecastItem);
  });
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
    getForecast(city).then(displayForecast);
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
        getForecast(currentCity).then(displayForecast);
      });
  });
} else {
  document.getElementById("location").innerText = "无法获取位置信息";
}

setInterval(() => {
  getWeather(currentCity).then(displayWeather);
  getForecast(currentCity).then(displayForecast);
}, 21600000);
