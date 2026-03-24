import React from 'react';
import { useState } from 'react';
import Weather from './Weather';
import Geocoding from './Geocoding';
import FutureWeather from './futureWeather';


const App = () => {

    const [geoData, setGeoData] = useState('');

    return (
        <div>
            <h1>Weather Forecast App</h1>
            {geoData?(
                <>
                <p>Geo Lat:{geoData.latitude} Long: {geoData.longitude}</p>
                </>
            ):(
                <p>Loading</p>
            )}
            <Geocoding sendData={setGeoData}/>
            
            <FutureWeather />
        </div>
    );
};

export default App
