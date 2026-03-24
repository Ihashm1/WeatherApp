import React from 'react';
const safety = ["blue", "green", "orange", "red"];
const ForecastButton = ({safetynum, numval, units, text}) => {
  console.log("button");
  return( 
    <button style={{backgroundColor: safety[safetynum]}}>
      <div>
        <div>
          {numval}{units}
        </div>
        <div>
          {text}
        </div>
      </div>
    </button>
  );
};

export default ForecastButton;
//state(0,3),float,units,text