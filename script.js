

const API_KEY = "c9d29758d6cf306b7ef7f375a3cc7c92";
const searchForm = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");
const locBtn = document.getElementById("locBtn");
const unitToggle = document.getElementById("unitToggle");

const statusEl = document.getElementById("status");
const card = document.getElementById("weatherCard");
const locationName = document.getElementById("locationName");
const weatherDesc = document.getElementById("weatherDesc");
const tempEl = document.getElementById("temp");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");
const feelsEl = document.getElementById("feels");
const iconWrap = document.getElementById("iconWrap");
const bgDecor = document.getElementById("backgroundDecor");

let units = "metric";

const showStatus = (msg, isError = false) => {
  statusEl.textContent = msg;
  statusEl.style.color = isError ? "var(--danger)" : "rgba(255,255,255,0.9)";
};

const showCard = () => {
  card.classList.remove("hidden");
  card.classList.add("fade-in-up");
};

const hideCard = () => {
  card.classList.add("hidden");
};

function setTheme(condition) {
  const c = condition.toLowerCase();
  if (c.includes("cloud")) {
    document.body.style.background = "linear-gradient(135deg, #6b7280 0%, #3b82f6 100%)";
    bgDecor.style.background = "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.04), transparent 20%)";
  } else if (c.includes("rain") || c.includes("drizzle") || c.includes("thunder")) {
    document.body.style.background = "linear-gradient(135deg, #2b5876 0%, #4e4376 100%)";
    bgDecor.style.background = "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.03), transparent 20%)";
  } else if (c.includes("snow")) {
    document.body.style.background = "linear-gradient(135deg, #b8c6db 0%, #f5f7fa 100%)";
    bgDecor.style.background = "radial-gradient(circle at 60% 60%, rgba(0,0,0,0.02), transparent 20%)";
  } else { 
    document.body.style.background = "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)";
    bgDecor.style.background = "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.06), transparent 20%)";
  }
}

function renderIcon(weather) {
  const main = weather.main.toLowerCase();
  let svg = "";
  if (main.includes("cloud")) {
    svg = `<svg class="cloud-float" width="92" height="92" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 17H7a4 4 0 01.7-7.92 5.5 5.5 0 0110.8 1.5A3.5 3.5 0 0120 17z" fill="rgba(255,255,255,0.95)"/>
    </svg>`;
  } else if (main.includes("rain") || main.includes("drizzle")) {
    svg = `<svg width="92" height="92" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 16a3 3 0 00-3-3H8.5A4.5 4.5 0 109 18h10z" fill="rgba(255,255,255,0.95)"/>
      <g fill="#bfe6ff"><path d="M9 20v2M14 20v3M6 21v2" stroke-width="1.4" stroke-linecap="round"/></g>
    </svg>`;
  } else if (main.includes("snow")) {
    svg = `<svg width="92" height="92" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3v4M12 17v4M4.2 6.2l2.8 2.8M17 14l2.8 2.8" stroke="rgba(255,255,255,0.95)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
  } else {
    svg = `<svg class="sun-rotate" width="92" height="92" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4" fill="#ffd166"/><g stroke="#ffd166" stroke-width="1.6"><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></g></svg>`;
  }
  iconWrap.innerHTML = svg;
}

function formatWind(speed) {
  if (units === "metric") return `${Math.round(speed)} m/s`;
  return `${Math.round(speed)} mph`;
}

function displayData(data) {
  const name = `${data.name}, ${data.sys?.country || ""}`;
  const desc = data.weather[0].description || "";
  const temp = Math.round(data.main.temp);
  const humidity = `${data.main.humidity}%`;
  const wind = formatWind(data.wind.speed);
  const feels = `${Math.round(data.main.feels_like)}°${units === "metric" ? "C" : "F"}`;

  locationName.textContent = name;
  weatherDesc.textContent = desc;
  tempEl.textContent = `${temp}°${units === "metric" ? "C" : "F"}`;
  humidityEl.textContent = humidity;
  windEl.textContent = wind;
  feelsEl.textContent = feels;

  renderIcon(data.weather[0]);
  setTheme(data.weather[0].main || desc);
  showCard();
  showStatus("Updated ✓");
}

function setLoading(on) {
  if (on) {
    showStatus("Loading…");
  } else {
    setTimeout(()=> showStatus(""), 1200);
  }
}

async function fetchWeatherByCity(city) {
  if (!city) return;
  setLoading(true);
  hideCard();
  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${units}`);
    const data = await res.json();
    if (!res.ok) {
      showStatus(data.message || "Location not found", true);
      setLoading(false);
      return;
    }
    displayData(data);
  } catch (err) {
    console.error(err);
    showStatus("Network error — check console", true);
  } finally { setLoading(false); }
}

async function fetchWeatherByCoords(lat, lon) {
  setLoading(true);
  hideCard();
  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}`);
    const data = await res.json();
    if (!res.ok) {
      showStatus(data.message || "Location error", true);
      setLoading(false);
      return;
    }
    displayData(data);
  } catch (err) {
    console.error(err);
    showStatus("Network error — check console", true);
  } finally { setLoading(false); }
}

searchForm.addEventListener("submit", e => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (!city) { showStatus("Please enter a city", true); return; }
  fetchWeatherByCity(city);
  cityInput.value = "";
});

locBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    showStatus("Geolocation not supported", true);
    return;
  }
  showStatus("Looking up location…");
  navigator.geolocation.getCurrentPosition(pos => {
    fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
  }, err => {
    showStatus("Location access denied", true);
    console.warn(err);
  }, { timeout: 10000 });
});

unitToggle.addEventListener("change", () => {
  units = unitToggle.checked ? "imperial" : "metric";
  showStatus(units === "metric" ? "Using °C" : "Using °F");
  const lastLocation = locationName.textContent;
  if (lastLocation && lastLocation !== "—") {
    const city = lastLocation.split(",")[0];
    fetchWeatherByCity(city);
  }
});

window.addEventListener("load", () => {
  showStatus("Ready — search a city or use location");
});

