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



async function getWeather() {

  try {

    const response = await fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=-23.26&longitude=-47.29&current=temperature_2m,relative_humidity_2m,weather_code'
    );

    const data = await response.json();

    const temperature = data.current.temperature_2m;

    const humidity = data.current.relative_humidity_2m;

    const weatherCode = data.current.weather_code;

    let description = 'Clima desconhecido';

    if (weatherCode === 0) {
      description = 'Céu limpo';
    } else if (weatherCode <= 3) {
      description = 'Parcialmente nublado';
    } else {
      description = 'Clima instável';
    }

    document.getElementById('temp').textContent =
      `${temperature}°C`;

    document.getElementById('humidity').textContent =
      `${humidity}%`;

    document.getElementById('description').textContent =
      description;

  } catch (error) {

    console.error('Erro ao buscar clima:', error);

    document.getElementById('description').textContent =
      'Erro ao carregar clima';
  }
}

getWeather();