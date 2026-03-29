import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import Weather from './Weather';
import Geocoding from './Geocoding';
import FutureWeather from './futureWeather';
import ForecastButton from './forecastButton';
import LineChart from './graphDisplay';
import settingsLogo from './images/gear-solid.svg';
import calendarLogo from './images/calendar-regular.svg';
import mapLogo from './images/map-regular.svg';
import warningLogo from './images/triangle-exclamation-solid.svg';
import { MapContainer, TileLayer, useMap, Marker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import ForecastModal from './forecastModal';
import PdfReport from './PdfReport';

import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const App = () => {
    const [geoData, setGeoData] = useState('');
    const [weatherData, setWeatherData] = useState('');
    const [modalClick, setModalClick] = useState(null);

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

    const safetyLookup = (condition, val) => {
        switch (condition){
            case "windSpeed":
                if (val == 0){
                    return 0;
                }
                else if (val <= 24){
                    return 1;
                }
                else if (val <= 38){
                    return 2;
                }
                else{
                    return 3;
                }
                
            case "windGust":
                if (val <= 37){
                    return 1;
                }
                else if (val <= 50){
                    return 2;
                }
                else{
                    return 3;
                }
            case "waveHeight":
                if (val == 0){
                    return 0;
                }
                else if (val <= 2.5){
                    return 1;
                }
                else if (val <= 4.5){
                    return 2;
                }
                else{
                    return 3;
                }
            case "swellHeight":
                if (val == 0){
                    return 0;
                }
                else if (val <= 2){
                    return 1;
                }
                else if (val <= 4){
                    return 2;
                }
                else{
                    return 3;
                }
            case "seaTemp":
                if (val <= 15 || val >= 44){
                    return 3;
                }
                else if (val <= 21 || val >= 35 ){
                    return 2;
                }
                else{
                    return 1;
                }
            case "wavePeriod":
                if (val === 0) return 0;
                else if (val > 8) return 1;
                else if (val > 5) return 2;
                else return 3;
            default:
                return 0;
            
        }
    }

    function UpdateMap(props) {
        const map = useMap();

        useEffect(() => {
            map.flyTo(props.center, 10);}, [props.center[0], props.center[1]]); // only run when lat/lng changes

            return (
                <Marker position={props.center}/>
            );
    }

    return (
        <>
        <div className='container-fluid p-0 pb-5' style={{minHeight:"100vh",backgroundColor:"#cbd2e3"}}>
            <div className="p-3 pb-1">
                <Geocoding sendData={setGeoData}/>
                    {geoData && (
                    <>
                    <Weather
                        sendData={setWeatherData}
                        latitude={geoData.latitude}
                        longitude={geoData.longitude}
                    />
                    </>
                )}
            </div>
 
     

            
            <div className='tab-content pb-4' id="app-tabcontent">
                <div className="tab-pane" id="settings">
                    <div className="">
                        <p>Settings</p>
                    </div>
                </div>
                <div className='tab-pane show active' id="forecasts">
                    <div className={"container-fluid p-3"}>
                        {!geoData &&
                            <>
                            <div className='alert alert-info alert-dismissable show'>
                                <img src={warningLogo} className="bi me-2" width="15"/>
                                <span>No location selected! Enter a location in the search bar or use GPS to fetch weather data.</span>
                                <button type="button" className="btn-close float-end" data-bs-dismiss="alert"></button>
                            </div>
                            </>
                        }
                        {weatherData && !weatherData.marine.current[2][1] &&
                        <>
                        <div className="alert alert-warning alert-dismissable show">
                            <img src={warningLogo} className="bi me-2" width="15"/>
                            <span>Marine weather conditions not detected at this location.</span>
                            <button type="button" className="btn-close float-end" data-bs-dismiss="alert"></button>
                        </div>
                        </>
                        }
                        {weatherData && geoData && (
                            <PdfReport weatherData={weatherData} geoData={geoData} />
                        )}
                        <>
                            <div className="row row-cols-2 row-cols-md-4 row-gap-2 column-gap-2 mx-auto justify-content-center p-1">
                                {weatherData &&
                                <>
                                <ForecastButton
                                    safetynum={0}
                                    numval={weatherData ? weatherLookup[weatherData.forecast.current[8][1]].icon + " " + weatherData.forecast.current[2][1] : "N/A"}
                                    units={"°C"}
                                    text={"Feels like: " + (weatherData ?  weatherData.forecast.current[7][1]: "N/A") + "°C" }
                                    click={() =>setModalClick("Temperature")}
                                />
                                <ForecastButton
                                    safetynum={0}
                                    numval={weatherData ? weatherData.forecast.current[3][1] : "N/A"}
                                    units={"mm"}
                                    text={"Precipitation"}
                                    click={() =>setModalClick("Precipitation")}
                                />

                                <ForecastButton
                                    safetynum={safetyLookup("windSpeed", parseFloat(weatherData ? weatherData.forecast.current[4][1] : 0))}
                                    numval={weatherData ? weatherData.forecast.current[4][1] : "N/A"}
                                    units={"mph"}
                                    text={"Wind Speed"}
                                    click={() =>setModalClick("Wind Speed")}
                                />
                                <ForecastButton
                                    safetynum={0}
                                    // this needs to be an arrow graphic
                                    numval={weatherData ? weatherData.forecast.current[5][1] : "N/A"}
                                    units={"°"}
                                    text={"Wind Direction"}
                                    click={() =>setModalClick("Wind Direction")}
                                />
                                <ForecastButton
                                    safetynum={safetyLookup("windGust", parseFloat(weatherData ? weatherData.forecast.current[6][1] : 0))}
                                    numval={weatherData ? weatherData.forecast.current[6][1] : "N/A"}
                                    units={"mph"}
                                    text={"Wind Gusts"}
                                    click={() =>setModalClick("Wind Gusts")}
                                />
                                </>
                                }
                                {weatherData && weatherData.marine.current[2][1] &&
                                <>
                                <ForecastButton
                                    safetynum={safetyLookup("waveHeight", parseFloat(weatherData ? weatherData.marine.current[2][1] : 0))}
                                    numval={weatherData ? weatherData.marine.current[2][1] : "N/A"}
                                    units={"m"}
                                    text={"Wave Height"}
                                    click={() =>setModalClick("Wave Height")}
                                />
                                <ForecastButton
                                    safetynum={0}
                                    numval={weatherData ? weatherData.marine.current[3][1] : "N/A"}
                                    units={"°"}
                                    text={"Wave Direction"}
                                    click={() =>setModalClick("Wave Direction")}
                                />
                                <ForecastButton
                                    safetynum={0}
                                    numval={weatherData ? weatherData.marine.current[4][1] : "N/A"}
                                    units={"m"}
                                    text={"Sea Level Height"}
                                    click={() =>setModalClick("Sea Level Height")}
                                />
                                <ForecastButton
                                    safetynum={safetyLookup("seaTemp", parseFloat(weatherData ? weatherData.marine.current[5][1] : 0))}
                                    numval={weatherData ? weatherData.marine.current[5][1] : "N/A"}
                                    units={"°C"}
                                    text={"Sea Surface Temperature"}
                                    click={() =>setModalClick("Sea Surface Temperature")}
                                />
                                <ForecastButton
                                    safetynum={0}
                                    numval={weatherData ? weatherData.marine.current[6][1] : "N/A"}
                                    units={"°"}
                                    text={"Swell Direction"}
                                    click={() =>setModalClick("Swell Direction")}
                                />
                                <ForecastButton
                                    safetynum={safetyLookup("swellHeight", parseFloat(weatherData ? weatherData.marine.current[7][1] : 0))}
                                    numval={weatherData ? weatherData.marine.current[7][1] : "N/A"}
                                    units={"m"}
                                    text={"Swell Height"}
                                    click={() =>setModalClick("Swell Height")}
                                />
                                <ForecastButton
                                    safetynum={safetyLookup("wavePeriod", parseFloat(weatherData ? weatherData.marine.current[8][1] : 0))}
                                    numval={weatherData ? weatherData.marine.current[8][1] ?? "N/A" : "N/A"}
                                    units={"s"}
                                    text={"Wave Period"}
                                    click={() => setModalClick("Wave Period")}
                                />
                                <ForecastButton
                                    safetynum={safetyLookup("wavePeriod", parseFloat(weatherData ? weatherData.marine.current[9][1] : 0))}
                                    numval={weatherData ? weatherData.marine.current[9][1] ?? "N/A" : "N/A"}
                                    units={"s"}
                                    text={"Swell Period"}
                                    click={() => setModalClick("Swell Period")}
                                />
                                </>}
                            </div>
                            <div className='modal' id="fModal">
                                <div className="modal-dialog modal-lg modal-fullscreen-md-down">
                                    <div className='modal-content'>
                                        <div className='modal-header'>
                                             {modalClick && <h2 className="modal-title">{modalClick}</h2>}
                                             <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className='modal-body'>
                                            {weatherData && geoData && 
                                                <ForecastModal wData={weatherData} modalClick={modalClick}/>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    
                        <div id="LineChart" className={"hidden"}>
                            {weatherData &&(
                                <>
                                <ForecastButton
                                    safetynum={0}
                                    numval={weatherData.forecast.current[2][1]}
                                    units={"C"}
                                    text={"Temperature"}
                                    
                                />
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className="tab-pane" id="map">
                    <div className="container-fluid p-3">
                        <div className='h-100 w-100'>
                            <MapContainer center={geoData ?[parseFloat(geoData.latitude), parseFloat(geoData.longitude)] : [51.5, -0.1]} zoom={10} scrollWheelZoom={true} style={{height:"80vh"}}>
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                {geoData && (
                                <UpdateMap center={[parseFloat(geoData.latitude), parseFloat(geoData.longitude)]} />
                                )}
                            </MapContainer>
                        </div>
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
