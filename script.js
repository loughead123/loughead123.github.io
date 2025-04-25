const apiKey = 'cc9db6a4457354e1cd3df3c561e6c0eb';
const weatherApiUrl = 'https://api.openweathermap.org/data/2.5/';
const voiceApiUrl = 'https://api.lolimi.cn/API/yyhc/y.php';

const backgroundImages = [
    'url(images/9ff202b583e066e47c97cbb918efe1dd72233788.jpg)',
    'url(images/20051101.jpg)',
    'url(images/2006114.jpg)',
];

let currentBackgroundIndex = 0;

function changeBackground() {
    const background = document.querySelector('.background');
    background.style.backgroundImage = backgroundImages[currentBackgroundIndex];
    currentBackgroundIndex = (currentBackgroundIndex + 1) % backgroundImages.length;
}

setInterval(changeBackground, 60000);

function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            fetchWeatherData(latitude, longitude);
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}

function fetchWeatherData(lat, lon) {
    const currentWeatherUrl = `${weatherApiUrl}weather?lat=${lat}&lon=${lon}&appid=${apiKey}&lang=zh_cn&units=metric`;
    const forecastUrl = `${weatherApiUrl}forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&lang=zh_cn&units=metric`;

    Promise.all([fetch(currentWeatherUrl), fetch(forecastUrl)])
        .then(responses => Promise.all(responses.map(res => res.json())))
        .then(([currentWeather, forecast]) => {
            displayCurrentWeather(currentWeather);
            displayThreeDayForecast(forecast);
            displayHourlyForecast(forecast);
        })
        .catch(error => console.error('Error fetching weather data:', error));
}

function displayCurrentWeather(data) {
    const currentWeatherInfo = document.getElementById('current-weather-info');
    currentWeatherInfo.innerHTML = `
        <h2>${data.name}</h2>
        <p>温度: ${data.main.temp}°C</p>
        <p>湿度: ${data.main.humidity}%</p>
        <p>风速: ${data.wind.speed} m/s</p>
        <p>天气状况: ${data.weather[0].description}</p>
    `;
    playVoice(data.weather[0].description);
}

function displayThreeDayForecast(data) {
    const threeDayForecast = document.getElementById('three-day-forecast');
    threeDayForecast.innerHTML = '';
    const uniqueDates = new Set(data.list.map(item => new Date(item.dt_txt).toDateString()));

    uniqueDates.forEach(date => {
        const dailyData = data.list.filter(item => new Date(item.dt_txt).toDateString() === date);
        const minTemp = Math.min(...dailyData.map(item => item.main.temp_min));
        const maxTemp = Math.max(...dailyData.map(item => item.main.temp_max));
        const weatherIcon = dailyData[0].weather[0].icon;

        threeDayForecast.innerHTML += `
            <div class="forecast-day">
                <h3>${date}</h3>
                <img src="http://openweathermap.org/img/wn/${weatherIcon}@2x.png" alt="Weather Icon">
                <p>温度范围: ${minTemp}°C - ${maxTemp}°C</p>
                <p>湿度: ${dailyData[0].main.humidity}%</p>
                <p>风速: ${dailyData[0].wind.speed} m/s</p>
                <p>天气状况: ${dailyData[0].weather[0].description}</p>
            </div>
        `;
    });
}

function displayHourlyForecast(data) {
    const hourlyForecast = document.getElementById('hourly-forecast');
    hourlyForecast.innerHTML = '';
    const hourlyData = data.list.filter(item => new Date(item.dt_txt).getHours() % 3 === 0);

    hourlyData.forEach(item => {
        const time = new Date(item.dt_txt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const weatherIcon = item.weather[0].icon;

        hourlyForecast.innerHTML += `
            <div class="hourly-forecast-item">
                <p>${time}</p>
                <img src="http://openweathermap.org/img/wn/${weatherIcon}@2x.png" alt="Weather Icon">
                <p>温度: ${item.main.temp}°C</p>
            </div>
        `;
    });
}

function playVoice(description) {
    fetch(`${voiceApiUrl}?text=${encodeURIComponent(description)}`)
        .then(response => response.json())
        .then(data => {
            const audio = new Audio(data.url);
            audio.play();
        })
        .catch(error => console.error('Error fetching voice data:', error));
}

function searchWeather() {
    const city = document.getElementById('search-city').value;
    if (city) {
        const searchUrl = `${weatherApiUrl}weather?q=${city}&appid=${apiKey}&lang=zh_cn&units=metric`;
        fetch(searchUrl)
            .then(response => response.json())
            .then(data => {
                displayCurrentWeather(data);
            })
            .catch(error => alert('未找到该城市或网络错误'));
    }
}

getUserLocation();
setInterval(fetchWeatherData, 21600000);
