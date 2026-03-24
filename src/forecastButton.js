import React from 'react';
const safety = ["#DDFDFF", "#E6FFDD", "#FFF8DD", "#FFE5DD"];
const ForecastButton = ({safetynum, numval, units, text, click}) => {
  return( 
    <button 
      onClick={click} 
      style={{backgroundColor: safety[safetynum],height:"150px",width:"150px"}}
      className="btn shadow-sm rounded-5" 
      type="button"
      >
        <div className="row w-100 h-100 text-center align-items-center mx-auto">
            <h1 className="col mx-auto fw-semibold">{numval}{units}</h1>
            <h5 className="col mx-auto">{text}</h5>
        </div>
    </button>
  );
};

export default ForecastButton;
//state(0,3),float,units,text