import React from 'react';

// Background colours indexed by safety level (0=none/neutral, 1=safe, 2=caution, 3=danger) — light mode
const safety = ["rgba(186, 250, 255, 1)", 
                "rgba(204, 255, 186,1)", 
                "rgba(255, 241, 183,1)", 
                "rgba(255, 185, 164,1)"];

// Muteyd equivalents for dark mode — same 4-level index, darker so text is readable
const safetyDark = ["rgb(110, 164, 168)", 
                    "rgb(129, 168, 113)", 
                    "rgb(181, 166, 115)", 
                    "rgb(165, 110, 93)"];

const ForecastButton = ({safetynum, numval, units, text, click, darkMode, direction}) => {
  
  const bgColour = darkMode ? (safetyDark[safetynum]) : (safety[safetynum])
  return( 
    <button 
      onClick={click} 
      style={{height:"40vw",
              width:"40vw", 
              maxWidth:"180px", 
              maxHeight:"180px", 
              backgroundColor: bgColour}}
      className="btn shadow-sm rounded-5 p-0" 
      type="button"
      data-bs-toggle="modal" 
      data-bs-target="#fModal"
      >
        <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', width:'100%', height:'100%', color: darkMode ? "white" : "inherit", gap:'2px', padding:'6px'}}>
            <h1 className="fw-semibold m-0">{numval}{units}</h1>
            {direction != null && (
              <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                <svg width="44" height="44" viewBox="0 0 24 24" style={{transform:`rotate(${direction}deg)`, transformOrigin:'center', display:'block'}}>
                  <path d="M12,7 L6,18 L12,15 L18,18 Z" fill="currentColor" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
            <h5 className="m-0">{text}</h5>
        </div>
    </button>
  );
};

export default ForecastButton;