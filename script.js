function getWeather() {
    const city = document.getElementById('city').value;
    const apiKey = 'd0f0a13a20ba47a1bbde5f534dd2868b'; 
    const apiUrl = `https://devapi.qweather.com/v7/weather/now?location=${city}&key=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.code === "200") {
                document.getElementById('weather-info').innerHTML = `
                    <h2>Temperature: ${data.now.temp}°C</h2>
                    <h2>Weather: ${data.now.text}</h2>
                    <h2>Humidity: ${data.now.humidity}%</h2>
                    <h2>Wind Speed: ${data.now.windSpeed} km/h</h2>
                `;
            } else {
                document.getElementById('weather-info').innerHTML = `<h2>${data.message}</h2>`;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('weather-info').innerHTML = `<h2>Failed to fetch weather data.</h2>`;
        });
}
