import React from 'react';
import { useState } from 'react';
import Weather from './Weather';
import Geocoding from './Geocoding';
import FutureWeather from './futureWeather';


const App = () => {

    const [geoData, setGeoData] = useState('');
    const [weatherData, setWeatherData] = useState('');

    return (
        <div>
            <h1>Weather Forecast App</h1>
            <Geocoding sendData={setGeoData}/>
            {geoData ? (
                <>
                <h2>Name: {geoData.name}</h2>
                    <p>Latitude: {geoData.latitude}</p>
                    <p>Longitude: {geoData.longitude}</p>
                <Weather
                    sendData={setWeatherData}
                    latitude={geoData.latitude}
                    longitude={geoData.longitude}
                />
                <FutureWeather
                        latitude={geoData.latitude}
                        longitude={geoData.longitude}
                    />
                </>
            ):(
                <p>Loading weather</p>
            )}

            {weatherData?(
                <>
                <p>{Object.entries(weatherData.forecast.current)}</p>
                </>
            ):(
                <p>Weatherdata array:</p>
            )}
        </div>
    );
};

export default App
