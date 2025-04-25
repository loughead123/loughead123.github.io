const apiKey = "d0f0a13a20ba47a1bbde5f534dd2868b";

const backgroundImages = [
    { time: "06:00", image: "url(images/9ff202b583e066e47c97cbb918efe1dd72233788.jpg)" },
    { time: "12:00", image: "url(images/20051101.jpg)" },
    { time: "18:00", image: "url(images/2006114.jpg)" },
    { time: "22:00", image: "url(images/2009114.jpg)" }
];

let currentBackgroundIndex = 0;

setInterval(() => {
    currentBackgroundIndex = (currentBackgroundIndex + 1) % backgroundImages.length;
    document.body.style.backgroundImage = backgroundImages[currentBackgroundIndex].image;
}, 60000);

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const apiUrl = `https://geoapi.qweather.com/v2/city/lookup?location=${lat},${lon}&key=${d0f0a13a20ba47a1bbde5f534dd2868b}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const cityId = data.location[0].id;
            fetchWeatherData(cityId);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            document.getElementById('weather-info').innerHTML = `<h2>Failed to fetch weather data.</h2>`;
        });
}

function searchCity() {
    const city = document.getElementById('city-search').value;
    const apiUrl = `https://geoapi.qweather.com/v2/city/lookup?location=${city}&key=${d0f0a13a20ba47a1bbde5f534dd2868b}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const cityId = data.location[0].id;
            fetchWeatherData(cityId);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            document.getElementById('weather-info').innerHTML = `<h2>Failed to fetch weather data.</h2>`;
        });
}

function fetchWeatherData(cityId) {
    const nowApiUrl = `https://devapi.qweather.com/v7/weather/now?location=${cityId}&key=${d0f0a13a20ba47a1bbde5f534dd2868b}`;
    const forecastApiUrl = `https://devapi.qweather.com/v7/weather/3d?location=${cityId}&key=${d0f0a13a20ba47a1bbde5f534dd2868b}`;
    const hourlyApiUrl = `https://devapi.qweather.com/v7/weather/24h?location=${cityId}&key=${d0f0a13a20ba47a1bbde5f534dd2868b}`;

    fetch(nowApiUrl)
        .then(response => response.json())
        .then(data => {
            updateWeatherInfo(data);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            document.getElementById('weather-info').innerHTML = `<h2>Failed to fetch weather data.</h2>`;
        });

    fetch(forecastApiUrl)
        .then(response => response.json())
        .then(data => {
            updateForecastInfo(data);
        })
        .catch(error => {
            console.error('Error fetching forecast data:', error);
            document.getElementById('forecast-info').innerHTML = `<h2>Failed to fetch forecast data.</h2>`;
        });

    fetch(hourlyApiUrl)
        .then(response => response.json())
        .then(data => {
            updateHourlyForecastInfo(data);
        })
        .catch(error => {
            console.error('Error fetching hourly forecast data:', error);
            document.getElementById('hourly-forecast-info').innerHTML = `<h2>Failed to fetch hourly forecast data.</h2>`;
        });
}

function updateWeatherInfo(data) {
    const current = data.now;
    const weatherInfo = `
        <h2>当前天气</h2>
        <p>温度: ${current.temp}°C</p>
        <p>湿度: ${current.humidity}%</p>
        <p>风向: ${current.windDir}</p>
        <p>天气状况: ${current.text}</p>
        <img src="https://api.qweather.com/v7/weather/icon/${current.icon}.png" alt="Weather icon">
    `;
    document.getElementById('weather-info').innerHTML = weatherInfo;
    
    const weatherDescription = current.text;
    fetch(`https://api.lolimi.cn/API/yyhc/y.php?text=${encodeURIComponent(weatherDescription)}`)
        .then(response => response.json())
        .then(data => {
            const audioUrl = data.url;
            const audio = new Audio(audioUrl);
            audio.play();
        })
        .catch(error => {
            console.error('Error fetching voice data:', error);
        });
}

function updateForecastInfo(data) {
    const daily = data.daily.slice(0, 3);
    const forecastInfo = daily.map(day => `
        <div>
            <h3>${new Date(day.fxDate).toLocaleDateString('zh-CN')}</h3>
            <p>温度范围: ${day.tempMin}°C - ${day.tempMax}°C</p>
            <p>湿度: ${day.humidity}%</p>
            <p>风向: ${day.windDir}</p>
            <p>天气状况: ${day.textDay}</p>
            <img src="https://api.qweather.com/v7/weather/icon/${day.iconDay}.png" alt="Weather icon">
        </div>
    `).join('');
    document.getElementById('forecast-info').innerHTML = forecastInfo;
}

function updateHourlyForecastInfo(data) {
    const hourly = data.hourly.slice(0, 24);
    const hourlyForecastInfo = hourly.map(hour => `
        <div>
            <p>${new Date(hour.fxTime).toLocaleTimeString('zh-CN')}</p>
            <p>温度: ${hour.temp}°C</p>
            <p>湿度: ${hour.humidity}%</p>
            <p>风向: ${hour.windDir}</p>
            <p>天气状况: ${hour.text}</p>
            <img src="https://api.qweather.com/v7/weather/icon/${hour.icon}.png" alt="Weather icon">
        </div>
    `).join('');
    document.getElementById('hourly-forecast-info').innerHTML = hourlyForecastInfo;
}

setInterval(() => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
}, 7200000);
