const apiKey = "f0a571456821bee3613e12795a5833c6";

// Weather icons
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

// Background image set karne ka function 
function setDetailsBackground(condition) {
  const container = document.querySelector(".container");

  const backgrounds = {
    Clear: "url('img2/Sunny.jpeg')",
    Clouds: "url('img2/Cloudy.jpeg')",
    Rain: "url('img2/rain.jpeg')",
    Drizzle: "url('img2/Drizzle.jpeg')",
    Thunderstorm: "url('img2/Scattered thunderstorms.jpeg')",
    Snow: "url('img2/Snow.jpeg')",
    Mist: "url('img2/fog.jpeg')"
  };

  // Default image agar condition match na kare
  const defaultBackground = "url('img2/default.jpeg')";

  container.style.backgroundImage = backgrounds[condition] || defaultBackground;
  container.style.backgroundSize = "cover";
  container.style.backgroundPosition = "center";
}



// URL params
const urlParams = new URLSearchParams(window.location.search);
const city = urlParams.get("city");
const targetDate = urlParams.get("date");

document.getElementById("place").textContent = city || "Unknown city";

// Load details
async function loadDetails() {
  try {
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    const res = await fetch(forecastUrl);
    const data = await res.json();

    if (data.cod !== "200") {
      document.getElementById("detailedWeather").textContent = "City not found!";
      return;
    }

    let selectedDate = targetDate
      ? new Date(parseInt(targetDate) * 1000)
      : new Date(data.list[0].dt * 1000);
    const selectedDateStr = selectedDate.toDateString();

    let dayData = data.list.find(item => {
      let d = new Date(item.dt * 1000);
      return d.toDateString() === selectedDateStr && d.getHours() === 12;
    });

    if (!dayData) {
      dayData = data.list.find(item => new Date(item.dt * 1000).toDateString() === selectedDateStr);
    }

    if (!dayData) {
      document.getElementById("detailedWeather").textContent = "No data for this date!";
      return;
    }

    document.getElementById("detailedWeather").innerHTML = `
      <h2>${selectedDate.toDateString()}</h2>
      <p>🌡 Temperature: ${Math.round(dayData.main.temp)}°C</p>
      <p>Feels like: ${Math.round(dayData.main.feels_like)}°C</p>
      <p>Humidity: ${dayData.main.humidity}%</p>
      <p>Pressure: ${dayData.main.pressure} hPa</p>
      <p>Wind: ${dayData.wind.speed} m/s</p>
      <p>Weather: ${dayData.weather[0].description}</p>
      <div class="icon">${getWeatherIcon(dayData.weather[0].main)}</div>
    `;

    const hourlyData = data.list.filter(item => new Date(item.dt * 1000).toDateString() === selectedDateStr);

    let hourlyHTML = "";
    hourlyData.forEach(hour => {
      const time = new Date(hour.dt * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      });
      hourlyHTML += `
        <div class="hour-card">
          <h4>${time}</h4>
          <div class="icon">${getWeatherIcon(hour.weather[0].main)}</div>
          <p>${Math.round(hour.main.temp)}°C</p>
          <p>${hour.weather[0].main}</p>
        </div>
      `;
    });

    setDetailsBackground(dayData.weather[0].main);


    document.getElementById("hourlyForecast").innerHTML = hourlyHTML;

  } catch (err) {
    console.error(err);
    document.getElementById("detailedWeather").textContent = "Error loading data!";
  }
}

loadDetails();

// Back button with fallback
function goBack() {
  /*if (document.referrer) {
    history.back();
  } else {
    window.location.href = "index.html";
  }*/
  window.close();
}
