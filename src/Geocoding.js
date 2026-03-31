import { useEffect, useState } from 'react';
import axios from 'axios';

const Geocoding = (props) => {
    const [location, setLocation] = useState('');
    const [locationData, setLocationData] = useState(null);
    const [locationsArr, setLocationsArr] = useState(null);

    const [inputFocused, setInputFocused] = useState(false);
    const [placeholder, setPlaceholder] = useState("Enter Location");

    const [userLocation, setUserLocation] = useState(null);

    const [recentLocations, setRecentLocations] = useState([]);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const stored = JSON.parse(localStorage.getItem('recentLocations'));
            if (Array.isArray(stored)) setRecentLocations(stored);
        } catch {}
    }, []);

    const saveRecentLocation = (loc) => {
        setRecentLocations(prev => {
            const filtered = prev.filter(r => r.id !== loc.id);
            const updated = [loc, ...filtered].slice(0, 3);
            // Save to localStorage after state update
            setTimeout(() => localStorage.setItem('recentLocations', JSON.stringify(updated)), 0);
            return updated;
        });
    };

    const fetchData = async () => {
        if (!location){return;}
        try{
            const response = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${location}&count=5`)

            if (!response || !response.data.results) {
                return;
            }

            setLocationData(response.data.results[0]);
            setLocationsArr(response.data.results);
            setPlaceholder(response.data.results[0].name + ", " + response.data.results.admin1 + ", " + response.data.results.country);
            props.sendData(locationData);
        }
        catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if(location === ''){
            return
        }
        fetchData();
    }, []);

    const handleInputChange = (e) => {
        setLocation(e.target.value);
        e.preventDefault();
        fetchData();
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        fetchData();
    };

    const handleClick = (index) => {
        const chosen = locationsArr[index];
        setPlaceholder(chosen.name + ", " + chosen.admin1 + ", " + chosen.country);
        setLocation(chosen.name + ", " + chosen.admin1 + ", " + chosen.country);
        setLocationData(chosen);
        props.sendData(chosen);
        saveRecentLocation(chosen);
        setLocationsArr(null);
        setInputFocused(false);
    };

    const removeRecentLocation = (id, e) => {
        e.stopPropagation();
        setRecentLocations(prev => {
            const updated = prev.filter(r => r.id !== id);
            setTimeout(() => localStorage.setItem('recentLocations', JSON.stringify(updated)), 0);
            return updated;
        });
    };

    const handleRecentClick = (loc) => {
        setPlaceholder(loc.name + ", " + loc.admin1 + ", " + loc.country);
        setLocation(loc.name + ", " + loc.admin1 + ", " + loc.country);
        setLocationData(loc);
        props.sendData(loc);
        saveRecentLocation(loc);
        setLocationsArr(null);
        setInputFocused(false);
    };

    const handleInputFocus = () => {
        setInputFocused(true);
    }

    const handleInputBlur = () => {
        setInputFocused(false);
        setLocation("");
    }

    const getUserLocation = () => {
        setLocation("");
        setPlaceholder("Current Location");
        
        if (navigator.geolocation){
            navigator.geolocation.getCurrentPosition(
                (position)=>{
                    setUserLocation(position.coords);
                    {userLocation && (
                        props.sendData(userLocation)
                    )}
                },
                (error)=>{
                    console.log(error.message)
                },
                {
                    enableHighAccuracy: false,
                    timeout: 5000,
                    maximumAge: 0,    
                }
            )
        }
    }

    return (
        <div className="" id="geocoding">
            {
            <form onSubmit={handleSubmit} className="mb-2">
                <div className="row p-0 m-0 no-gutters justify-content-center">
                    <div className="col p-0" 
                        onMouseEnter={handleInputFocus}
                        onMouseLeave={handleInputBlur}
                        onTouchStart={handleInputFocus}
                        onTouchCancel={handleInputBlur}
                    >
                        <div className="input-group rounded-pill shadow">
                            {/* Get GPS location */}
                            <button 
                                type="button"
                                className={props.darkMode ? "btn btn-dark border border-dark-emphasis rounded-start-pill" : "btn btn-light border border-light-emphasis rounded-start-pill"}
                                onClick={getUserLocation}
                            >📍</button>
                            <input 
                                type='text' 
                                placeholder={placeholder}
                                value={location} 
                                onChange={handleInputChange}
                                className={props.darkMode ? "form-control bg-dark text-light input-dark" : "form-control bg-light"}
                                onFocus={handleInputFocus}>
                            </input>
                            <span className={props.darkMode ? "input-group-text bg-dark rounded-end-pill" : "input-group-text bg-light rounded-end-pill"}>🔍</span>
                        </div>
                    </div>
                    
                </div>
                <div className="row w-100 p-0 m-0 no-gutters">
                    {locationsArr && inputFocused &&(
                    <>
                    <div  className="col p-0 m-0">
                        <div className="btn-group-vertical w-100" role="group">
                            {locationsArr.map((locationItem, index) => (
                                <button 
                                    onClick={() => handleClick(index)} 
                                    onMouseEnter={handleInputFocus}
                                    onMouseLeave={handleInputBlur}
                                    className={props.darkMode ? "btn btn-dark w-100" : "btn btn-light w-100"}
                                    type="button"
                                    key={index}>
                                    {locationItem.name + ", " + locationItem.admin1 + ", " + locationItem.country}
                                </button>
                            ))}
                        </div>
                    </div>
                    </>
                    )}
                </div>

                {recentLocations.length > 0 && (
                    <div className="row w-100 p-0 m-0 mt-1 no-gutters">
                        <div className="col p-0 m-0">
                            <div className="d-flex flex-wrap gap-1">
                                {recentLocations.map((loc) => (
                                    <button
                                        key={loc.id}
                                        type="button"
                                        onClick={() => handleRecentClick(loc)}
                                        onMouseEnter={handleInputFocus}
                                        onMouseLeave={handleInputBlur}
                                        className={props.darkMode ? "btn btn-dark rounded-pill d-flex align-items-center gap-2 px-3 py-2" : "btn btn-light rounded-pill d-flex align-items-center gap-2 px-3 py-2"}
                                        style={{fontSize:"1.05rem", minHeight:"2.3rem"}}
                                    >
                                         {loc.name}, {loc.admin1}
                                        <span
                                            onClick={(e) => removeRecentLocation(loc.id, e)}
                                            onMouseEnter={handleInputFocus}
                                            onMouseLeave={handleInputBlur}
                                            style={{
                                                display:"inline-flex", alignItems:"center", justifyContent:"center",
                                                width:"22px", height:"22px", borderRadius:"50%",
                                                backgroundColor: props.darkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)",
                                                fontSize:"1rem", lineHeight:1, cursor:"pointer", flexShrink:0
                                            }}
                                        >✕</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                
            </form>
            }
        </div>
    );
};

export default Geocoding;
