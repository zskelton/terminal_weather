const utils = require('./utils/index.cjs');
const weatherApiKey = require('./secret/config');

/* MAIN FUNCTION */
async function main() {
  // Variables
  const locationUrl = 'http://ipinfo.io';
  const weatherApiUrl = `http://api.openweathermap.org/data/2.5/weather?appid=${weatherApiKey}&q=`;

  // Check Sites are Online
  utils.checkConnection(['ipinfo.io', 'api.openweathermap.org']);

  // Get Location Info
  const locData = await utils.getData(locationUrl);
  if(!locData) { console.warn("Error: Failed to get location."); utils.killMe(); };

  // Get Weather Info
  const weatherData = await utils.getData(weatherApiUrl+locData.city);
  if(!weatherData) { console.warn("Error: Failed to get weather."); utils.killMe(); };

  // Print Status
  utils.reportWeather(weatherData);

  // Quit
  utils.killMe();
}


/* START AT MAIN */
main();
