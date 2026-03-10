import React from 'react';
import Weather from './Weather';
import Geocoding from './Geocoding';
const App = () => {
    return (
        <div>
            <h1>Weather Forecast App</h1>
            <Geocoding />
            <Weather />
        </div>
    );
};
export default App
