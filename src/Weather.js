import axios from 'axios';
import { useEffect, useState} from 'react';

const Weather = ({latitude, longitude}) => {

    const [forecastArr, setForecastArr] = useState('');
    const [marineArr, setMarineArr] = useState('');

    const fetchForecastData = async () => {
        try{
            const response = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,apparent_temperature_max,daylight_duration,sunrise,wind_speed_10m_max,wind_direction_10m_dominant&hourly=temperature_2m,visibility,wind_speed_10m,apparent_temperature,precipitation_probability,wind_direction_10m,precipitation,wind_gusts_10m,temperature_80m&current=temperature_2m,precipitation,wind_speed_10m,wind_direction_10m,wind_gusts_10m,apparent_temperature&wind_speed_unit=mph`)

            if(!response.data){
                return
            }

            const farray = {
                current: Object.entries(response.data.current),
                current_units: Object.entries(response.data.current_units),
                daily: Object.entries(response.data.daily),
                daily_units: Object.entries(response.data.daily_units),
                hourly: Object.entries(response.data.hourly),
                hourly_units: Object.entries(response.data.hourly_units)
            }
            setForecastArr(farray);
        }
        catch (error) {
            console.error(error);
        }
    };

    const fetchMarineData = async () => {
        try{
            const response = await axios.get(`https://marine-api.open-meteo.com/v1/marine?latitude=${latitude}&longitude=${longitude}&daily=wave_height_max,wave_direction_dominant,swell_wave_height_max,swell_wave_direction_dominant&hourly=wave_height,sea_level_height_msl,wave_direction,swell_wave_height,swell_wave_direction,sea_surface_temperature&current=wave_height,wave_direction,sea_level_height_msl,sea_surface_temperature,swell_wave_direction,swell_wave_height`)

            if(!response.data){
                return
            }
            
            const marray = {
                current: Object.entries(response.data.current),
                current_units: Object.entries(response.data.current_units),
                daily: Object.entries(response.data.daily),
                daily_units: Object.entries(response.data.daily_units),
                hourly: Object.entries(response.data.hourly),
                hourly_units: Object.entries(response.data.hourly_units)
            }
            setMarineArr(marray);
            
        }
        catch (error) {
            console.error(error);
        }
    };

    useEffect(() =>{

        if(latitude === '' || longitude === ''){
            return
        }

        fetchForecastData();
        fetchMarineData();

    }, [latitude,longitude]);

    return(
        <>
        {forecastArr ? (
            <>
            <div>
                <p>Current Data: {forecastArr.current}</p>
                <p>Marine Data: {marineArr.current}</p>
            </div>
            </>
        ) : (
            <p>Loading</p>
        )} 
        </>
    )
}

export default Weather;
