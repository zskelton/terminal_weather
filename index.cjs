const http = require('http');
const dns = require('dns');
const colors = require('./ansi_colors');
const weatherApiKey = require('./secret/config');

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
  try {
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
    return data;
  } catch (e) {
    return false;
  }
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

  // Get Wind Driection Arrow
  const getWindDirectionSymbol = (d) => {
    // Why did a switch not work, beats me. This is ugly but works.
    if (d < 23) { return '▲'; } // u25b2
    if (d < 67) { return '◥'; } // u25e5
    if (d < 113) { return '▶'; } // u25b6
    if (d < 157) { return '◢'; } // u25e2
    if (d < 203) { return '▼ '; } // u25bc
    if (d < 247) { return '◣'; } // u25e3
    if (d < 293) { return '◀'; } // u25c0
    if (d < 337) { return '◤'; } // u25e4
    if (d >= 338) { return '▲'; } // u25b2
    return '';
  }

  // Get Weather Symbol
  const getWeatherTypeSymbol = (desc) => {
    switch(desc) {
      case "clear sky":
        return '☀️ Clear Skies'; // u2600
      case "few clouds" | "scattered clouds":
        return '☁️ Few Clouds'; // u2601
      case "broken clouds":
        return '⛅ Broken Clouds'; // u26c5
      case "shower rain" | "rain":
        return '☂ Rain'; // u2602
      case "thunderstorms":
        return '⚡️ Thunderstorms'; // u26a1
      case "snow":
        return '❄️ Snow'; // u2744
      case "mist":
        return '⛆ Misty'; // u26c6
      default:
        return '';
    }
  }

  // FIXME: Does not work after build with pkg... unhandled promise.
  // Converts Unix Format to AM/PM Format
  // const convertUnixtoTime = (t) => {
  //   const date = new Date(t * 1000).toLocaleString('en-US', {timeZone: 'CST', timeStyle: 'short'});
  //   return date;
  // }

  // Variables Used
  const city  = data.name;
  const temp  = k2f(data.main.temp);
  const dir   = getWindDirectionSymbol(data.wind.deg);
  const speed = data.wind.speed.toFixed(0);
  const press = pressure(data.main.pressure);
  const skies = getWeatherTypeSymbol(data.weather[0].description);
  const therm = 'ϴ'; // u03f4
  // const time  = convertUnixtoTime(data.dt);

  // Display Data
  // console.log(`${city} Current Weather at ${time}: ${skies}  ${therm}${temp}°F  ${dir} ${speed}mph  ${press}in`)
  console.log(`${colors.white}${city} Current Weather:${colors.green} ${skies}  ${therm}${temp}°F  ${dir}${speed}mph  ${press}in${colors.reset}`);

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
