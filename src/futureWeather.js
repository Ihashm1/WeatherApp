const FutureWeather = ({ currentVal, currentLabel, DailyTimeArr, DailyValArr, units }) => {

    if (!DailyTimeArr || !DailyValArr) return <p>Loading...</p>;

    return (
        <div>
            <h2>Current</h2>
            <p>{currentVal} {units}</p>
            <p>{currentLabel}</p>

            <h2>Daily</h2>
            {DailyTimeArr.map((date, index) => (
                <p key={index}>
                    {new Date(date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
                    — {DailyValArr[index]} {units}
                </p>
            ))}
        </div>
    );
};

export default FutureWeather;