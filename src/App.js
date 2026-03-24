import React from 'react';
import Weather from './Weather';
import Geocoding from './Geocoding';
import FutureWeather from './futureWeather';
const App = () => {
    return (
        <div>
            <h1>Weather Forecast App</h1>
            <Geocoding />
            <FutureWeather />
        </div>
    );
};
export default App
