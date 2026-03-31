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

    //data received from geocoding and weather components
    const [geoData, setGeoData] = useState('');
    const [weatherData, setWeatherData] = useState('');

    //UI state variables
    const [modalClick, setModalClick] = useState(null);
    const [DModeFlag, setDModeFlag] = useState(false);
    const [WindUnitFlag, setWindUnitFlag] = useState(false);
    const [BoatSizeFlag, setBoatSizeFlag] = useState(false);
    const [TempUnitFlag, setTempUnitFlag] = useState(false); // false = °C, true = °F

    const toTemp = (c) => TempUnitFlag ? Math.round((parseFloat(c) * 9/5 + 32) * 10) / 10 : c;
    const tempUnit = TempUnitFlag ? '°F' : '°C';

    const [recentSearches, setRecentSearches] = useState(() => {
        try { return JSON.parse(localStorage.getItem('recentSearches') || '[]'); }
        catch { return []; }
    });
    const addRecentSearch = (item) => {
        setRecentSearches(prev => {
            const filtered = prev.filter(r => r.id !== item.id);
            const updated = [item, ...filtered].slice(0, 3);
            localStorage.setItem('recentSearches', JSON.stringify(updated));
            return updated;
        });
    };
    const removeRecentSearch = (id) => {
        setRecentSearches(prev => {
            const updated = prev.filter(r => r.id !== id);
            localStorage.setItem('recentSearches', JSON.stringify(updated));
            return updated;
        });
    };

    //vessel details set in settings
    const [boatLength, setBoatLength] = useState('');
    const [freeboard, setFreeboard] = useState('');

    //lookup tables for weather codes
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

    //converts weather parameters into safety levels for sailing recommendation
    // 0 = safe or no value, 1 = acceptable, 2 = caution advised, 3 = dangerous
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
            //generates sailing recommendation based on weather conditions and vessel details, returns safety level and reasons for caution
            const getSailingRecommendation = () => {

                //check if weather data and vessel details are available
                if (!weatherData || !weatherData.marine.current[2][1]) return null;
                if (!boatLength || !freeboard) return { level: 0, reasons: [] };

                //extract relevant weather parameters
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


    //component to update the map view and marker based on selected location
    function UpdateMap(props) {
        const map = useMap();

        useEffect(() => {
            map.flyTo(props.center, 10);}, [props.center[0], props.center[1]]); // only run when lat/lng changes

            return (
                <Marker position={props.center}/>
            );
    }
//normal: #cbd2e3
//dark bg: #234178

    //main app component
    return (
        <>
        <div className='container-fluid p-0 pb-5' style={{minHeight:"100vh", backgroundColor: DModeFlag ? "rgba(35, 65, 120, 0.7)" : "rgba(203, 210, 227, 0.7)"}}>
            {/* Geocoding search bar and current weather display */}
            <div className="p-3 pb-1">
                <Geocoding sendData={setGeoData} darkMode={DModeFlag} onSelect={addRecentSearch}/>
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
 
            {/* Tab content for settings, forecasts, and map */}
            <div className='tab-content pb-4' id="app-tabcontent" style={{color: DModeFlag?"whitesmoke":"black"}}>
                <div className="tab-pane p-3" id="settings">
                    <div className={DModeFlag ? "card mx-auto p-3 m-2 bg-dark" : "card mx-auto p-3 m-2 bg-light"} style={{color: DModeFlag?"whitesmoke":"black"}}>
                        <h3>Settings</h3>
                        <div className="d-grid gap-3" >

                            {/* Dark mode toggle, wind speed unit selection, and vessel dimension settings */}
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

                                <div>
                                    <h4>Temperature Units:</h4>
                                    <div className="form-check">
                                        <input className="form-check-input" type="radio" name="TempUnitRadios" id="TempUnitRadios1" onClick={() => setTempUnitFlag(false)} defaultChecked></input>
                                        <label className="form-check-label" htmlFor="TempUnitRadios1">°C (Celsius)</label>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input" type="radio" name="TempUnitRadios" id="TempUnitRadios2" onClick={() => setTempUnitFlag(true)}></input>
                                        <label className="form-check-label" htmlFor="TempUnitRadios2">°F (Fahrenheit)</label>
                                    </div>
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

                {/* Forecast tab with weather variables displayed as buttons, which open modals with more detailed information. Also includes a sailing recommendation based on weather conditions and vessel details. */}
                <div className='tab-pane show active' id="forecasts">
                    <div className={"container-fluid p-3"}>
                        {!geoData &&
                            <>

                            {/* Alert prompting user to select a location if no geocoding data is available */}
                            <div className='alert alert-info alert-dismissable show'>
                                <img src={warningLogo} className="bi me-2" width="15"/>
                                <span>No location selected! Enter a location in the search bar or use GPS to fetch weather data.</span>
                                <button type="button" className="btn-close float-end" data-bs-dismiss="alert"></button>
                            </div>
                            </>
                        }
                        {weatherData && !weatherData.marine.current[2][1] &&
                        <>

                        {/* Alert indicating that marine weather data is not available for the selected location */}
                        <div className="alert alert-warning alert-dismissable show">
                            <img src={warningLogo} className="bi me-2" width="15"/>
                            <span>Marine weather conditions not detected at this location.</span>
                            <button type="button" className="btn-close float-end" data-bs-dismiss="alert"></button>
                        </div>
                        </>
                        }
                        {/* Button to generate PDF report of current weather conditions, only shown if weather and geocoding data are available */}
                        {recentSearches.length > 0 && (
                            <div className="mb-3">
                                <h5 className={DModeFlag ? "fw-bold text-light mb-2" : "fw-bold text-dark mb-2"} style={{letterSpacing:'0.03em'}}>Recent Searches</h5>
                                <div className="d-flex flex-wrap gap-2 justify-content-start">
                                    {recentSearches.map((item) => (
                                        <button
                                            key={item.id}
                                            type="button"
                                            className={DModeFlag ? "btn btn-dark rounded-pill px-4 py-2" : "btn btn-light rounded-pill px-4 py-2 shadow-sm"}
                                            style={{fontSize:'0.95rem', display:'flex', alignItems:'center', gap:'8px', maxWidth:'240px'}}
                                            title={item.name + ", " + item.admin1 + ", " + item.country}
                                            onClick={() => { setGeoData(item); addRecentSearch(item); }}
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                                            <span style={{overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{item.name}, {item.admin1}</span>
                                            <span
                                                onClick={(e) => { e.stopPropagation(); removeRecentSearch(item.id); }}
                                                style={{display:'inline-flex', alignItems:'center', justifyContent:'center', width:'20px', height:'20px', borderRadius:'50%', background:'rgba(0,0,0,0.15)', fontSize:'12px', flexShrink:0}}
                                            >✕</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        {weatherData && geoData && (
                            <PdfReport weatherData={weatherData} geoData={geoData} darkMode={DModeFlag} tempUnitFlag={TempUnitFlag}/>
                        )}
                        <>
                            {/*forecast metric buttons displayed in a grid*/}
                            <div className="row row-cols-2 row-cols-md-4 row-gap-2 column-gap-2 mx-auto justify-content-center p-1">
                                {weatherData &&
                                <>
                                {/*temperature button with weather icon, opens modal with detailed forecast information*/}
                                <ForecastButton
                                    
                                    safetynum={0}
                                    numval={weatherData ? weatherLookup[weatherData.forecast.current[8][1]].icon + " " + toTemp(weatherData.forecast.current[2][1]) : "N/A"}
                                    units={tempUnit}
                                    text={"Feels like: " + (weatherData ? toTemp(weatherData.forecast.current[7][1]) : "N/A") + tempUnit }
                                    click={() =>setModalClick("Temperature")}
                                    darkMode={DModeFlag}
                                />
                                {/*precipitation button, opens modal with detailed forecast information*/}
                                <ForecastButton
                                    safetynum={0}
                                    numval={weatherData ? weatherData.forecast.current[3][1] : "N/A"}
                                    units={"mm"}
                                    text={"Precipitation"}
                                    click={() =>setModalClick("Precipitation")}
                                    darkMode={DModeFlag}
                                />
                                
                                {/*wind speed button*/}
                                <ForecastButton
                                    safetynum={safetyLookup("windSpeed", parseFloat(weatherData ? weatherData.forecast.current[4][1] : 0))}
                                    numval={weatherData ? weatherData.forecast.current[4][1] : "N/A"}
                                    units={WindUnitFlag?"kn":"mph"}
                                    text={"Wind Speed"}
                                    click={() =>WindUnitFlag?setModalClick("Wind Speed(kn)"):setModalClick("Wind Speed(mph)")}
                                    darkMode={DModeFlag}
                                />
                    
                                {/*wind direction button*/}
                                <ForecastButton
                                    safetynum={0}
                                    numval={weatherData ? weatherData.forecast.current[5][1] : "N/A"}
                                    units={"°"}
                                    text={"Wind Direction"}
                                    direction={weatherData ? weatherData.forecast.current[5][1] : null}
                                    click={() =>setModalClick("Wind Direction")}
                                    darkMode={DModeFlag}
                                />

                                {/**gust speed button*/}
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

                                {/*wave height button*/}
                                <ForecastButton
                                    safetynum={safetyLookup("waveHeight", parseFloat(weatherData ? weatherData.marine.current[2][1] : 0))}
                                    numval={weatherData ? weatherData.marine.current[2][1] : "N/A"}
                                    units={"m"}
                                    text={"Wave Height"}
                                    click={() =>setModalClick("Wave Height")}
                                    darkMode={DModeFlag}
                                />

                                {/*wave direction button*/}
                                <ForecastButton
                                    safetynum={0}
                                    numval={weatherData ? weatherData.marine.current[3][1] : "N/A"}
                                    units={"°"}
                                    text={"Wave Direction"}
                                    direction={weatherData ? weatherData.marine.current[3][1] : null}
                                    click={() =>setModalClick("Wave Direction")}
                                    darkMode={DModeFlag}
                                />

                                {/*sea level height button*/}
                                <ForecastButton
                                    safetynum={0}
                                    numval={weatherData ? weatherData.marine.current[4][1] : "N/A"}
                                    units={"m"}
                                    text={"Sea Level Height"}
                                    sparkline={weatherData ? (() => { const times = weatherData.marine.hourly[0][1]; const vals = weatherData.marine.hourly[2][1]; const now = new Date(); let i = times.findIndex(t => new Date(t) >= now); if (i < 0) i = 0; return vals.slice(i, i + 24); })() : null}
                                    click={() =>setModalClick("Sea Level Height")}
                                    darkMode={DModeFlag}
                                />

                                {/*sea surface temperature button*/}
                                <ForecastButton
                                    safetynum={safetyLookup("seaTemp", parseFloat(weatherData ? weatherData.marine.current[5][1] : 0))}
                                    numval={weatherData ? toTemp(weatherData.marine.current[5][1]) : "N/A"}
                                    units={tempUnit}
                                    text={"Sea Surface Temperature"}
                                    click={() =>setModalClick("Sea Surface Temperature")}
                                    darkMode={DModeFlag}
                                />

                                {/*swell direction button*/}
                                <ForecastButton
                                    safetynum={0}
                                    numval={weatherData ? weatherData.marine.current[6][1] : "N/A"}
                                    units={"°"}
                                    text={"Swell Direction"}
                                    direction={weatherData ? weatherData.marine.current[6][1] : null}
                                    click={() =>setModalClick("Swell Direction")}
                                    darkMode={DModeFlag}
                                />

                                {/*swell height button*/}
                                <ForecastButton
                                    safetynum={safetyLookup("swellHeight", parseFloat(weatherData ? weatherData.marine.current[7][1] : 0))}
                                    numval={weatherData ? weatherData.marine.current[7][1] : "N/A"}
                                    units={"m"}
                                    text={"Swell Height"}
                                    click={() =>setModalClick("Swell Height")}
                                    darkMode={DModeFlag}
                                />

                                {/*wave period button*/}
                                <ForecastButton
                                    safetynum={safetyLookup("wavePeriod", parseFloat(weatherData ? weatherData.marine.current[8][1] : 0))}
                                    numval={weatherData ? weatherData.marine.current[8][1] ?? "N/A" : "N/A"}
                                    units={"s"}
                                    text={"Wave Period"}
                                    click={() => setModalClick("Wave Period")}
                                    darkMode={DModeFlag}
                                />

                                {/*swell period button*/}
                                <ForecastButton
                                    safetynum={safetyLookup("wavePeriod", parseFloat(weatherData ? weatherData.marine.current[9][1] : 0))}
                                    numval={weatherData ? weatherData.marine.current[9][1] ?? "N/A" : "N/A"}
                                    units={"s"}
                                    text={"Swell Period"}
                                    click={() => setModalClick("Swell Period")}
                                    darkMode={DModeFlag}
                                />
                                </>}
                            </div>

                            {/*forecast detail modal*/}
                            <div className='modal' id="fModal">
                                <div className="modal-dialog modal-lg modal-fullscreen-md-down">
                                    <div className={DModeFlag ? 'modal-content bg-dark text-light' :'modal-content bg-light'}>
                                        <div className={DModeFlag ? 'modal-header text-light' : 'modal-header text-dark'}>
                                             {modalClick && <h2 className="modal-title fw-bold">{modalClick}</h2>}
                                             <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" data-bs-theme={DModeFlag ? "dark": "light"}></button>
                                        </div>
                                        <div className={DModeFlag ? 'modal-body text-light' : 'modal-body text-dark'}>
                                            {/*render foreccast modal depending on which forecast button was clicked, only if weather and geocoding data are available*/}
                                            {weatherData && geoData && 
                                                <ForecastModal wData={weatherData} modalClick={modalClick} darkMode={DModeFlag} tempUnitFlag={TempUnitFlag}/>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>



                        {/*sailing recommendation banner*/}
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

                {/*map tab with leaflet map centerd on the selected location*/}
                <div className="tab-pane" id="map">
                    <div className="container-fluid p-3">
                        <div className='h-100 w-100'>

                            {/*default map center is set to London, if geocoding data is available it centers on the selected location*/}
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
            {/*bottom navigation bar with tabs for settings, forecasts, and map*/}
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

export default App
