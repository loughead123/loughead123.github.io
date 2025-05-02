let currentCity = '';
let weatherData = null;
let forecastData = null;
let hourlyForecastData = null;
let audioUrl = '';

const apiKey = 'cc9db6a4457354e1cd3df3c561e6c0eb';
const pearApiUrl = 'https://api.pearapi.com/tts?text=${weatherDescription}&voice=纳西妲&api_key=${459903f9c13f30df}';
const pearApiKey = '459903f9c13f30df';

async function fetchWeatherData(city) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&lang=zh_cn&units=metric`);
    return await response.json();
}

async function fetchForecastData(city) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&lang=zh_cn&units=metric`);
    return await response.json();
}

async function fetchHourlyForecastData(city) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&lang=zh_cn&units=metric`);
    return await response.json();
}

async function generateWeatherAudio() {
    const response = await fetch(`${pearApiUrl}/text_to_speech`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${pearApiKey}`
        },
        body: JSON.stringify({
            text: `今天的天气是${weatherData.weather[0].description}，温度范围是${weatherData.main.temp_min}到${weatherData.main.temp_max}摄氏度，湿度为${weatherData.main.humidity}%，风速为${weatherData.wind.speed}米每秒。`
        })
    });
    const data = await response.json();
    audioUrl = data.data.url;
}

async function updateWeatherInfo(city) {
    weatherData = await fetchWeatherData(city);
    forecastData = await fetchForecastData(city);
    hourlyForecastData = await fetchHourlyForecastData(city);

    document.getElementById('city-name').textContent = weatherData.name;
    document.getElementById('weather-description').textContent = weatherData.weather[0].description;
    document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
    document.getElementById('temp-range').textContent = `${weatherData.main.temp_min} - ${weatherData.main.temp_max}°C`;
    document.getElementById('humidity').textContent = `${weatherData.main.humidity}%`;
    document.getElementById('wind-speed').textContent = `${weatherData.wind.speed} m/s`;

    updateForecast();
    updateHourlyForecast();
    generateWeatherAudio();
}

function updateForecast() {
    const forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = '';
    forecastData.list.forEach((item, index) => {
        if (index % 8 === 0) {
            const date = new Date(item.dt_txt);
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
            const forecastItem = document.createElement('div');
            forecastItem.classList.add('forecast-item');
            forecastItem.innerHTML = `
                <h3>${day}/${month}/${year}</h3>
                <p>${item.weather[0].description}</p>
                <p>温度范围：${item.main.temp_min} - ${item.main.temp_max}°C</p>
                <p>湿度：${item.main.humidity}%</p>
                <p>风速：${item.wind.speed} m/s</p>
            `;
            forecastContainer.appendChild(forecastItem);
        }
    });
}

function updateHourlyForecast() {
    const hourlyContainer = document.getElementById('hourly-forecast');
    hourlyContainer.innerHTML = '';
    hourlyForecastData.list.forEach(item => {
        const date = new Date(item.dt_txt);
        const hour = date.getHours();
        const hourlyItem = document.createElement('div');
        hourlyItem.classList.add('hourly-item');
        hourlyItem.innerHTML = `
            <p>${hour}:00</p>
            <p>${item.weather[0].description}</p>
            <p>温度：${item.main.temp}°C</p>
            <p>湿度：${item.main.humidity}%</p>
            <p>风速：${item.wind.speed} m/s</p>
        `;
        hourlyContainer.appendChild(hourlyItem);
    });
}

function playWeatherAudio() {
    if (audioUrl) {
        const audio = new Audio(audioUrl);
        audio.play();
    }
}

function searchWeather() {
    const city = document.getElementById('city-search').value;
    updateWeatherInfo(city);
}

navigator.geolocation.getCurrentPosition(position => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&lang=zh_cn&units=metric`)
        .then(response => response.json())
        .then(data => {
            currentCity = data.name;
            updateWeatherInfo(currentCity);
        });
});

setInterval(() => {
    updateWeatherInfo(currentCity);
}, 21600000);

let backgroundImages = [
    'url("20051101.jpg")',
    'url("2006114.jpg")',
    'url("2009114.jpg")'
];
let currentBackgroundIndex = 0;

setInterval(() => {
    document.body.style.backgroundImage = backgroundImages[currentBackgroundIndex];
    currentBackgroundIndex = (currentBackgroundIndex + 1) % backgroundImages.length;
}, 60000);
