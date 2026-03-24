import { useEffect, useState } from 'react';
import axios from 'axios';

const FutureWeather = ({ latitude, longitude }) => { 
    const [dailyArr, setDailyArr] = useState(null);
    const [currentData, setCurrentData] = useState(null);

    const fetchData = async () =>  {
        try {
            const weatherResponse = await axios.get(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max&,weather_code&current=weather_code,apparent_temperature`
                
                
            );
            setDailyArr(weatherResponse.data.daily);
            setCurrentData(weatherResponse.data.current);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [latitude, longitude]);  // re-fetch when location changes


    const weatherLookup = {
    0:  { label: "Clear Sky",  icon: "sun"  },
    1: {label: "Mainly clear", icon: "cloud" },
    2: {label: "Partly cloudy", icon: "cloud" },
    3: {label: "Overcast", icon: "cloud" },
    45: { label: "Fog and depositing rime fog", icon: "fog" }, 
    48:	{ label: "Fog and depositing rime fog", icon: "fog" },
    51:	{ label: "Drizzle: Light, moderate, and dense intensity", icon: "drizzle" },
    53:	{ label: "Drizzle: Light, moderate, and dense intensity", icon: "drizzle" },
    55:	{ label: "Drizzle: Light, moderate, and dense intensity", icon: "drizzle" },
    56:	{ label: "Freezing Drizzle: Light and dense intensity", icon: "freezing-drizzle" },
    57:	{ label: "Freezing Drizzle: Light and dense intensity", icon: "freezing-drizzle" },
    61:	{ label: "Rain: Slight, moderate and heavy intensity", icon: "rain" },
    63:	{ label: "Rain: Slight, moderate and heavy intensity", icon: "rain" },
    65:	{ label: "Rain: Slight, moderate and heavy intensity", icon: "rain" },
    66:	{ label: "Freezing Rain: Light and heavy intensity", icon: "freezing-rain" },
    67:	{ label: "Freezing Rain: Light and heavy intensity", icon: "freezing-rain" },
    71:	{ label: "Snow fall: Slight, moderate, and heavy intensity", icon: "snow" },
    73:	{ label: "Snow fall: Slight, moderate, and heavy intensity", icon: "snow" },
    75:	{ label: "Snow fall: Slight, moderate, and heavy intensity", icon: "snow" },
    77:	{ label: "Snow grains", icon: "snow-grains" },
    80: { label: "Rain showers: Slight, moderate, and violent", icon: "rain" },
    81: { label: "Rain showers: Slight, moderate, and violent", icon: "rain" },
    82:	{ label: "Rain showers: Slight, moderate, and violent", icon: "rain" },
    85: { label: "Snow showers slight and heavy", icon: "snow" },
    86:	{ label: "Snow showers slight and heavy", icon: "snow" },
    95:	{ label: "Thunderstorm: Slight or moderate", icon: "thunderstorm" },
    96:	{ label: "Thunderstorm with slight and heavy hail", icon: "thunderstorm" },
    99:	{ label: "Thunderstorm with slight and heavy hail", icon: "thunderstorm" }
}
   
    const currentWeather = weatherLookup[currentData?.weather_code];
   

    /*
    return (
        <div>
            {dailyArr ? (
                <>
                <h2>Current weather section</h2>
                        
                        <p>{currentWeather.label} {currentData.temperature_2m}°C {currentWeather.icon}</p>
                        <p>Feels like: {currentData.apparent_temperature}°C</p>

                    <h2>Daily Weather</h2>
                    <ul>
                        {dailyArr.time.map((date, index) => (
                            <p key={index}>
                                {new Date(date).toLocaleDateString('en-GB', { weekday: 'short' })} — {dailyArr.temperature_2m_max[index]}°C
                            </p>
                        ))}
                    </ul>
                </>   
                )
                : (
                    <p>Loading future weather...</p>
                  
                )
            }
        </div>  

    );
    */
};

export default FutureWeather;