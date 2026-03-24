import React from 'react';
import { useState } from 'react';
import Weather from './Weather';
import Geocoding from './Geocoding';
import FutureWeather from './futureWeather';
import ForecastButton from './forecastButton';
import LineChart from './graphDisplay';

const App = () => {
    const [divDisp, setDivDisp] = useState(false);
    const [geoData, setGeoData] = useState('');
    const [weatherData, setWeatherData] = useState('');

    const switchVisibility = () =>{
        setDivDisp(!divDisp);
        console.log("clicked");
    }

    return (
        <div>
            <div id="Forecast" className={divDisp ? "" : "hidden"}>
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
                    <ForecastButton
                        safetynum={0}
                        numval={weatherData.forecast.current[2][1]}
                        units={"C"}
                        text={"Temperature"}
                        click={switchVisibility}
                    />
                    <p>{/*weatherData.forecast.current[2][1]*/}</p>
                    </>
                ):(
                    <p>Weatherdata array:</p>
                )}
            </div>
            <div id="LineChart" className={divDisp ? "hidden" : ""}>
                {weatherData?(
                    <>
                    <ForecastButton
                        safetynum={0}
                        numval={weatherData.forecast.current[2][1]}
                        units={"C"}
                        text={"Temperature"}
                        click={switchVisibility}
                    />
                    <p>{/*weatherData.forecast.current[2][1]*/}</p>
                    </>
                ):(
                    <p>Weatherdata array:</p>
                )}
            </div>
        </div>
    );
};

export default App
