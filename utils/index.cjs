const http = require('http');
const dns = require('dns');
const colors = require('./../ansi_colors');

/* KILL PROCESS FUNCTION */
function killMe (error) {
  if (error) {
    // Display Error Message
    if (error.code && error.hostname) {
      console.log(`${colors.red}Error: ${colors.white}${error.code} @ ${error.hostname}.${colors.reset}`);
    } else {
      console.log(`${colors.red}Error: ${colors.white}${error}${colors.reset}`);
    }
    process.exit(1);
  }
  // Clean Exit
  process.exit(0);
}

/* CHECK CONNECTION FUNCTION */
const checkConnection = async(sitelist) => {
  try {
    sitelist.forEach((site) => {
        dns.lookup(site, () => {});
    });

    return true;
  } catch (e) {
    killMe(e);
  }
}

/* GET DATA FUNCTION */
async function getData(url) {
  // Get Response
  try {
    // Catch Bad Data Format
    if (!url) { throw new Error('No URL'); }

    // Setup Calls
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
  }

  // Get Weather Symbol
  const getWeatherTypeSymbol = (desc) => {
    switch(desc) {
      case "clear sky":
        return '☀️ Clear Skies'; // u2600
      case "few clouds":
      case  "scattered clouds":
        return '☁️ Few Clouds'; // u2601
      case "broken clouds":
        return '⛅ Broken Clouds'; // u26c5
      case "shower rain":
      case  "rain":
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
  console.log(`${colors.white}${city} Current Weather:${colors.green} ${skies}  ${therm}${temp}°F  ${dir}${speed}mph  ${press}in${colors.reset}`);

  // Done
  return true;
}

exports.killMe = killMe;
exports.checkConnection = checkConnection;
exports.getData = getData;
exports.reportWeather = reportWeather;
