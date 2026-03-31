import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import Weather from './Weather';
import Geocoding from './Geocoding';
import ForecastButton from './forecastButton';
import settingsLogo from './images/gear-solid.svg';
import calendarLogo from './images/calendar-regular.svg';
import mapLogo from './images/map-regular.svg';
import warningLogo from './images/triangle-exclamation-solid.svg';
import wavesImg from './images/waves.jpeg';
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
    const [DModeFlag, setDModeFlag] = useState(false);
    const [boatLength, setBoatLength] = useState('');
    const [freeboard, setFreeboard] = useState('');
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

            const getSailingRecommendation = () => {

                if (!weatherData || !weatherData.marine.current[2][1]) return null;
                if (!boatLength || !freeboard) return { level: 0, reasons: [] };

                const wind   = parseFloat(weatherData.forecast.current[4][1]);
                const gusts  = parseFloat(weatherData.forecast.current[6][1]);
                const waves  = parseFloat(weatherData.marine.current[2][1]);
                const swell  = parseFloat(weatherData.marine.current[7][1]);
                const wavePeriod  = parseFloat(weatherData.marine.current[8][1]);
                const swellPeriod = parseFloat(weatherData.marine.current[9][1]);
                const length = parseFloat(boatLength);
                const fb     = parseFloat(freeboard);
                

                let reasons = [];

                // Extreme Conditions (Level 3)
                if (waves > length * 0.5) reasons.push("waves too large for vessel >1/2 length");
                if (waves > fb) reasons.push("waves exceed freeboard");
                if (wind > 38) reasons.push("extreme winds");
                if (gusts > 50) reasons.push("extreme gusts");
                if (swell > 4) reasons.push("dangerous swell");
                if (wavePeriod < 4) reasons.push("very short wave period (rough sea)");
                if (swellPeriod > 14) reasons.push("very long swell period");

                if (reasons.length > 0) return { level: 3, reasons };

                // Moderate Conditions (Level 2)
                if (waves > length * 0.33) reasons.push("waves challenging for vessel length");
                if (waves > fb * 0.75) reasons.push("waves near freeboard");
                if (wind > 24) reasons.push("strong winds");
                if (gusts > 37) reasons.push("strong gusts");
                if (swell > 2) reasons.push("large swell");
                if (wavePeriod < 6) reasons.push("choppy wave conditions (low wave period)");
                if (swellPeriod > 12) reasons.push("Quite a long-period swell");

                if (reasons.length > 0) return { level: 2, reasons };

                // Safe Conditions (Level 1)
                return { level: 1, reasons: [] };
            };



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
        <div className='container-fluid p-0 pb-5' style={{minHeight:"100vh", backgroundColor: DModeFlag ? "rgba(35, 65, 120, 0.7)" : "rgba(203, 210, 227, 0.7)"}}>
            <div className="p-3 pb-1">
                <Geocoding sendData={setGeoData} darkMode={DModeFlag}/>
                    {geoData && (
                    <>
                    <Weather
                        sendData={setWeatherData}
                        latitude={geoData.latitude}
                        longitude={geoData.longitude}
                        unitflag={WindUnitFlag}
                    />
                    </>
                )}
            </div>
 
     
            <div className='tab-content pb-4' id="app-tabcontent" style={{color: DModeFlag?"whitesmoke":"black"}}>
                <div className="tab-pane p-3" id="settings">
                    <div className={DModeFlag ? "card mx-auto p-3 m-2 bg-dark" : "card mx-auto p-3 m-2 bg-light"} style={{color: DModeFlag?"whitesmoke":"black"}}>
                        <h3>Settings</h3>
                        <div className="d-grid gap-3" >
                            <div className="form-check form-switch">
                                <input className="form-check-input" type="checkbox" id="DarkmodeSwitchCheck" onClick={() => setDModeFlag(!DModeFlag)}></input>
                                <label className="form-check-label" htmlFor="DarkmodeSwitchCheck">Dark Mode</label>
                            </div>
                            <div>
                                <h4>Wind Speed Units:</h4>
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name="WindUnitRadios" id="WindUnitRadios1" onClick={() => setWindUnitFlag(false)} defaultChecked></input>
                                    <label className="form-check-label" htmlFor="WindUnitRadios1">
                                        MPH
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name="WindUnitRadios" id="WindUnitRadios2" onClick={() => setWindUnitFlag(true)}></input>
                                    <label className="form-check-label" htmlFor="WindUnitRadios2">
                                        Knots
                                    </label>
                                </div>
                            </div>
                            <div>
                                <h4>Boat Size:</h4>
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name="BoatSizeRadios" id="BoatSizeRadios1" onClick={() => setBoatSizeFlag(true)} defaultChecked></input>
                                    <label className="form-check-label" htmlFor="BoatSizeRadios1">
                                        Passenger ship
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name="BoatSizeRadios" id="BoatSizeRadios2" onClick={() => setBoatSizeFlag(false)}></input>
                                    <label className="form-check-label" htmlFor="BoatSizeRadios2">
                                        Cargo ship
                                    </label>
                                </div>
                            <div>
                                <h4>Vessel Settings:</h4>
                                <div>
                                  <p> Boat length: (metres)</p>
                                  <input
                                    type="number"
                                    placeholder = "0"
                                    value = {boatLength}
                                    onChange={(e) => setBoatLength(e.target.value)}
                                    />

                                    <p>Freeboard Height: (metres)</p>
                                        <input
                                        type ="number"
                                        placeholder = "0"
                                        value={freeboard}
                                        onChange={(e) => setFreeboard(e.target.value)}
                                        />

                                </div>

                            </div>
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
                            <PdfReport weatherData={weatherData} geoData={geoData} darkMode={DModeFlag}/>
                        )}
                        <>
                            <div className="row row-cols-2 row-cols-md-4 row-gap-2 column-gap-2 mx-auto justify-content-center p-1">
                                {weatherData &&
                                <>
                                {/* Temperature card — clean, no sunrise bar */}
                                <button
                                    onClick={() => setModalClick("Temperature")}
                                    style={{height:"40vw", width:"40vw", maxWidth:"180px", maxHeight:"180px", backgroundColor: DModeFlag ? "rgb(110,164,168)" : "rgba(186,250,255,1)"}}
                                    className="btn shadow-sm rounded-5 p-0"
                                    type="button" data-bs-toggle="modal" data-bs-target="#fModal"
                                >
                                    <div className="row w-100 h-100 text-center align-items-center mx-auto p-0 row-cols-1" style={{color: DModeFlag ? "white" : "inherit"}}>
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
                                    darkMode={DModeFlag}
                                />

                                <ForecastButton
                                    safetynum={safetyLookup("windSpeed", parseFloat(weatherData ? weatherData.forecast.current[4][1] : 0))}
                                    numval={weatherData ? weatherData.forecast.current[4][1] : "N/A"}
                                    units={WindUnitFlag?"kn":"mph"}
                                    text={"Wind Speed"}
                                    click={() =>WindUnitFlag?setModalClick("Wind Speed(kn)"):setModalClick("Wind Speed(mph)")}
                                    darkMode={DModeFlag}
                                />
                                <ForecastButton
                                    safetynum={0}
                                    // this needs to be an arrow graphic
                                    numval={weatherData ? weatherData.forecast.current[5][1] : "N/A"}
                                    units={"°"}
                                    text={"Wind Direction"}
                                    click={() =>setModalClick("Wind Direction")}
                                    darkMode={DModeFlag}
                                />
                                <ForecastButton
                                    safetynum={safetyLookup("windGust", parseFloat(weatherData ? weatherData.forecast.current[6][1] : 0))}
                                    numval={weatherData ? weatherData.forecast.current[6][1] : "N/A"}
                                    units={WindUnitFlag?"kn":"mph"}
                                    text={"Wind Gusts"}
                                    click={() =>WindUnitFlag?setModalClick("Wind Gusts(kn)"):setModalClick("Wind Gusts(mph)")}
                                    darkMode={DModeFlag}
                                />
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
                                    darkMode={DModeFlag}
                                />
                                {/* Wave Direction */}
                                <button
                                    onClick={() => setModalClick("Wave Direction")}
                                    style={{height:"40vw", width:"40vw", maxWidth:"180px", maxHeight:"180px", backgroundColor: DModeFlag ? "rgb(110,164,168)" : "rgba(186,250,255,1)"}}
                                    className="btn shadow-sm rounded-5 p-0"
                                    type="button" data-bs-toggle="modal" data-bs-target="#fModal"
                                >
                                    <div className="d-flex flex-column align-items-center justify-content-center h-100 w-100" style={{gap:"2px",padding:"6px",color: DModeFlag ? "white" : "inherit"}}>
                                        <CompassRose degrees={weatherData.marine.current[3][1]} size={76} />
                                        <span className="fw-bold" style={{fontSize:"1rem",lineHeight:1}}>{weatherData.marine.current[3][1]}°</span>
                                        <small style={{fontSize:"0.72rem",color: DModeFlag ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,0.55)"}}>Wave Direction</small>
                                    </div>
                                </button>

                                {/* Sea Level Height with tide sparkline */}
                                <button
                                    onClick={() => setModalClick("Sea Level Height")}
                                    style={{height:"40vw", width:"40vw", maxWidth:"180px", maxHeight:"180px", backgroundColor: DModeFlag ? "rgb(110,164,168)" : "rgba(186,250,255,1)"}}
                                    className="btn shadow-sm rounded-5 p-0"
                                    type="button" data-bs-toggle="modal" data-bs-target="#fModal"
                                >
                                    <div className="d-flex flex-column align-items-center justify-content-center h-100 w-100 px-2" style={{color: DModeFlag ? "white" : "inherit"}}>
                                        <h1 className="fw-semibold mb-0">{convertHeight(weatherData.marine.current[4][1])}{heightLabel()}</h1>
                                        <TideSparkline
                                            values={weatherData.marine.hourly[2][1]}
                                            times={weatherData.marine.hourly[0][1]}
                                            size={{w:130, h:36}}
                                        />
                                        <small>Sea Level Height</small>
                                    </div>
                                </button>

                                <ForecastButton
                                    safetynum={safetyLookup("seaTemp", parseFloat(weatherData.marine.current[5][1]))}
                                    numval={convertTemp(weatherData.marine.current[5][1])}
                                    units={tempLabel()}
                                    text={"Sea Surface Temperature"}
                                    click={() =>setModalClick("Sea Surface Temperature")}
                                    darkMode={DModeFlag}
                                />

                                {/* Swell Direction */}
                                <button
                                    onClick={() => setModalClick("Swell Direction")}
                                    style={{height:"40vw", width:"40vw", maxWidth:"180px", maxHeight:"180px", backgroundColor: DModeFlag ? "rgb(110,164,168)" : "rgba(186,250,255,1)"}}
                                    className="btn shadow-sm rounded-5 p-0"
                                    type="button" data-bs-toggle="modal" data-bs-target="#fModal"
                                >
                                    <div className="d-flex flex-column align-items-center justify-content-center h-100 w-100" style={{gap:"2px",padding:"6px",color: DModeFlag ? "white" : "inherit"}}>
                                        <CompassRose degrees={weatherData.marine.current[6][1]} size={76} />
                                        <span className="fw-bold" style={{fontSize:"1rem",lineHeight:1}}>{weatherData.marine.current[6][1]}°</span>
                                        <small style={{fontSize:"0.72rem",color: DModeFlag ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,0.55)"}}>Swell Direction</small>
                                    </div>
                                </button>

                                <ForecastButton
                                    safetynum={safetyLookup("swellHeight", parseFloat(weatherData.marine.current[7][1]))}
                                    numval={convertHeight(weatherData.marine.current[7][1])}
                                    units={heightLabel()}
                                    text={"Swell Height"}
                                    click={() =>setModalClick("Swell Height")}
                                    darkMode={DModeFlag}
                                />
                                <ForecastButton
                                    safetynum={safetyLookup("wavePeriod", parseFloat(weatherData.marine.current[8][1] ?? 0))}
                                    numval={weatherData.marine.current[8][1] ?? "N/A"}
                                    units={"s"}
                                    text={"Wave Period"}
                                    click={() => setModalClick("Wave Period")}
                                    darkMode={DModeFlag}
                                />
                                <ForecastButton
                                    safetynum={safetyLookup("wavePeriod", parseFloat(weatherData.marine.current[9][1] ?? 0))}
                                    numval={weatherData.marine.current[9][1] ?? "N/A"}
                                    units={"s"}
                                    text={"Swell Period"}
                                    click={() => setModalClick("Swell Period")}
                                    darkMode={DModeFlag}
                                />
                                </>}
                            </div>
                        </>



                        
                        {weatherData && weatherData.marine.current[2][1] && (() => {
                            const result = getSailingRecommendation();
                            if (result === null) return null;

                            const level = result.level;
                            const reason = result.reasons.join(", ");

                            const colours  = ['rgba(186,250,255,1)', 'rgba(204,255,186,1)', 'rgba(255,241,183,1)', 'rgba(255,185,164,1)'];
                            const coloursDark = ["rgb(110, 164, 168)", "rgb(129, 168, 113)", "rgb(181, 166, 115)", "rgb(165, 110, 93)"];
                            const messages = ['Set your vessel details in Settings for a sailing recommendation.', '✅ Good sailing conditions', '⚠️ Challenging, sail with care', '❗ Dangerous,  not recommended'];
                            return (
                                <div style={{backgroundColor: DModeFlag? coloursDark[level] : colours[level], marginTop: '100px'}} className="p-3 rounded-4 shadow-sm text-center text-dark">
                                    <h5>{messages[level]}</h5>
                                    {reason && <p className="mb-0">Due to: {reason}</p>}
                                </div>
                            );
                        })()}


                    
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
        {/*
          Modal is intentionally placed OUTSIDE the main container-fluid div.
          That div has backdropFilter:"blur(1px)" which creates a CSS stacking context.
          Any position:fixed element (like a modal) is trapped inside that context, while
          Bootstrap appends the .modal-backdrop to <body> which is outside it — so the
          backdrop ends up rendered ON TOP of the modal, blocking all clicks.
          Keeping the modal here at the root fragment level fixes the z-index ordering.
          tabIndex="-1" is required by Bootstrap 5 for keyboard focus-trapping to work.
        */}
        <div className='modal' id="fModal" tabIndex="-1">
            <div className="modal-dialog modal-lg modal-fullscreen-md-down">
                <div className={DModeFlag ? 'modal-content bg-dark text-light' : 'modal-content bg-light'}>
                    <div className={DModeFlag ? 'modal-header text-light' : 'modal-header text-dark'}>
                        {modalClick && <h2 className="modal-title fw-bold">{modalClick}</h2>}
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" data-bs-theme={DModeFlag ? "dark" : "light"}></button>
                    </div>
                    <div className={DModeFlag ? 'modal-body text-light' : 'modal-body text-dark'}>
                        {weatherData && geoData &&
                            <ForecastModal wData={weatherData} modalClick={modalClick} darkMode={DModeFlag}/>
                        }
                    </div>
                </div>
            </div>
        </div>
        <div>
            <nav className={DModeFlag ? "navbar fixed-bottom bg-dark justify-content-center" : "navbar fixed-bottom bg-light justify-content-center"}>
                <ul className="nav nav-pills justify-content-center row" role="tablist">
                    <li className={DModeFlag ? "nav-item text-light col justify-content-center text-center bg-dark" : "nav-item nav-light col justify-content-center text-center"}>
                        <a className="nav-link" data-bs-toggle="pill" data-bs-target="#settings" type="button"><img src={settingsLogo} style={DModeFlag ?{height:'20px',filter:'invert(100%)'}:{height:'20px'}}/></a>
                        <small>Settings</small>
                    </li>
                    <li className={DModeFlag ? "nav-item text-light col justify-content-center text-center" : "nav-item nav-light col justify-content-center text-center"}>
                        <a className="nav-link active mx-auto" data-bs-toggle="pill" data-bs-target="#forecasts" type="button"><img src={calendarLogo} style={DModeFlag ?{height:'20px',filter:'invert(100%)'}:{height:'20px'}}/></a>
                        <small>Forecasts</small>
                    </li>
                    <li className={DModeFlag ? "nav-item text-light col justify-content-center text-center" : "nav-item nav-light col justify-content-center text-center"}>
                        <a className="nav-link" data-bs-toggle="pill" data-bs-target="#map" type="button"><img src={mapLogo} style={DModeFlag ?{height:'20px',filter:'invert(100%)'}:{height:'20px'}}/></a>
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
