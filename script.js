const apiKey = 'cc9db6a4457354e1cd3df3c561e6c0eb';
cconst backgroundImages = [
    { time: "06:00", image: "url(images/9ff202b583e066e47c97cbb918efe1dd72233788.jpg)" },
    { time: "12:00", image: "url(images/20051101.jpg)" },
    { time: "18:00", image: "url(images/2006114.jpg)" },
    { time: "22:00", image: "url(images/2009114.jpg)" }
];

let currentBackgroundIndex = 0;

setInterval(() => {
  document.getElementById('background').style.backgroundImage = `url(${backgroundImages[currentImageIndex]})`;
  currentImageIndex = (currentImageIndex + 1) % backgroundImages.length;
}, 60000);

setInterval(fetchWeather, 6 * 60 * 60 * 1000);

navigator.geolocation.getCurrentPosition(position => {
  const { latitude, longitude } = position.coords;
  fetchWeather(latitude, longitude);
}, error => {
  console.error('定位失败', error);
  document.getElementById('city-name').innerText = '定位失败，请手动输入城市';
});

async function fetchWeather(lat, lon) {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&appid=${apiKey}&lang=zh_cn&units=metric`);
    const data = await response.json();
    displayWeather(data);
    speakWeather(data.current.weather[0].description);
  } catch (error) {
    console.error('获取天气失败', error);
  }
}

function displayWeather(data) {
  const { current, daily, hourly } = data;
  const cityName = document.getElementById('city-name');
  const tempValue = document.getElementById('temp-value');
  const humidityValue = document.getElementById('humidity-value');
  const windValue = document.getElementById('wind-value');
  const statusValue = document.getElementById('status-value');
  const weatherIcon = document.getElementById('weather-icon');
  const forecastContent = document.getElementById('forecast-content');
  const hourlyContent = document.getElementById('hourly-content');

  tempValue.innerText = current.temp;
  humidityValue.innerText = current.humidity;
  windValue.innerText = current.wind_speed;
  statusValue.innerText = current.weather[0].description;
  weatherIcon.src = `http://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`;

  forecastContent.innerHTML = '';
  daily.slice(1, 4).forEach(day => {
    const div = document.createElement('div');
    div.className = 'forecast-item';
    div.innerHTML = `
      <p>${new Date(day.dt * 1000).toLocaleDateString('zh-CN')}</p>
      <p>温度范围：${day.temp.min}℃ - ${day.temp.max}℃</p>
      <p>湿度：${day.humidity}%</p>
      <p>风速：${day.wind_speed} km/h</p>
      <p>天气状况：${day.weather[0].description}</p>
      <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="Weather icon">
    `;
    forecastContent.appendChild(div);
  });

  hourlyContent.innerHTML = '';
  hourly.slice(0, 24).forEach(hour => {
    const div = document.createElement('div');
    div.className = 'hourly-item';
    div.innerHTML = `
      <p>${new Date(hour.dt * 1000).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</p>
      <p>温度：${hour.temp}℃</p>
      <p>湿度：${hour.humidity}%</p>
      <p>风速：${hour.wind_speed} km/h</p>
      <p>天气状况：${hour.weather[0].description}</p>
      <img src="http://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png" alt="Weather icon">
    `;
    hourlyContent.appendChild(div);
  });
}

async function speakWeather(description) {
  try {
    const response = await fetch('https://api.lolimi.cn/API/yyhc/y.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: description })
    });
    const audioUrl = await response.json();
    const audio = new Audio(audioUrl.data.url);
    audio.play();
  } catch (error) {
    console.error('语音播报失败', error);
  }
}

document.getElementById('search-button').addEventListener('click', () => {
  const cityName = document.getElementById('search-city').value;
  if (cityName) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&lang=zh_cn&units=metric`)
      .then(response => response.json())
      .then(data => {
        fetchWeather(data.coord.lat, data.coord.lon);
        document.getElementById('city-name').innerText = cityName;
      })
      .catch(error => {
        console.error('查询失败', error);
        alert('查询失败，请检查城市名称');
      });
  }
});
