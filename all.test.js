const utils = require('./utils/index.cjs');
const weatherApiKey = require('./secret/config');

describe("Utility Tests:", () => {
  it('Does it Die?', () => {
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});
    utils.killMe();
    expect(mockExit).toHaveBeenCalled();
  })

  jest.mock('dns');
  it('Does it Verify Data Connection?', async () => {
    await expect(utils.checkConnection(['ipinfo.io', 'api.openweathermap.org'])).resolves.toBeTruthy();
  });

  jest.mock('http');
  const locationUrl = 'http://ipinfo.io';
  it('Does Data Pull?', async () => {
    await expect(utils.getData(locationUrl)).resolves.toBeTruthy();
  });

  const weatherData = {
    coord: { lon: -95.9378, lat: 41.2586 },
    weather: [ { id: 800, main: 'Clear', description: 'clear sky', icon: '01d' } ],
    base: 'stations',
    main: {
      temp: 277.59,
      feels_like: 275.62,
      temp_min: 276.12,
      temp_max: 279,
      pressure: 1023,
      humidity: 40
    },
    visibility: 10000,
    wind: { speed: 2.24, deg: 274, gust: 7.15 },
    clouds: { all: 0 },
    dt: 1644185106,
    sys: {
      type: 2,
      id: 2003015,
      country: 'US',
      sunrise: 1644154179,
      sunset: 1644191164
    },
    timezone: -21600,
    id: 5074472,
    name: 'Omaha',
    cod: 200
  };

  it('Does it Show Data?', async () => {
    const res = utils.reportWeather(weatherData);
    expect(res).toBeTruthy();
  })
});

// Can it process the data?

// Now, Test Everything
describe("The Program Runs:", () => {
  it('Does it Run?', () => {
    return expect(main()).resolves.toBe(true);
  });
})


/* MAIN FUNCTION - To Demonstrate Full Working Program */
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

  // Quit (Returns here for test to show complete).
  return true;
}
