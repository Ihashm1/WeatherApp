import React from 'react';
import { useState } from 'react';
import Weather from './Weather';
import Geocoding from './Geocoding';
import FutureWeather from './futureWeather';
import ForecastButton from './forecastButton';
import LineChart from './graphDisplay';

const App = () => {
    const [divDisp, setDivDisp] = useState(true);
    const [geoData, setGeoData] = useState('');
    const [weatherData, setWeatherData] = useState('');

    const switchVisibility = () =>{
        setDivDisp(!divDisp);
        console.log("clicked");
    }

    return (
        <>
        <div style={{backgroundColor:"#cbd2e3",minHeight:"100vh"}} id="Forecast" className={divDisp ? "container-fluid p-3" : "container-fluid p-3 hidden"}>
            <Geocoding sendData={setGeoData}/>
            
            {geoData && (
                <>
                
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

            <>
                <div className="row row-cols-2 row-cols-md-4 row-gap-2 column-gap-2 mx-auto justify-content-center p-1">
                    <ForecastButton
                        safetynum={0}
                        numval={weatherData ? weatherData.forecast.current[2][1] : "N/A"}
                        units={"°C"}
                        text={"Feels like:" + (weatherData ?  weatherData.forecast.current[7][1]: "N/A") + "°C" }
                        click={switchVisibility}
                    />
                    <ForecastButton
                        safetynum={0}
                        numval={weatherData ? weatherData.forecast.current[3][1] : "N/A"}
                        units={"mm"}
                        text={"Precipitation"}
                        click={switchVisibility}
                    />
                    <ForecastButton
                        safetynum={0}
                        numval={weatherData ? weatherData.forecast.current[4][1] : "N/A"}
                        units={"mph"}
                        text={"Wind Speed"}
                        click={switchVisibility}
                    />
                    <ForecastButton
                        safetynum={0}
                        // this needs to be an arrow graphic
                        numval={weatherData ? weatherData.forecast.current[5][1] : "N/A"}
                        units={"°"}
                        text={"Wind Direction"}
                        click={switchVisibility}
                    />
                    <ForecastButton
                        safetynum={0}
                        numval={weatherData ? weatherData.forecast.current[6][1] : "N/A"}
                        units={"mph"}
                        text={"Wind Gusts"}
                        click={switchVisibility}
                    />
                    <ForecastButton
                        safetynum={0}
                        numval={weatherData ? weatherData.marine.current[2][1] : "N/A"}
                        units={"m"}
                        text={"Wave Height"}
                        click={switchVisibility}
                    />
                    <ForecastButton
                        safetynum={0}
                        numval={weatherData ? weatherData.marine.current[3][1] : "N/A"}
                        units={"°"}
                        text={"Wave Direction"}
                        click={switchVisibility}
                    />
                    <ForecastButton
                        safetynum={0}
                        numval={weatherData ? weatherData.marine.current[4][1] : "N/A"}
                        units={"m"}
                        text={"Sea Level Height"}
                        click={switchVisibility}
                    />
                    <ForecastButton
                        safetynum={0}
                        numval={weatherData ? weatherData.marine.current[5][1] : "N/A"}
                        units={"°C"}
                        text={"Sea Surface Temperature"}
                        click={switchVisibility}
                    />
                    <ForecastButton
                        safetynum={0}
                        numval={weatherData ? weatherData.marine.current[6][1] : "N/A"}
                        units={"°"}
                        text={"Swell Direction"}
                        click={switchVisibility}
                    />
                    <ForecastButton
                        safetynum={0}
                        numval={weatherData ? weatherData.marine.current[7][1] : "N/A"}
                        units={"m"}
                        text={"Swell Height"}
                        click={switchVisibility}
                    />
                </div>
            </>
           
            <div id="LineChart" className={divDisp ? "hidden" : ""}>
                {weatherData &&(
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
                )}
            </div>
        </div>
        </>
    );
};

export default App
