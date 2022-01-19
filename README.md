[![Node.js CI](https://github.com/zskelton/terminal_weather/actions/workflows/node.js.yml/badge.svg)](https://github.com/zskelton/terminal_weather/actions/workflows/node.js.yml)

### Terminal Weather
A simple weather plugin for your terminal.

![screenshot](./webassets/screenshot.png?raw=true)

## Setup
- [Download](https://github.com/zskelton/terminal_weather/releases/download/v1.0/weather.exe) the executable and run.

## Usage
Note: You will need an [OpenWeather API](https://openweathermap.org/api) Key to run this program.

- If you choose to run as a NodeJS app or to build your own features:

```bash
git checkout https://github.com/zskelton/terminal_weather.git
cd terminal_weather
# You'll need to add your OpenWeather API Key - The Script will add it in secret/config.js
./setSecret [OpenWeatherAPI]
npm run
```

- To create an executable:
```bash
npm install -g pkg
npm run-script build
# The executable will be in the ./build folder
```

## Purpose
This was a project to practice use of NodeJS. All files were created by hand, no automated software or build for package.json to get a better understanding of the innerworkings of NodeJS. **Also, I just like a weather update on my terminal.**

---
>***Question:** Can NodeJS be a scripting language?.*<br />
>***Answer:** Yes, but the asynchronous nature would make it frustrating beyond reason.*
