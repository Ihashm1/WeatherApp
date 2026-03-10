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
