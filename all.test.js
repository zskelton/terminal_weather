const utils = require('./utils/index.cjs');
const weatherApiKey = require('./secret/config');
const { TestWatcher } = require('jest');

// Tests It All Runs
test('Program Runs', () => {
  return expect(main()).resolves.toBe(true);
});



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

  // console.log(util.inspect(locData, false, null, true));

  // Get Weather Info
  const weatherData = await utils.getData(weatherApiUrl+locData.city);
  if(!weatherData) { console.warn("Error: Failed to get weather."); utils.killMe(); };

  // Print Status
  utils.reportWeather(weatherData);

  // Quit
  return true;
  // utils.killMe();
}
