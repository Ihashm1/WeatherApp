import { useEffect, useState } from 'react';
import axios from 'axios';


// Geocoding component that allows users to search for a location and get its coordinates
const Geocoding = (props) => {

    // State variables for location input, location data, array of locations, input focus, placeholder text, and user location
    const [location, setLocation] = useState('');
    const [locationData, setLocationData] = useState(null);
    const [locationsArr, setLocationsArr] = useState(null);

    const [inputFocused, setInputFocused] = useState(false);
    const [placeholder, setPlaceholder] = useState("Enter Location");

    const [userLocation, setUserLocation] = useState(null);

    // Function to fetch geocoding data from the API based on the location input
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

    // useEffect to fetch data when the component mounts or when the location input changes
    useEffect(() => {
        if(location === ''){
            return
        }
        fetchData();
    }, []);

    // Handler functions for input change, form submission, location selection, input focus, input blur, and getting user location
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
        setPlaceholder(locationsArr[index].name + ", " + locationsArr[index].admin1 + ", " + locationsArr[index].country)
        setLocation(locationsArr[index].name + ", " + locationsArr[index].admin1 + ", " + locationsArr[index].country);
        setLocationData(locationsArr[index]);
        props.sendData(locationsArr[index]);
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
                {/*input group for location search with a button to get the users current location*/}
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

                            {/* Input field for location search */}
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

                {/*autocomplete dropdon for location search results*/}
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
                
            </form>
            }
        </div>
    );
};

export default Geocoding;
