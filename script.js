const API_KEY = 'f1f7343f31dfca1c8cd45f5a73ecae7b';  // Make sure to insert your API key here
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const city = document.getElementById("city");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const icon = document.getElementById("icon");
const cityWeather = document.getElementById("cityWeather");
const noCityFound = document.getElementById("noCityFound");

searchButton.addEventListener("click", updateWeatherData);
searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        updateWeatherData();
    }
});

async function updateWeatherData() {
    try {
        if (!searchInput.value.trim()) {
            alert("Please enter the city");
            return;
        }

        const weatherData = await getWeatherData(searchInput.value);
        noCityFound.classList.add("hidden");
        cityWeather.classList.remove("hidden");

        city.textContent = weatherData.city;
        temperature.textContent = weatherData.temperature + "°C";
        humidity.textContent = weatherData.humidity + "%";
        wind.textContent = weatherData.wind + " km/h";
        icon.src = weatherData.icon;
    } catch (error) {
        if (error.code === "404") {
            cityWeather.classList.add("hidden");
            noCityFound.classList.remove("hidden");
            console.error(error.message);
        } else {
            alert("Unknown error: " + error);
        }
    }
}

function getIconUrl(icon) {
    return `./images/icons/${icon.toLowerCase()}.png`;
}

async function getWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
    const apiResponse = await fetch(apiUrl);
    const apiResponseBody = await apiResponse.json();

    if (apiResponseBody.cod === "404") {
        throw { code: "404", message: "City not found" };
    }

    return {
        city: apiResponseBody.name,
        temperature: Math.round(apiResponseBody.main.temp),
        humidity: apiResponseBody.main.humidity,
        wind: Math.round(apiResponseBody.wind.speed),
        icon: getIconUrl(apiResponseBody.weather[0].main),
    };
}
