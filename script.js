const apiKey = "f0a571456821bee3613e12795a5833c6"; // <-- apna API key lagao

// Weather icons mapping
function getWeatherIcon(condition) {
  const icons = {
    Clear: "☀️",
    Clouds: "☁️",
    Rain: "🌧️",
    Drizzle: "🌦️",
    Thunderstorm: "⛈️",
    Snow: "❄️",
    Mist: "🌫️"
  };
  return icons[condition] || "🌡️";
}

// Header background image set karne ka function
function setHeaderBackground(condition) {
  const header = document.getElementById("weather-header");

  const backgrounds = {
    Clear: "url('img2/Sunny.jpeg')",
    Clouds: "url('img2/Cloudy.jpeg')",
    Rain: "url('img2/rain.jpeg')",
    Drizzle: "url('img2/Drizzle.jpeg')",
    Thunderstorm: "url('img2/Scattered thunderstorms.jpeg')",
    Snow: "url('img2/Snow.jpeg')",
    Mist: "url('img2/fog.jpeg')"
  };

  // Agar condition match nahi kare to default image set hoga
  const defaultBackground = "url('img2/default.jpeg')";

  header.style.backgroundImage = backgrounds[condition] || "url('img2/default.jpeg')";
  header.style.backgroundSize = "cover";
  header.style.backgroundPosition = "center";
}

// Get weather data
async function getWeather() {
  const city = document.getElementById("city").value.trim();
  if (!city) {
    alert("Please enter a city name");
    return;
  }

  try {
    // Current weather
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const currentRes = await fetch(currentUrl);
    const currentData = await currentRes.json();

    if (currentData.cod !== 200) {
      alert("City not found!");
      return;
    }

    // Show current weather
    document.getElementById("current-weather").innerHTML = `
      <h2>${currentData.name}, ${currentData.sys.country}</h2>
      <p><strong>${Math.round(currentData.main.temp)}°C</strong></p>
      <p>${currentData.weather[0].main} ${getWeatherIcon(currentData.weather[0].main)}</p>
      <p>Humidity: ${currentData.main.humidity}%</p>
      <p>Wind: ${currentData.wind.speed} m/s</p>
      <br>
      <a href="details.html?city=${currentData.name}" target="_blank">
        <button class="details-btn">View Full Details</button>
      </a>
    `;

    // Header background update
    setHeaderBackground(currentData.weather[0].main);

    // Forecast (5 days, 3-hour interval)
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    const forecastRes = await fetch(forecastUrl);
    const forecastData = await forecastRes.json();

    if (forecastData.cod !== "200") {
      alert("Forecast data not available!");
      return;
    }

    let dailyData = {};
    forecastData.list.forEach(item => {
      const date = new Date(item.dt * 1000).toDateString();
      if (!dailyData[date]) {
        dailyData[date] = item;
      }
    });

    let forecastHTML = "";
    Object.values(dailyData).forEach(day => {
      const date = new Date(day.dt * 1000);
      forecastHTML += `
        <a class="day-card" href="details.html?city=${city}&date=${day.dt}" target="_blank">
          <h4>${date.toDateString().split(" ")[0]}</h4>
          <div class="icon">${getWeatherIcon(day.weather[0].main)}</div>
          <p>${Math.round(day.main.temp)}°C</p>
          <p>${day.weather[0].main}</p>
        </a>
      `;
    });

    document.getElementById("forecast").innerHTML = forecastHTML;

  } catch (error) {
    console.error(error);
    alert("Error fetching weather data");
  }
}
