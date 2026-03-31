import LineChart from "./graphDisplay";

//mapping of weather codes to icons
const weatherIconLookup = {
    0: "☀️", 1: "🌤️", 2: "⛅", 3: "☁️",
    45: "🌫️", 48: "🌫️",
    51: "🌦️", 53: "🌦️", 55: "🌦️",
    56: "🌧️", 57: "🌧️",
    61: "🌧️", 63: "🌧️", 65: "🌧️",
    66: "🌧️", 67: "🌧️",
    71: "🌨️", 73: "🌨️", 75: "🌨️",
    77: "🌨️",
    80: "🌧️", 81: "🌧️", 82: "🌧️",
    85: "🌨️", 86: "🌨️",
    95: "⛈️", 96: "⛈️", 99: "⛈️"
};

// Component to display current and future weather data, including a line chart for hourly values and daily forecast cards
const FutureWeather = ({ currentVal, currentLabel, DailyTimeArr, DailyValArr, DailyIconArr, HourlyTimeArr, HourlyValArr, units,darkMode }) => {

    // Show loading state if daily data is not yet available
    if (!DailyTimeArr || !DailyValArr) return <p>Loading...</p>;

    let hourlyLabels = [];
    let hourlyValues = [];
    if (HourlyTimeArr && HourlyValArr) {
         //slice arrays 24 hours from now to show only the next 24 hours in the chart
        const now = new Date();
        let startIdx = HourlyTimeArr.findIndex(t => new Date(t) >= now);
        if (startIdx < 0) startIdx = 0;
        const slice = HourlyTimeArr.slice(startIdx, startIdx + 24);
        hourlyLabels = slice.map(t => new Date(t).getHours().toString().padStart(2, '0') + ':00');
        hourlyValues = HourlyValArr.slice(startIdx, startIdx + 24);
    }

    return (
        <div>
            {/* Card to display the current value*/}
            <div className={darkMode ? "card mb-3 border-0 shadow-sm bg-dark text-light" :  "card mb-3 border-0 shadow-sm bg-light text-dark"}>
                <div className="card-body">
                    <h3 className="card-title mb-1">{currentVal} {units}</h3>
                    <p className="card-text mb-0" style={{ color: "#5a6acf" }}>{currentLabel}</p>
                </div>
            </div>

            {/*hourly line chart, only shown if hourly data is available*/}
            {hourlyLabels.length > 0 && (
                <div className="card mb-3 border-0 shadow-sm p-3">
                    <LineChart labels={hourlyLabels} values={hourlyValues} name={""} units={units} />
                </div>
            )}

            {/*daily forecast cards*/}
            <div className="d-flex overflow-auto gap-2 p-3 mx-auto justify-content-evenly">
                {DailyTimeArr.map((date, index) => (
                    <div key={index} className={darkMode ? "card border-0 shadow-sm text-center flex-shrink-0 bg-secondary text-light": "card border-0 shadow-sm text-center flex-shrink-0"} style={{ minWidth: "72px"}}>
                        <div className="card-body p-2">
                            {DailyIconArr && (
                                <div style={{ fontSize: "1.4rem", lineHeight: 1.2 }}>
                                    {weatherIconLookup[DailyIconArr[index]] ?? "—"}
                                </div>
                            )}
                            <div className="fw-semibold small">{DailyValArr[index]}{units}</div>
                            <small className="text-body-secondary">
                                {new Date(date).toLocaleDateString('en-GB', { weekday: 'short' })}
                            </small>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FutureWeather;
