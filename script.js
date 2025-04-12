function getWeather() {
    const city = document.getElementById('city').value;
    const apiKey = 'cc9db6a4457354e1cd3df3c561e6c0eb';
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            document.getElementById('weather-info').innerHTML = `
                <h2>Temperature: ${data.main.temp}°C</h2>
                <h2>Humidity: ${data.main.humidity}%</h2>
                <h2>Wind Speed: ${data.wind.speed} km/h</h2>
            `;
        })
        .catch(error => console.error('Error:', error));
}
