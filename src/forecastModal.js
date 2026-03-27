import FutureWeather from "./futureWeather"

const forecastModal = ({wData, gData}) => {
    <FutureWeather latitude={gData.latitude} longitude={gData.longitude}/>
}

export default forecastModal;