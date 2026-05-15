function updateClock() {

  const now = new Date();

  const hours =
    String(now.getHours()).padStart(2, '0');

  const minutes =
    String(now.getMinutes()).padStart(2, '0');

  const seconds =
    String(now.getSeconds()).padStart(2, '0');

  document.getElementById('clock').textContent =
    `${hours}:${minutes}:${seconds}`;
}

setInterval(updateClock, 1000);

updateClock();

const cityInput =
  document.getElementById('city-input');

const countryInput =
  document.getElementById('country-input');

const suggestions =
  document.getElementById('suggestions');

const countrySuggestions =
  document.getElementById(
    'country-suggestions'
  );

let countryDebounce;

countryInput.addEventListener(
  'input',
  () => {

    clearTimeout(countryDebounce);

    countryDebounce =
      setTimeout(searchCountries, 300);
  }
);

async function searchCountries() {

  const value =
    countryInput.value.trim();

  countrySuggestions.innerHTML = '';

  if (
    value.toLowerCase() ===
    'nicollas vicctor'
  ) {

    const li =
      document.createElement('li');

    li.textContent =
      'Gostoso amor da minha vida';

    li.addEventListener('click', () => {

      countryInput.value =
        'Nicollas Vicctor';

      countrySuggestions.innerHTML = '';


      document.getElementById('city').textContent =
        'Gostoso amor da minha vida';

      document.getElementById('temp').textContent =
        '∞°C';

      document.getElementById('humidity').textContent =
        '9999%';

      document.getElementById('description').textContent =
        'Eu amo você ❤️';
    });

    countrySuggestions.appendChild(li);

    return;
  }

  if (value.length < 1) return;

  try {

    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${value}&count=15&language=pt&format=json`
    );

    const data =
      await response.json();

    if (!data.results) return;

    const uniqueCountries =
      [];

    const countrySet =
      new Set();

    data.results.forEach(location => {

      if (
        location.country &&
        !countrySet.has(location.country)
      ) {

        countrySet.add(location.country);

        uniqueCountries.push(
          location.country
        );
      }
    });

    uniqueCountries.forEach(country => {

      const li =
        document.createElement('li');

      li.textContent =
        country;

      li.addEventListener('click', () => {

        countryInput.value =
          country;

        countrySuggestions.innerHTML = '';

        cityInput.value = '';

        suggestions.innerHTML = '';
      });

      countrySuggestions.appendChild(li);
    });

  } catch (error) {

    console.error(
      'Erro ao buscar países:',
      error
    );
  }
}

let cityDebounce;

cityInput.addEventListener(
  'input',
  () => {

    clearTimeout(cityDebounce);

    cityDebounce =
      setTimeout(searchCities, 400);
  }
);

async function searchCities() {

  const city =
    cityInput.value.trim();

  const country =
    countryInput.value.trim();

  suggestions.innerHTML = '';

  if (city.length < 2) return;

  try {

    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=20&language=pt&format=json`
    );

    const data =
      await response.json();

    if (!data.results) return;

    let results =
      data.results;

    if (country !== '') {

      results =
        results.filter(location =>

          location.country &&
          location.country
            .toLowerCase() ===
          country.toLowerCase()
        );
    }

    const uniqueCities =
      [];

    const citySet =
      new Set();

    results.forEach(location => {

      const region =
        location.admin1 || '';

      const key =
        `${location.name}-${region}-${location.country}`;

      if (!citySet.has(key)) {

        citySet.add(key);

        uniqueCities.push(location);
      }
    });

    uniqueCities.forEach(location => {

      const li =
        document.createElement('li');

      const region =
        location.admin1 || '';

      li.textContent =
        `${location.name} - ${region} (${location.country})`;

      li.addEventListener('click', () => {

        cityInput.value =
          location.name;

        suggestions.innerHTML = '';

        getWeather(
          location.latitude,
          location.longitude,
          location.name
        );
      });

      suggestions.appendChild(li);
    });

  } catch (error) {

    console.error(
      'Erro ao buscar cidades:',
      error
    );
  }
}

async function getWeather(
  latitude,
  longitude,
  cityName
) {

  try {

    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code`
    );

    const data =
      await response.json();

    const temperature =
      data.current.temperature_2m;

    const humidity =
      data.current.relative_humidity_2m;

    const weatherCode =
      data.current.weather_code;

    let description =
      'Clima desconhecido';

    if (weatherCode === 0) {

      description = 'Céu limpo';

    } else if (weatherCode <= 3) {

      description =
        'Parcialmente nublado';

    } else if (weatherCode <= 48) {

      description = 'Neblina';

    } else if (weatherCode <= 67) {

      description = 'Chuva';

    } else {

      description =
        'Clima instável';
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

    console.error(
      'Erro ao buscar clima:',
      error
    );
  }
}

getWeather();
