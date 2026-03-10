import { useEffect, useState } from 'react';
import axios from 'axios';
import Weather from './Weather';

const Geocoding = () => {
    const [location, setLocation] = useState('');
    const [locationData, setLocationData] = useState(null);

    const fetchData = async () => {
        try{
            const response = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${location}&count=1`)
            setLocationData(response.data.results[0]);
            console.log(response.data);
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
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        fetchData();
    };
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type='text' placeholder='Enter Location' 
                value={location} onChange={handleInputChange}>
                </input>
                <button type='submit'></button>
            </form>
            {locationData ? (
                <>
                    <h2>Name: {locationData.name}</h2>
                    <p>Latitude: {locationData.latitude}</p>
                    <p>Longitude: {locationData.longitude}</p>
                </>
            ):(
                <p>Loading Data...</p>
            )}
            {locationData ? (
                    <Weather
                        latitude={locationData.latitude}
                        longitude={locationData.longitude}
                    />
                    ) : ""}
        </div>
    );
};

export default Geocoding;
