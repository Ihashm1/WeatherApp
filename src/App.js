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
        <div style={{backgroundColor:"#cbd2e3",height:"100vh"}} id="Forecast" className={divDisp ? "container-fluid p-3" : "container-fluid p-3 hidden"}>
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

            {weatherData && (
                <>
                <div className="row row-cols-2 row-cols-md-4 row-gap-2 column-gap-2 mx-auto justify-content-center">
                    <ForecastButton
                        safetynum={0}
                        numval={weatherData.forecast.current[2][1]}
                        units={"C"}
                        text={"Temperature"}
                        click={switchVisibility}
                    />
                </div>
                </>
               )}
           
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
    );
};

export default App
