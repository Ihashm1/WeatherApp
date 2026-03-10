import { useEffect, useState } from 'react';
import axios from 'axios';

const Geocoding = () => {
    const [location, setLocation] = useState('');
    const [locationData, setLocationData] = useState(null);

    const fetchData = async () => {
        try{
            const response = await axios.get('https://geocoding-api.open-meteo.com/v1/search?name=${location}&count=1', {
                headers: {"Access-Control-Allow-Origin": "https://geocoding-api.open-meteo.com/v1/search?name=${location}&count=1"}
            })
            setLocationData(response.data);
            console.log(response.data);
        }
        catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
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
                <h2>{locationData.name}</h2>
                </>
            ):(
                <p></p>
            )}
        </div>
    );
};

export default Geocoding;