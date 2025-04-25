const apiKey = 'cc9db6a4457354e1cd3df3c561e6c0eb';
const backgroundImages = [
    '9ff202b583e066e47c97cbb918efe1dd72233788.jpg', '20051101.jpg', '2006114.jpg', '2009114.jpg',
];
let currentBackgroundIndex = 0;

setInterval(() => {
    document.getElementById('background').style.backgroundImage = `url(${backgroundImages[currentBackgroundIndex]})`;
    currentBackgroundIndex = (currentBackgroundIndex + 1) % backgroundImages.length;
}, 60000);

async function getWeather(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&lang=zh_cn&units=metric`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('获取天气数据失败:', error);
    }
}

async function getForecast(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&lang=zh_cn&units=metric`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('获取预报数据失败:', error);
    }
}

function displayWeather(data) {
    document.getElementById('city-name').textContent = data.name;
    document.getElementById('temperature-range').textContent = `温度范围: ${data.main.temp_min}°C - ${data.main.temp_max}°C`;
    document.getElementById('humidity').textContent = `湿度: ${data.main.humidity}%`;
    document.getElementById('wind-speed').textContent = `风速: ${data.wind.speed} m/s`;
    document.getElementById('weather-status').textContent = data.weather[0].description;
    document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
}

function displayForecast(data) {
    const forecastContainer = document.getElementById('forecast-container');
    forecastContainer.innerHTML = '';
    data.list.forEach((item, index) => {
        if (index % 8 === 0) {
            const forecastItem = document.createElement('div');
            forecastItem.classList.add('forecast-item');
            forecastItem.innerHTML = `
                <p>${new Date(item.dt * 1000).toLocaleDateString()}</p>
                <p>温度范围: ${item.main.temp_min}°C - ${item.main.temp_max}°C</p>
                <p>湿度: ${item.main.humidity}%</p>
                <p>风速: ${item.wind.speed} m/s</p>
                <p>${item.weather[0].description}</p>
                <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="Weather icon">
            `;
            forecastContainer.appendChild(forecastItem);
        }
    });
}

function displayHourlyForecast(data) {
    const hourlyContainer = document.getElementById('hourly-container');
    hourlyContainer.innerHTML = '';
    data.list.forEach((item) => {
        const hourlyItem = document.createElement('div');
        hourlyItem.classList.add('hourly-item');
        hourlyItem.innerHTML = `
            <p>${new Date(item.dt * 1000).toLocaleTimeString()}</p>
            <p>温度: ${item.main.temp}°C</p>
            <p>湿度: ${item.main.humidity}%</p>
            <p>风速: ${item.wind.speed} m/s</p>
            <p>${item.weather[0].description}</p>
            <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="Weather icon">
        `;
        hourlyContainer.appendChild(hourlyItem);
    });
}

document.getElementById('search-button').addEventListener('click', async () => {
    const city = document.getElementById('search-city').value;
    if (city) {
        const weatherData = await getWeather(city);
        const forecastData = await getForecast(city);
        displayWeather(weatherData);
        displayForecast(forecastData);
        displayHourlyForecast(forecastData);
    }
});

setInterval(() => {
    const city = document.getElementById('city-name').textContent;
    if (city) {
        getWeather(city).then(displayWeather);
        getForecast(city).then(displayForecast);
    }
}, 21600000);

async function speakWeather(weatherStatus) {
    try {
        const response = await fetch('https://api.lolimi.cn/API/yyhc/y.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: weatherStatus })
        });
        const data = await response.json();
        const audio = new Audio(data.url);
        audio.play();
    } catch (error) {
        console.error('语音播报失败:', error);
    }
}

function displayWeather(data) {
    document.getElementById('city-name').textContent = data.name;
    document.getElementById('temperature-range').textContent = `温度范围: ${data.main.temp_min}°C - ${data.main.temp_max}°C`;
    document.getElementById('humidity').textContent = `湿度: ${data.main.humidity}%`;
    document.getElementById('wind-speed').textContent = `风速: ${data.wind.speed} m/s`;
    document.getElementById('weather-status').textContent = data.weather[0].description;
    document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    speakWeather(data.weather[0].description);
}
