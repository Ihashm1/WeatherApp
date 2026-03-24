import React from 'react';
import { useState } from 'react';
import Weather from './Weather';
import Geocoding from './Geocoding';
import FutureWeather from './futureWeather';
import ForecastButton from './forecastButton';
import LineChart from './graphDisplay';

const App = () => {

    const [geoData, setGeoData] = useState('');
    const [weatherData, setWeatherData] = useState('');

    const drawGraph = () =>{
        console.log("drawing");
    }

    return (
        <div className="container-fluid p-3" style={{backgroundColor:"#cbd2e3",height:"100vh"}} id="app-parent">
            {/*<h1>Weather Forecast App</h1>*/}
            <Geocoding sendData={setGeoData}/>
            
            {geoData && (
                <>
                {/*<h2>Name: {geoData.name}</h2>
                <p>Latitude: {geoData.latitude}</p>
                <p>Longitude: {geoData.longitude}</p>*/}
                
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
            )}

            {weatherData && (
                <>
                <div className="row row-cols-2 row-cols-md-4 row-gap-2 column-gap-2 mx-auto justify-content-center">
                    <ForecastButton
                        safetynum={0}
                        numval={weatherData.forecast.current[2][1]}
                        units={"C"}
                        text={"Temperature"}
                        click={drawGraph}
                    />
                    <ForecastButton
                        safetynum={1}
                        numval={weatherData.forecast.current[2][1]}
                        units={"C"}
                        text={"Temperature"}
                        click={drawGraph}
                    />
                    <ForecastButton
                        safetynum={2}
                        numval={weatherData.forecast.current[2][1]}
                        units={"C"}
                        text={"Temperature"}
                        click={drawGraph}
                    />
                    <ForecastButton
                        safetynum={3}
                        numval={weatherData.forecast.current[2][1]}
                        units={"C"}
                        text={"Temperature"}
                        click={drawGraph}
                    />
                </div>
                </>
            )}
        </div>
    );
};

export default App
