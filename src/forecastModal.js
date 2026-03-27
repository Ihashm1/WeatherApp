import FutureWeather from "./futureWeather"

const ForecastModal = ({ wData, modalClick }) => {
    if (!wData || !modalClick) return null;

    const weatherLookup = {
        0:  { label: "Clear Sky",  icon: "☀️" },
        1:  { label: "Mainly clear", icon: "🌤️" },
        2:  { label: "Partly cloudy", icon: "⛅" },
        3:  { label: "Overcast", icon: "☁️" },
        45: { label: "Fog", icon: "🌫️" },
        48: { label: "Rime fog", icon: "🌫️" },
        51: { label: "Light drizzle", icon: "🌦️" },
        53: { label: "Moderate drizzle", icon: "🌦️" },
        55: { label: "Dense drizzle", icon: "🌦️" },
        61: { label: "Slight rain", icon: "🌧️" },
        63: { label: "Moderate rain", icon: "🌧️" },
        65: { label: "Heavy rain", icon: "🌧️" },
        71: { label: "Slight snow", icon: "🌨️" },
        73: { label: "Moderate snow", icon: "🌨️" },
        75: { label: "Heavy snow", icon: "🌨️" },
        80: { label: "Showers", icon: "🌧️" },
        95: { label: "Thunderstorm", icon: "⛈️" },
        99: { label: "Thunderstorm w/ hail", icon: "⛈️" },
    }

    if (modalClick === "Temperature") return (
        <FutureWeather
            currentVal={weatherLookup[wData.forecast.current[8][1]]?.icon + " " + wData.forecast.current[2][1]}
            currentLabel={"Feels like: " + wData.forecast.current[7][1] + "°C"}
            DailyTimeArr={wData.forecast.daily[0][1]}
            DailyValArr={wData.forecast.daily[1][1]}
            units="°C"
        />
    )
    if (modalClick === "Precipitation") return (
        <FutureWeather
            currentVal={wData.forecast.current[3][1]}
            currentLabel={"Current precipitation"}
            DailyTimeArr={wData.forecast.daily[0][1]}
            DailyValArr={wData.forecast.daily[1][1]}
            units="mm"
        />
    )
    if (modalClick === "Wind Speed") return (
        <FutureWeather
            currentVal={wData.forecast.current[4][1]}
            currentLabel={"Gusts: " + wData.forecast.current[6][1] + " mph"}
            DailyTimeArr={wData.forecast.daily[0][1]}
            DailyValArr={wData.forecast.daily[5][1]}
            units="mph"
        />
    )
    if (modalClick === "Wind Direction") return (
        <FutureWeather
            currentVal={wData.forecast.current[5][1]}
            currentLabel={"Wind Direction"}
            DailyTimeArr={wData.forecast.daily[0][1]}
            DailyValArr={wData.forecast.daily[6][1]}
            units="°"
        />
    )
    if (modalClick === "Wind Gusts") return (
        <FutureWeather
            currentVal={wData.forecast.current[6][1]}
            currentLabel={"Wind Gusts"}
            DailyTimeArr={wData.forecast.daily[0][1]}
            DailyValArr={wData.forecast.daily[5][1]}
            units="mph"
        />
    )
    if (modalClick === "Wave Height") return (
        <FutureWeather
            currentVal={wData.marine.current[2][1]}
            currentLabel={"Direction: " + wData.marine.current[3][1] + "°"}
            DailyTimeArr={wData.marine.daily[0][1]}
            DailyValArr={wData.marine.daily[1][1]}
            units="m"
        />
    )
    if (modalClick === "Wave Direction") return (
        <FutureWeather
            currentVal={wData.marine.current[3][1]}
            currentLabel={"Wave Direction"}
            DailyTimeArr={wData.marine.daily[0][1]}
            DailyValArr={wData.marine.daily[2][1]}
            units="°"
        />
    )
    if (modalClick === "Sea Level Height") return (
        <FutureWeather
            currentVal={wData.marine.current[4][1]}
            currentLabel={"Sea Level Height"}
            DailyTimeArr={wData.marine.daily[0][1]}
            DailyValArr={wData.marine.daily[1][1]}
            units="m"
        />
    )
    if (modalClick === "Sea Surface Temperature") return (
        <FutureWeather
            currentVal={wData.marine.current[5][1]}
            currentLabel={"Sea Surface Temperature"}
            DailyTimeArr={wData.marine.daily[0][1]}
            DailyValArr={wData.marine.daily[1][1]}
            units="°C"
        />
    )
    if (modalClick === "Swell Direction") return (
        <FutureWeather
            currentVal={wData.marine.current[6][1]}
            currentLabel={"Swell Direction"}
            DailyTimeArr={wData.marine.daily[0][1]}
            DailyValArr={wData.marine.daily[4][1]}
            units="°"
        />
    )
    if (modalClick === "Swell Height") return (
        <FutureWeather
            currentVal={wData.marine.current[7][1]}
            currentLabel={"Direction: " + wData.marine.current[6][1] + "°"}
            DailyTimeArr={wData.marine.daily[0][1]}
            DailyValArr={wData.marine.daily[3][1]}
            units="m"
        />
    )

    return null;
}

export default ForecastModal;