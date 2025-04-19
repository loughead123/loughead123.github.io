const apiKey = "cc9db6a4457354e1cd3df3c561e6c0eb"; 
const backgroundImages = [
    { time: "06:00", image: "url(images/9ff202b583e066e47c97cbb918efe1dd72233788.jpg)" },
    { time: "12:00", image: "url(images/20051101.jpg)" },
    { time: "18:00", image: "url(images/2009114.jpg)" },
    { time: "22:00", image: "url(images/2006114.jpg)" }
];

function changeBackground() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

    for (let i = 0; i < backgroundImages.length; i++) {
        if (currentTime >= backgroundImages[i].time) {
            document.body.style.backgroundImage = backgroundImages[i].image;
            return;
        }
    }
    
document.body.style.backgroundImage = backgroundImages[0].image; 
}   

function getWeather() {
    const city = document.getElementById('city').value;
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod === "200") {
                const today = data.list[0];
                const forecast = data.list.filter(item => item.dt_txt.includes("15:00:00")).slice(0, 3);

                const weatherInfo = `
                    <h2>Temperature: ${today.main.temp}°C</h2>
                    <h2>Humidity: ${today.main.humidity}%</h2>
                    <h2>Wind: ${today.wind.speed} m/s</h2>
                    <h2>Weather: ${today.weather[0].description}</h2>
                `;
                document.getElementById('weather-info').innerHTML = weatherInfo;

                const forecastInfo = forecast.map(day => `
                    <div>
                        <h3>${new Date(day.dt_txt).toLocaleDateString()}</h3>
                        <p>Temperature: ${day.main.temp_min}°C - ${day.main.temp_max}°C</p>
                        <p>Humidity: ${day.main.humidity}%</p>
                        <p>Wind: ${day.wind.speed} m/s</p>
                        <p>Weather: ${day.weather[0].description}</p>
                    </div>
                `).join('');
                document.getElementById('forecast-info').innerHTML = forecastInfo;
            } else {
                document.getElementById('weather-info').innerHTML = `<h2>${data.message}</h2>`;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('weather-info').innerHTML = `<h2>Failed to fetch weather data.</h2>`;
        });
}

setInterval(changeBackground, 60000); 
changeBackground(); 
