const apiKey = "cc9db6a4457354e1cd3df3c561e6c0eb"; 
const backgroundImages = [
    { time: "06:00", image: "url(images/9ff202b583e066e47c97cbb918efe1dd72233788.jpg)" },
    { time: "12:00", image: "url(images/20051101.jpg)" },
    { time: "18:00", image: "url(images/2006114.jpg)" },
    { time: "22:00", image: "url(images/2009114.jpg)" }
];

let currentBackgroundIndex = 0;

document.body.addEventListener('click', () => {
    currentBackgroundIndex = (currentBackgroundIndex + 1) % backgroundImages.length;
    document.body.style.backgroundImage = backgroundImages[currentBackgroundIndex].image;
});

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
    const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&units=metric&lang=zh_cn&appid=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const current = data.current;
            const daily = data.daily.slice(0, 3);
            const hourly = data.hourly.slice(0, 24);

            const weatherInfo = `
                <h2>当前天气</h2>
                <p>温度: ${current.temp}°C</p>
                <p>湿度: ${current.humidity}%</p>
                <p>风向: ${current.wind_deg}°</p>
                <p>天气状况: ${current.weather[0].description}</p>
                <img src="http://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png" alt="Weather icon">
            `;
            document.getElementById('weather-info').innerHTML = weatherInfo;

            const forecastInfo = daily.map(day => `
                <div>
                    <h3>${new Date(day.dt * 1000).toLocaleDateString('zh-CN')}</h3>
                    <p>温度范围: ${day.temp.min}°C - ${day.temp.max}°C</p>
                    <p>湿度: ${day.humidity}%</p>
                    <p>风向: ${day.wind_deg}°</p>
                    <p>天气状况: ${day.weather[0].description}</p>
                    <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="Weather icon">
                </div>
            `).join('');
            document.getElementById('forecast-info').innerHTML = forecastInfo;

            const hourlyForecastInfo = hourly.map(hour => `
                <div>
                    <p>${new Date(hour.dt * 1000).toLocaleTimeString('zh-CN')}</p>
                    <p>温度: ${hour.temp}°C</p>
                    <p>湿度: ${hour.humidity}%</p>
                    <p>风向: ${hour.wind_deg}°</p>
                    <p>天气状况: ${hour.weather[0].description}</p>
                    <img src="http://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png" alt="Weather icon">
                </div>
            `).join('');
            document.getElementById('hourly-forecast-info').innerHTML = hourlyForecastInfo;

            
            const weatherDescription = current.weather[0].description;
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
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            document.getElementById('weather-info').innerHTML = `<h2>Failed to fetch weather data.</h2>`;
        });
}

document.body.style.backgroundImage = backgroundImages[currentBackgroundIndex].image;

setInterval(() => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
}, 7200000); // 7200000 milliseconds = 2 hours
