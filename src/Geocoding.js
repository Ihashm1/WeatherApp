import { useEffect, useState } from 'react';
import axios from 'axios';
import Weather from './Weather';
import FutureWeather from './futureWeather';

const Geocoding = (props) => {
    const [location, setLocation] = useState('');
    const [locationData, setLocationData] = useState(null);
    const [locationsArr, setLocationsArr] = useState(null);

    const fetchData = async () => {
        try{
            const response = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${location}&count=10`)

            setLocationData(response.data.results[0]);
            setLocationsArr(response.data.results);
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
        setLocationData(locationsArr[index]);
        props.sendData(locationsArr[index]);
    };

    return (
        <div>
            {
            <form onSubmit={handleSubmit}>
                <input type='text' placeholder='Enter Location' 
                value={location} onChange={handleInputChange}>
                </input>
                <button type='submit'>Search</button>
            </form>
            }

            {locationData ? (
                <>
                    <h2>Suggestions</h2>
                    <ul>
                        {locationsArr.map((locationItem, index) => (
                            <li key={index}><button onClick={() => handleClick(index)}>
                                {locationItem.name + ", " + locationItem.admin2 + ", " + locationItem.admin1 + ", " + locationItem.country}</button></li>
                        ))}
                    </ul>
                </>
                
            ):(
                <p>Loading Data...</p>
            )}
        </div>
    );
};

export default Geocoding;
