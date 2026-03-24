import { useEffect, useState } from 'react';
import axios from 'axios';
import Weather from './Weather';
import FutureWeather from './futureWeather';
import searchIcon from './magnifying-glass-solid.svg';

const Geocoding = (props) => {
    const [location, setLocation] = useState('');
    const [locationData, setLocationData] = useState(null);
    const [locationsArr, setLocationsArr] = useState(null);

    const [inputFocused, setInputFocused] = useState(false);
    const [placeholder, setPlaceholder] = useState("Enter Location");

    const fetchData = async () => {
        if (!location){return;}
        try{
            const response = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${location}&count=5`)

            if (!response || !response.data.results) {
                return;
            }

            setLocationData(response.data.results[0]);
            setLocationsArr(response.data.results);
            setPlaceholder(response.data.results[0].name + ", " + response.data.results.admin1 + ", " + response.data.results.country)
            //console.log(response.data);
            //console.log(response.data.results);
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
        setPlaceholder(locationsArr[index].name + ", " + locationsArr[index].admin1 + ", " + locationsArr[index].country)
        setLocation(locationsArr[index].name + ", " + locationsArr[index].admin1 + ", " + locationsArr[index].country);
        setLocationData(locationsArr[index]);
        props.sendData(locationsArr[index]);
    };

    const handleInputFocus = () => {
        setInputFocused(true);
    }

    const handleInputBlur = () => {
        setInputFocused(false);
        setLocation("");
    }

    return (
        <div className="" id="geocoding">
            {
            <form onSubmit={handleSubmit} className="">
                <div className="row p-0 m-0 no-gutters justify-content-center">
                    <div className="col p-0" 
                        onMouseEnter={handleInputFocus}
                        onMouseLeave={handleInputBlur}
                    >
                        <div className="input-group shadow">
                            {/* Get GPS location */}
                            <button 
                                type="button"
                                className="btn btn-light border border-light-emphasis"
                            >📍</button>
                            <input 
                                type='text' 
                                placeholder={placeholder}
                                value={location} 
                                onChange={handleInputChange}
                                className="form-control bg-light"
                                onFocus={handleInputFocus}>
                            </input>
                            <span class="input-group-text bg-light">🔍</span>
                        </div>
                    </div>
                    {/*
                     <div className="col col-auto p-0 m-0">
                        <button type='submit' className="btn btn-primary">
                            <img src={searchIcon} className="img-fluid" height="20" width="20"/>
                        </button>
                    </div>
                    */}
                    
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
                                    className="btn btn-light w-100"
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
