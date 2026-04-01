# Weather App for Sailors

A weather application built for sailors to check marine or regualr forecast conditions, and get a safety recommendation before setting sail.

## Description

The weather app pulls live weather and marine data for any location and evaluates conditions against your vessel's dimensions to produce a reccomendation on if its safe to travel. It displays marine and regualr forecast metrics (wind speed, temperature, wave height etc.)
 and returns a safety rating (Safe, Acceptable, Caution, or Dangerous) with specific reasons. The app also includes a 
 map, hourly and 7 day forecasts, unit toggles, dark mode, and a downloadable PDF report.

## Getting Started

### Dependencies

* Node.js 14 or higher
* npm 6 or higher
* Internet connection (required for weather API calls)

### Installing

Clone the repository and install dependencies:
```bash
git clone https://github.com/Ihashm1/WeatherApp.git weatherApp
cd weatherApp
npm install
```

### Executing the Program
```bash
npm start
```

## Features

* Safety Rating — Enter your vessel's length and freeboard height. The app then returns a reccomendation along with a reason
* City Search — Autocomplete search for any city
* Forecast Metrics — Cards for temperature, precipitation, wind speed/direction/gusts, wave height/period/direction, swell direction/height/period, sea surface temperature, and sea level height
* Line Charts — Click any metric card to see a 24 hour line chart from the current time, and a 7 day future weather forecast
* Map — Leaflet map centered on your selected location
* Settings — Dark mode MPH/Knots toggle, vessel dimensions input
* PDF Report — Export a report with charts and daily forecast cards for the selected location

## Tech Stack

This project is built with React 19, using Leaflet for the interactive map, Chart.js for forecast graphs, Axios for HTTP requests, and jsPDF for PDF export. Weather, marine, and latitude and longitude data are all sourced from the Open-Meteo API. Styling is handled with custom css.

