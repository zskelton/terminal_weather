const http = require('http');
const dns = require('dns');

const util = require('util');

/* CHECK CONNECTION FUNCTION */
function checkConnection(sitelist) {
  // Check Each Site
  sitelist.forEach((site) => {
    dns.resolve(site, (err) => { return false; })
  });
  // No errors, return true.
  return true;
}

/* GET DATA FUNCTION */
async function getData(url) {
  // Get Response
  const res = await new Promise(resolve => {
    http.get(url, resolve);
  });

  // Process Response
  let data = await new Promise((resolve, reject) => {
    let _data = '';
    res.on('data', chunk => _data += chunk);
    res.on('error', err => reject(err));
    res.on('end', () => resolve(JSON.parse(_data)));
  });

  // Return Processed Response
  return data || false;
}

/* WEATHER REPORTING FUNCTION */
function reportWeather (data) {
  // Convert Kelvin to Fahrenheit
  const k2f = (K) => {
    return ((((K - 273.15) * 9)/5)+32).toFixed(1);
  }
  // Convert Millibar to Inches of Mercury
  const pressure = (millibars) => {
    return (millibars * 0.0295301).toFixed(2);
  }

  // Variables Used
  const city  = data.name;
  const temp  = k2f(data.main.temp);
  const press = pressure(data.main.pressure);
  const windS = data.wind.speed.toFixed(0);
  const windD = data.wind.deg;
  const descS = data.weather[0].main;

  // Display Data
  console.log(`${city}: ${descS} ${temp}F ${windD}@${windS}mph ${press} Inches`)

  // Done
  return;
}

/* KILL PROCESS FUNCTION */
function killMe (error) {
  error ? console.error(`Ended with an error!`) : null;
  process.exit(error ? 1 : 0);
}

/* MAIN FUNCTION */
async function main() {
  // Variables
  const locationUrl = 'http://ipinfo.io';
  const weatherApiKey = '8a501082a8bb88ac1a46b416876164b2';
  let weatherApiUrl = `http://api.openweathermap.org/data/2.5/weather?appid=${weatherApiKey}&q=`;
  let loc = '';

  // Check Sites are Online
  if(!checkConnection(['ipinfo.io', 'api.openweathermap.org'])) {
    console.warn("No internet connection.\n");
    killMe();
  }

  // Get Location Info
  const locData = await getData(locationUrl);
  if(!locData) { console.warn("Failed to get location."); killMe(true); };

  // console.log(util.inspect(locData, false, null, true));

  // Get Weather Info
  const weatherData = await getData(weatherApiUrl+locData.city);
  if(!weatherData) { console.warn("Failed to get weather."); killMe(true); };

  // Print Status
  reportWeather(weatherData);

  // Quit
  killMe();
}


/* START AT MAIN */
main();
