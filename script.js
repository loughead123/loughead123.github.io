let currentCity = "";
let currentWeather = {};
let forecastData = [];
let hourlyData = [];
let backgroundImages = [
    "url('9ff202b583e066e47c97cbb918efe1dd72233788.jpg')",
    "url('20051101.jpg')",
    "url('2006114.jpg')",
    "url('2009114.jpg')",
    "url('2010114.jpg')",
    "url('2011114.jpg')"
];
let currentBackgroundIndex = 0;

function changeBackground() {
    document.body.style.backgroundImage = backgroundImages[currentBackgroundIndex];
    currentBackgroundIndex = (currentBackgroundIndex + 1) % backgroundImages.length;
}

setInterval(changeBackground, 60000);

function getWeatherData(city) {
    const apiKey = "cc9db6a4457354e1cd3df3c561e6c0eb";
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&lang=zh_cn&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&lang=zh_cn&units=metric`;

    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            currentWeather = data;
            displayCurrentWeather(data);
        });

    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            forecastData = data.list.filter((_, index) => index % 8 === 0);
            hourlyData = data.list.slice(0, 24);
            displayForecast(forecastData);
            displayHourlyForecast(hourlyData);
        });
}

function displayCurrentWeather(data) {
    const cityName = document.getElementById("city-name");
    const weatherDescription = document.getElementById("weather-description");
    const weatherIcon = document.getElementById("weather-icon");
    const tempRange = document.getElementById("temp-range");
    const humidity = document.getElementById("humidity");
    const windSpeed = document.getElementById("wind-speed");

    cityName.textContent = data.name;
    weatherDescription.textContent = data.weather[0].description;
    weatherIcon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    tempRange.textContent = `${data.main.temp_min}°C - ${data.main.temp_max}°C`;
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = `${data.wind.speed} m/s`;
    
    const audioUrl = `https://api.lolimi.cn/API/yyhc/y.php?text=${encodeURIComponent(data.weather[0].description)}`;
    document.getElementById("weather-audio").src = audioUrl;
}

function displayForecast(data) {
    const forecastContainer = document.getElementById("forecast-container");
    forecastContainer.innerHTML = "";

    data.forEach(item => {
        const forecastItem = document.createElement("div");
        forecastItem.classList.add("forecast-item");
        forecastItem.innerHTML = `
            <h4>${new Date(item.dt_txt).toLocaleDateString()}</h4>
            <p>${item.weather[0].description}</p>
            <img src="http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="Weather Icon">
            <p>温度范围：${item.main.temp_min}°C - ${item.main.temp_max}°C</p>
            <p>湿度：${item.main.humidity}%</p>
            <p>风速：${item.wind.speed} m/s</p>
        `;
        forecastContainer.appendChild(forecastItem);
    });
}

function displayHourlyForecast(data) {
    const hourlyContainer = document.getElementById("hourly-container");
    hourlyContainer.innerHTML = "";

    data.forEach(item => {
        const hourlyItem = document.createElement("div");
        hourlyItem.classList.add("hourly-item");
        hourlyItem.innerHTML = `
            <p>${new Date(item.dt_txt).toLocaleTimeString()}</p>
            <p>${item.weather[0].description}</p>
            <img src="http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="Weather Icon">
            <p>温度：${item.main.temp}°C</p>
            <p>湿度：${item.main.humidity}%</p>
            <p>风速：${item.wind.speed} m/s</p>
        `;
        hourlyContainer.appendChild(hourlyItem);
    });
}

function searchCity() {
    const cityInput = document.getElementById("city-search").value;
    if (cityInput) {
        getWeatherData(cityInput);
    }
}

function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const apiKey = "cc9db6a4457354e1cd3df3c561e6c0eb";
            const reverseGeocodeUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&appid=${apiKey}&limit=1`;

            fetch(reverseGeocodeUrl)
                .then(response => response.json())
                .then(data => {
                    const city = data[0].name;
                    getWeatherData(city);
                });
        });
    }
}

setInterval(() => {
    if (currentCity) {
        getWeatherData(currentCity);
    }
}, 21600000);

getCurrentLocation();
