const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const weatherAPIKey = '60d74bccd439494992d21557230706';

app.post('/getWeather', async (req, res) => {
  try {
    const { cities } = req.body;

    const weatherData = await Promise.all(
      cities.map(async (city) => {
        const weather = await fetchWeather(city);
        return { [city]: weather };
      })
    );

    const weatherResult = weatherData.reduce((result, data) => {
      return { ...result, ...data };
    }, {});

    res.json({ weather: weatherResult });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'An error occurred' });
  }
});

async function fetchWeather(city) {
  const weatherAPIUrl = `https://api.weatherapi.com/v1/current.json?key=${weatherAPIKey}&q=${city}`;

  try {
    const response = await axios.get(weatherAPIUrl);
    const temperature = response.data.current.temp_c;
    return `${temperature}C`;
  } catch (error) {
    console.error(`Error fetching weather for ${city}:`, error.message);
    return 'N/A';
  }
}

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

