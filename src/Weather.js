import { fetchWeatherApi } from 'openmeteo';
import { useEffect, useState} from 'react';

const Weather = ({latitude, longitude}) => {

    const [data, setData] = useState('');

    useEffect(() =>{

        if(latitude === '' || longitude === ''){
            return
        }

        const params = {
            latitude: [latitude],
            longitude: [longitude],
            current: 'temperature_2m,weather_code,wind_speed_10m,wind_direction_10m',
            hourly: 'temperature_2m,precipitation',
            daily: 'weather_code,temperature_2m_max,temperature_2m_min'
            };
        const url = 'https://api.open-meteo.com/v1/forecast';
        (async () => {
            const responses = await fetchWeatherApi(url, params);
            if(!responses[0]){
                return
            }
            const current = responses[0].current();
            console.log("Current Temperataure:", current.variables(0).value(), "°C");
            setData(responses[0])
        })();

    }, [latitude,longitude]);

    return(
        <>
        {data ? (
            <>
            <div>
                <p>Current Temp: {data.current().variables(0).value()}</p>
            </div>
            </>
        ) : (
            <p>Loading</p>
        )} 
        </>
    )
}

export default Weather;
//Master link for the forecast

//https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&daily=temperature_2m_max,apparent_temperature_max,daylight_duration,sunrise,wind_speed_10m_max,wind_direction_10m_dominant&hourly=temperature_2m,visibility,wind_speed_10m,apparent_temperature,precipitation_probability,wind_direction_10m,precipitation,wind_gusts_10m,temperature_80m&current=temperature_2m,precipitation,wind_speed_10m,wind_direction_10m,wind_gusts_10m,apparent_temperature&wind_speed_unit=mph

//Master link for the sea forecast

//https://marine-api.open-meteo.com/v1/marine?latitude=54.544587&longitude=10.227487&daily=wave_height_max,wave_direction_dominant,swell_wave_height_max,swell_wave_direction_dominant&hourly=wave_height,sea_level_height_msl,wave_direction,swell_wave_height,swell_wave_direction,sea_surface_temperature&current=wave_height,wave_direction,sea_level_height_msl,sea_surface_temperature,swell_wave_direction,swell_wave_height