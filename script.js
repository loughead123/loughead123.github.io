const API_KEY = 'cc9db6a4457354e1cd3df3c561e6c0eb';
const PEARAPI_KEY = '459903f9c13f30df';
const CITY = 'beijing';

let currentCity = CITY;
let lastWeatherFetch = 0;
let backgroundIndex = 0;

const backgroundImages = [
    "url('images/20051101.jpg')",
    "url('images/2006114.jpg')",
    "url('images/2009114.jpg')",
    "url('images/2010114.jpg')",
];

function fetchWeather(city) {
  const now = Date.now();
  if (now - lastWeatherFetch < 6 * 60 * 60 * 1000) {
    console.log('天气数据未到刷新时间');
    return;
  }
  lastWeatherFetch = now;

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&lang=zh_cn&units=metric`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&lang=zh_cn&units=metric`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      document.getElementById('city-name').textContent = data.name;
      document.getElementById('weather-description').textContent = data.weather[0].description;
      document.getElementById('temperature').textContent = `温度: ${data.main.temp}°C`;
      document.getElementById('humidity').textContent = `湿度: ${data.main.humidity}%`;
      document.getElementById('wind-speed').textContent = `风速: ${data.wind.speed} m/s`;

      fetchWeatherForecast(forecastUrl);
    })
    .catch(error => console.error('获取天气数据失败:', error));
}

function fetchWeatherForecast(url) {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const forecastContainer = document.getElementById('forecast-container');
      forecastContainer.innerHTML = '';

      const hourlyForecastContainer = document.getElementById('hourly-forecast-container');
      hourlyForecastContainer.innerHTML = '';

      const days = ['今天', '明天', '后天'];
      const dailyForecast = data.list.filter((_, index) => index % 8 === 0);

      dailyForecast.forEach((forecast, index) => {
        const day = days[index];
        const weatherIcon = `<img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" alt="weather-icon">`;
        const forecastHTML = `
          <div class="forecast-day">
            <h3>${day}</h3>
            <p>${weatherIcon}</p>
            <p>温度范围: ${forecast.main.temp_min}°C - ${forecast.main.temp_max}°C</p>
            <p>湿度: ${forecast.main.humidity}%</p>
            <p>风速: ${forecast.wind.speed} m/s</p>
          </div>
        `;
        forecastContainer.innerHTML += forecastHTML;
      });

      data.list.forEach(forecast => {
        const time = new Date(forecast.dt_txt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const weatherIcon = `<img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" alt="weather-icon">`;
        const hourlyForecastHTML = `
          <div class="hourly-forecast-item">
            <p>${time}</p>
            <p>${weatherIcon}</p>
            <p>温度: ${forecast.main.temp}°C</p>
          </div>
        `;
        hourlyForecastContainer.innerHTML += hourlyForecastHTML;
      });
    })
    .catch(error => console.error('获取天气预报失败:', error));
}

function searchWeather() {
  const searchCity = document.getElementById('search-city').value;
  if (searchCity) {
    currentCity = searchCity;
    fetchWeather(currentCity);
  }
}

function changeBackground() {
  setInterval(() => {
    document.body.style.backgroundImage = `url('${backgrounds[backgroundIndex]}')`;
    backgroundIndex = (backgroundIndex + 1) % backgrounds.length;
  }, 60000);
}

function speakWeather() {
  const weatherDescription = document.getElementById('weather-description').textContent;
  const url = `https://api.pearapi.com/tts?text=${weatherDescription}&voice=纳西妲&api_key=${PEARAPI_KEY}`;

  fetch(url)
    .then(response => response.blob())
    .then(blob => {
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      audio.play();
    })
    .catch(error => console.error('语音播报失败:', error));
}

document.getElementById('speak-button').addEventListener('click', speakWeather);

document.addEventListener('DOMContentLoaded', () => {
  fetchWeather(currentCity);
  changeBackground();
  setInterval(fetchWeather, 6 * 60 * 60 * 1000, currentCity);
});
