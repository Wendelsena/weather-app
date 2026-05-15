function updateClock() {

  const now = new Date();

  const hours = String(now.getHours()).padStart(2, '0');

  const minutes = String(now.getMinutes()).padStart(2, '0');

  const seconds = String(now.getSeconds()).padStart(2, '0');

  const time = `${hours}:${minutes}:${seconds}`;

  document.getElementById('clock').textContent = time;
}

setInterval(updateClock, 1000);

updateClock();

async function getWeather(city = 'Itu') {

  try {

    // BUSCA COORDENADAS DA CIDADE

    const geoResponse = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=pt&format=json`
    );

    const geoData = await geoResponse.json();

    if (!geoData.results) {

      alert('Cidade não encontrada');

      return;
    }

    const location = geoData.results[0];

    const latitude = location.latitude;

    const longitude = location.longitude;

    const cityName = location.name;

    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code`
    );

    const weatherData = await weatherResponse.json();

    const temperature =
      weatherData.current.temperature_2m;

    const humidity =
      weatherData.current.relative_humidity_2m;

    const weatherCode =
      weatherData.current.weather_code;

    let description = 'Clima desconhecido';

    if (weatherCode === 0) {

      description = 'Céu limpo';

    } else if (weatherCode <= 3) {

      description = 'Parcialmente nublado';

    } else if (weatherCode <= 48) {

      description = 'Neblina';

    } else if (weatherCode <= 67) {

      description = 'Chuva';

    } else {

      description = 'Clima instável';
    }

    document.getElementById('city').textContent =
      cityName;

    document.getElementById('temp').textContent =
      `${temperature}°C`;

    document.getElementById('humidity').textContent =
      `${humidity}%`;

    document.getElementById('description').textContent =
      description;

  } catch (error) {

    console.error(error);

    alert('Erro ao buscar clima');
  }
}


const searchBtn =
  document.getElementById('search-btn');

searchBtn.addEventListener('click', () => {

  const cityInput =
    document.getElementById('city-input');

  const city = cityInput.value;

  if (city.trim() !== '') {

    getWeather(city);
  }
});

getWeather();