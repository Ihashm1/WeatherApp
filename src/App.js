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
import CompassRose from './CompassRose';
import BeaufortGauge, { toBeaufort } from './BeaufortGauge';
import SunriseSunsetCard from './SunriseSunsetBar';
import TideSparkline from './TideSparkline';
import { UnitProvider, useUnits } from './UnitContext';
import './App.css';

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

const AppInner = () => {
    const [geoData, setGeoData] = useState('');
    const [weatherData, setWeatherData] = useState('');
    const [modalClick, setModalClick] = useState(null);
    const { convertTemp, tempLabel, convertSpeed, speedLabel, convertHeight, heightLabel,
            tempUnit, setTempUnit, speedUnit, setSpeedUnit, heightUnit, setHeightUnit } = useUnits();

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

    const weatherCode = weatherData ? weatherData.forecast.current[8][1] : null;
    const bgClass = (() => {
        if (weatherCode === null) return '';
        if ([0,1].includes(weatherCode)) return 'weather-bg-sunny';
        if ([2,3].includes(weatherCode)) return 'weather-bg-cloudy';
        if ([45,48].includes(weatherCode)) return 'weather-bg-fog';
        if ([51,53,55,56,57,61,63,65,66,67,80,81,82].includes(weatherCode)) return 'weather-bg-rain';
        if ([71,73,75,77,85,86].includes(weatherCode)) return 'weather-bg-snow';
        if ([95,96,99].includes(weatherCode)) return 'weather-bg-storm';
        return '';
    })();

    return (
        <>
        <div className={`container-fluid p-0 pb-5 ${bgClass}`} style={{minHeight:"100vh",backgroundColor:"#cbd2e3"}}>
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
                    <div className="container p-4">
                        <h5 className="mb-3">Units</h5>
                        <div className="mb-3">
                            <label className="form-label fw-semibold">Temperature</label>
                            <div className="btn-group d-block">
                                <button className={`btn btn-sm ${tempUnit==='C'?'btn-dark':'btn-outline-secondary'}`} onClick={()=>setTempUnit('C')}>°C</button>
                                <button className={`btn btn-sm ${tempUnit==='F'?'btn-dark':'btn-outline-secondary'}`} onClick={()=>setTempUnit('F')}>°F</button>
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-semibold">Wind Speed</label>
                            <div className="btn-group d-block">
                                <button className={`btn btn-sm ${speedUnit==='mph'?'btn-dark':'btn-outline-secondary'}`} onClick={()=>setSpeedUnit('mph')}>mph</button>
                                <button className={`btn btn-sm ${speedUnit==='kph'?'btn-dark':'btn-outline-secondary'}`} onClick={()=>setSpeedUnit('kph')}>kph</button>
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-semibold">Height / Distance</label>
                            <div className="btn-group d-block">
                                <button className={`btn btn-sm ${heightUnit==='m'?'btn-dark':'btn-outline-secondary'}`} onClick={()=>setHeightUnit('m')}>m</button>
                                <button className={`btn btn-sm ${heightUnit==='ft'?'btn-dark':'btn-outline-secondary'}`} onClick={()=>setHeightUnit('ft')}>ft</button>
                            </div>
                        </div>
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
                                {/* Temperature card — clean, no sunrise bar */}
                                <button
                                    onClick={() => setModalClick("Temperature")}
                                    style={{height:"40vw", width:"40vw", maxWidth:"180px", maxHeight:"180px", backgroundColor:"rgba(186,250,255,1)"}}
                                    className="btn shadow-sm rounded-5 p-0"
                                    type="button" data-bs-toggle="modal" data-bs-target="#fModal"
                                >
                                    <div className="row w-100 h-100 text-center align-items-center mx-auto p-0 row-cols-1">
                                        <h1 className="col mx-auto fw-semibold">{weatherLookup[weatherData.forecast.current[8][1]].icon} {convertTemp(weatherData.forecast.current[2][1])}{tempLabel()}</h1>
                                        <h5 className="col mx-auto">Feels like: {convertTemp(weatherData.forecast.current[7][1])}{tempLabel()}</h5>
                                    </div>
                                </button>
                                <ForecastButton
                                    safetynum={0}
                                    numval={weatherData ? weatherData.forecast.current[3][1] : "N/A"}
                                    units={"mm"}
                                    text={"Precipitation"}
                                    click={() =>setModalClick("Precipitation")}
                                />

                                {/* Sunrise / Sunset standalone card — display only, no modal */}
                                <SunriseSunsetCard
                                    sunrise={weatherData.forecast.daily[4][1]?.[0]}
                                    sunset={weatherData.forecast.daily[9]?.[1]?.[0]}
                                    bgColor="rgba(186,250,255,1)"
                                />

                                {/* Wind Speed with Beaufort gauge */}
                                <button
                                    onClick={() => setModalClick("Wind Speed")}
                                    style={{height:"40vw", width:"40vw", maxWidth:"180px", maxHeight:"180px",
                                            backgroundColor: ["rgba(186,250,255,1)","rgba(204,255,186,1)","rgba(255,241,183,1)","rgba(255,185,164,1)"][safetyLookup("windSpeed", parseFloat(weatherData.forecast.current[4][1]))]}}
                                    className="btn shadow-sm rounded-5 p-0"
                                    type="button" data-bs-toggle="modal" data-bs-target="#fModal"
                                >
                                    <div className="d-flex flex-column align-items-center justify-content-center h-100 w-100" style={{gap:"1px",padding:"6px"}}>
                                        <BeaufortGauge mph={parseFloat(weatherData.forecast.current[4][1])} size={86} />
                                        <span style={{fontSize:"0.82rem",fontWeight:800,lineHeight:1}}>Bft {toBeaufort(parseFloat(weatherData.forecast.current[4][1]))}</span>
                                        <span className="fw-bold" style={{fontSize:"0.85rem",lineHeight:1}}>{convertSpeed(weatherData.forecast.current[4][1])} {speedLabel()}</span>
                                        <small style={{fontSize:"0.72rem",color:"rgba(0,0,0,0.55)"}}>Wind Speed</small>
                                    </div>
                                </button>

                                {/* Wind Direction with compass + degrees */}
                                <button
                                    onClick={() => setModalClick("Wind Direction")}
                                    style={{height:"40vw", width:"40vw", maxWidth:"180px", maxHeight:"180px", backgroundColor:"rgba(186,250,255,1)"}}
                                    className="btn shadow-sm rounded-5 p-0"
                                    type="button" data-bs-toggle="modal" data-bs-target="#fModal"
                                >
                                    <div className="d-flex flex-column align-items-center justify-content-center h-100 w-100" style={{gap:"2px",padding:"6px"}}>
                                        <CompassRose degrees={weatherData.forecast.current[5][1]} size={76} />
                                        <span className="fw-bold" style={{fontSize:"0.85rem",lineHeight:1}}>{weatherData.forecast.current[5][1]}°</span>
                                        <small style={{fontSize:"0.72rem",color:"rgba(0,0,0,0.55)"}}>Wind Direction</small>
                                    </div>
                                </button>

                                {/* Wind Gusts with Beaufort gauge */}
                                <button
                                    onClick={() => setModalClick("Wind Gusts")}
                                    style={{height:"40vw", width:"40vw", maxWidth:"180px", maxHeight:"180px",
                                            backgroundColor: ["rgba(186,250,255,1)","rgba(204,255,186,1)","rgba(255,241,183,1)","rgba(255,185,164,1)"][safetyLookup("windGust", parseFloat(weatherData.forecast.current[6][1]))]}}
                                    className="btn shadow-sm rounded-5 p-0"
                                    type="button" data-bs-toggle="modal" data-bs-target="#fModal"
                                >
                                    <div className="d-flex flex-column align-items-center justify-content-center h-100 w-100" style={{gap:"1px",padding:"6px"}}>
                                        <BeaufortGauge mph={parseFloat(weatherData.forecast.current[6][1])} size={86} />
                                        <span style={{fontSize:"0.82rem",fontWeight:800,lineHeight:1}}>Bft {toBeaufort(parseFloat(weatherData.forecast.current[6][1]))}</span>
                                        <span className="fw-bold" style={{fontSize:"0.85rem",lineHeight:1}}>{convertSpeed(weatherData.forecast.current[6][1])} {speedLabel()}</span>
                                        <small style={{fontSize:"0.72rem",color:"rgba(0,0,0,0.55)"}}>Wind Gusts</small>
                                    </div>
                                </button>
                                </>
                                }
                                {weatherData && weatherData.marine.current[2][1] &&
                                <>
                                <ForecastButton
                                    safetynum={safetyLookup("waveHeight", parseFloat(weatherData.marine.current[2][1]))}
                                    numval={convertHeight(weatherData.marine.current[2][1])}
                                    units={heightLabel()}
                                    text={"Wave Height"}
                                    click={() =>setModalClick("Wave Height")}
                                />
                                {/* Wave Direction with compass + degrees */}
                                <button
                                    onClick={() => setModalClick("Wave Direction")}
                                    style={{height:"40vw", width:"40vw", maxWidth:"180px", maxHeight:"180px", backgroundColor:"rgba(186,250,255,1)"}}
                                    className="btn shadow-sm rounded-5 p-0"
                                    type="button" data-bs-toggle="modal" data-bs-target="#fModal"
                                >
                                    <div className="d-flex flex-column align-items-center justify-content-center h-100 w-100" style={{gap:"2px",padding:"6px"}}>
                                        <CompassRose degrees={weatherData.marine.current[3][1]} size={76} />
                                        <span className="fw-bold" style={{fontSize:"0.85rem",lineHeight:1}}>{weatherData.marine.current[3][1]}°</span>
                                        <small style={{fontSize:"0.72rem",color:"rgba(0,0,0,0.55)"}}>Wave Direction</small>
                                    </div>
                                </button>

                                {/* Sea Level Height with tide sparkline */}
                                <button
                                    onClick={() => setModalClick("Sea Level Height")}
                                    style={{height:"40vw", width:"40vw", maxWidth:"180px", maxHeight:"180px", backgroundColor:"rgba(186,250,255,1)"}}
                                    className="btn shadow-sm rounded-5 p-0"
                                    type="button" data-bs-toggle="modal" data-bs-target="#fModal"
                                >
                                    <div className="d-flex flex-column align-items-center justify-content-center h-100 w-100 px-2">
                                        <h1 className="fw-semibold mb-0">{convertHeight(weatherData.marine.current[4][1])}{heightLabel()}</h1>
                                        <small className="mb-1">Sea Level Height</small>
                                        <TideSparkline
                                            values={weatherData.marine.hourly[2][1]}
                                            times={weatherData.marine.hourly[0][1]}
                                            size={{w:130, h:36}}
                                        />
                                    </div>
                                </button>

                                <ForecastButton
                                    safetynum={safetyLookup("seaTemp", parseFloat(weatherData.marine.current[5][1]))}
                                    numval={convertTemp(weatherData.marine.current[5][1])}
                                    units={tempLabel()}
                                    text={"Sea Surface Temperature"}
                                    click={() =>setModalClick("Sea Surface Temperature")}
                                />

                                {/* Swell Direction with compass + degrees */}
                                <button
                                    onClick={() => setModalClick("Swell Direction")}
                                    style={{height:"40vw", width:"40vw", maxWidth:"180px", maxHeight:"180px", backgroundColor:"rgba(186,250,255,1)"}}
                                    className="btn shadow-sm rounded-5 p-0"
                                    type="button" data-bs-toggle="modal" data-bs-target="#fModal"
                                >
                                    <div className="d-flex flex-column align-items-center justify-content-center h-100 w-100" style={{gap:"2px",padding:"6px"}}>
                                        <CompassRose degrees={weatherData.marine.current[6][1]} size={76} />
                                        <span className="fw-bold" style={{fontSize:"0.85rem",lineHeight:1}}>{weatherData.marine.current[6][1]}°</span>
                                        <small style={{fontSize:"0.72rem",color:"rgba(0,0,0,0.55)"}}>Swell Direction</small>
                                    </div>
                                </button>

                                <ForecastButton
                                    safetynum={safetyLookup("swellHeight", parseFloat(weatherData.marine.current[7][1]))}
                                    numval={convertHeight(weatherData.marine.current[7][1])}
                                    units={heightLabel()}
                                    text={"Swell Height"}
                                    click={() =>setModalClick("Swell Height")}
                                />
                                <ForecastButton
                                    safetynum={safetyLookup("wavePeriod", parseFloat(weatherData.marine.current[8][1] ?? 0))}
                                    numval={weatherData.marine.current[8][1] ?? "N/A"}
                                    units={"s"}
                                    text={"Wave Period"}
                                    click={() => setModalClick("Wave Period")}
                                />
                                <ForecastButton
                                    safetynum={safetyLookup("wavePeriod", parseFloat(weatherData.marine.current[9][1] ?? 0))}
                                    numval={weatherData.marine.current[9][1] ?? "N/A"}
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

const App = () => (
    <UnitProvider>
        <AppInner />
    </UnitProvider>
);

export default App;
