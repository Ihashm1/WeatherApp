import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

// 24 hours, temp, wind speed visibility, swell tide, wind direction i guess
export default function LineChart({ variable, marineData, forecastData}) {
  const ref = useRef();
  const index = {
    temperature_2m: 1,
    visibility: 2,
    wind_speed_10m: 3,
    wind_direction_10m: 6,
    wave_height: 1,
    swell_wave_height: 4,
  }

  const chartLabel = {
    temperature_2m: "Temperature (°C)",
    visibility: "Visibility (m)",
    wind_speed_10m: "Wind Speed (mph)",
    wind_direction_10m: "Wind Direction (°)",
    wave_height: "Wave Height (m)",
    swell_wave_height: "Swell Height (m)",
  }


  const marineArray = ["wave_height","swell_wave_height"]


  useEffect(() => {
    if(!marineData && !forecastData){
      return;
    }
    //wave_height swell_wave_height 

    const dataToUse = marineArray.includes(variable) ? marineData : forecastData;

    const hourly = dataToUse.hourly
    const times = hourly[0][1]
    const values = hourly[index[variable]][1]

    const ind = new Date().getHours()
    const newT = times.slice(ind,ind+24)
    const newV = values.slice(ind,ind+24)
    const labels = newT.map(t => t.split("T")[1]);



    const chart = new Chart(ref.current, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: chartLabel[variable],
            data: newV,
          }
        ]
      }
    })
    return () => chart.destroy();
  })

  return <canvas ref={ref} />;
}