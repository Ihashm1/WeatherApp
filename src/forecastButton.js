import React from 'react';
const safety = ["blue", "green", "orange", "red"];
const ForecastButton = ({safetynum, numval, units, text, click}) => {
  return( 
    <button onClick={click} style={{backgroundColor: safety[safetynum]}}>
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