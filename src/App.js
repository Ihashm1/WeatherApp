import React from 'react';
import { useState } from 'react';
import Weather from './Weather';
import Geocoding from './Geocoding';
import FutureWeather from './futureWeather';
import ForecastButton from './forecastButton';
import LineChart from './graphDisplay';
import settingsLogo from './images/gear-solid.svg';
import calendarLogo from './images/calendar-regular.svg';
import mapLogo from './images/map-regular.svg';
import warningLogo from './images/triangle-exclamation-solid.svg';
import { MapContainer, TileLayer, useMap } from 'react-leaflet'

const App = () => {
    const [divDisp, setDivDisp] = useState(true);
    const [geoData, setGeoData] = useState('');
    const [weatherData, setWeatherData] = useState('');

    const switchVisibility = () =>{
        setDivDisp(!divDisp);
        console.log("clicked");
    }

    const weatherLookup = {
    0:  { label: "Clear Sky",  icon: "☀️"  },
    1: {label: "Mainly clear", icon: "☁️" },
    2: {label: "Partly cloudy", icon: "☁️" },
    3: {label: "Overcast", icon: "☁️" },
    45: { label: "Fog and depositing rime fog", icon: "🌫️" }, 
    48:	{ label: "Fog and depositing rime fog", icon: "🌫️" },
    51:	{ label: "Drizzle: Light, moderate, and dense intensity", icon: "🌧️" },
    53:	{ label: "Drizzle: Light, moderate, and dense intensity", icon: "🌧️" },
    55:	{ label: "Drizzle: Light, moderate, and dense intensity", icon: "🌧️" },
    56:	{ label: "Freezing Drizzle: Light and dense intensity", icon: "🌧️" },
    57:	{ label: "Freezing Drizzle: Light and dense intensity", icon: "🌧️" },
    61:	{ label: "Rain: Slight, moderate and heavy intensity", icon: "🌧️" },
    63:	{ label: "Rain: Slight, moderate and heavy intensity", icon: "🌧️" },
    65:	{ label: "Rain: Slight, moderate and heavy intensity", icon: "🌧️" },
    66:	{ label: "Freezing Rain: Light and heavy intensity", icon: "🌧️" },
    67:	{ label: "Freezing Rain: Light and heavy intensity", icon: "🌧️" },
    71:	{ label: "Snow fall: Slight, moderate, and heavy intensity", icon: "🌨️" },
    73:	{ label: "Snow fall: Slight, moderate, and heavy intensity", icon: "🌨️" },
    75:	{ label: "Snow fall: Slight, moderate, and heavy intensity", icon: "🌨️" },
    77:	{ label: "Snow grains", icon: "snow-grains" },
    80: { label: "Rain showers: Slight, moderate, and violent", icon: "🌧️" },
    81: { label: "Rain showers: Slight, moderate, and violent", icon: "🌧️" },
    82:	{ label: "Rain showers: Slight, moderate, and violent", icon: "🌧️" },
    85: { label: "Snow showers slight and heavy", icon: "🌨️" },
    86:	{ label: "Snow showers slight and heavy", icon: "🌨️" },
    95:	{ label: "Thunderstorm: Slight or moderate", icon: "⛈️" },
    96:	{ label: "Thunderstorm with slight and heavy hail", icon: "⛈️" },
    99:	{ label: "Thunderstorm with slight and heavy hail", icon: "⛈️" }
}

    return (
        <>
        <div className='container-fluid p-0 pb-5' style={{minHeight:"100vh",backgroundColor:"#cbd2e3"}}>
            <div className='tab-content' id="app-tabcontent">
                <div className="tab-pane" id="settings">
                    <div className="">
                        <p>Settings</p>
                    </div>
                </div>
                <div className='tab-pane show active' id="forecasts">
                    <div className={divDisp ? "container-fluid p-3" : "container-fluid p-3 hidden"}>
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
                                    numval={weatherData ? weatherLookup[weatherData.forecast.current[8][1]].icon + " " + weatherData.forecast.current[2][1] : "N/A"}
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
                </div>
                <div className="tab-pane" id="map">
                    <div className="container-fluid p-3">
                        <p>Map</p>
                        <div className='h-100 w-100' style={{}}>
                        <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false} style={{height:"80vh"}}>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                        </MapContainer>
                        </div>
                        
                        <p>Endmap</p>
                    </div>
                </div>
            </div>
            
        </div>
        <div>
            <nav className='navbar fixed-bottom bg-light justify-content-center'>
                <ul className="nav nav-pills justify-content-center row" role="tablist">
                    <li className="nav-item col justify-content-center text-center">
                        <a className="nav-link" data-bs-toggle="pill" data-bs-target="#settings" type="button"><img src={settingsLogo} style={{height:'20px'}}/></a>
                        <small>Settings</small>
                    </li>
                    <li className="nav-item col justify-content-center text-center">
                        <a className="nav-link active mx-auto" data-bs-toggle="pill" data-bs-target="#forecasts" type="button"><img src={calendarLogo} style={{height:'20px'}}/></a>
                        <small>Forecasts</small>
                    </li>
                    <li className="nav-item col justify-content-center text-center">
                        <a className="nav-link" data-bs-toggle="pill" data-bs-target="#map" type="button"><img src={mapLogo} style={{height:'20px'}}/></a>
                        <small>Map</small>
                    </li>
                </ul>
            </nav>
        </div>
        </>
    );
};

export default App
