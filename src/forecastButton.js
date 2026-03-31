import arrow from './images/BlackArrow.png';

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

const ForecastButton = ({safetynum, numval, units, text, click, darkMode, direction, sparkline}) => {
  
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
            {sparkline != null && sparkline.length > 1 && (() => {
              const vals = sparkline.filter(v => v != null);
              if (vals.length < 2) return null;
              const min = Math.min(...vals);
              const max = Math.max(...vals);
              const w = 130, h = 34, pad = 2;
              const pts = vals.map((v, i) => [
                pad + (i / (vals.length - 1)) * (w - pad * 2),
                max === min ? h / 2 : pad + (1 - (v - min) / (max - min)) * (h - pad * 2)
              ]);
              // Catmull-Rom to cubic bezier
              let d = `M ${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
              for (let i = 0; i < pts.length - 1; i++) {
                const p0 = pts[Math.max(i - 1, 0)];
                const p1 = pts[i];
                const p2 = pts[i + 1];
                const p3 = pts[Math.min(i + 2, pts.length - 1)];
                const t = 0.5;
                const cp1x = p1[0] + (p2[0] - p0[0]) * t / 3;
                const cp1y = p1[1] + (p2[1] - p0[1]) * t / 3;
                const cp2x = p2[0] - (p3[0] - p1[0]) * t / 3;
                const cp2y = p2[1] - (p3[1] - p1[1]) * t / 3;
                d += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
              }
              const area = `${d} L ${pts[pts.length-1][0].toFixed(1)},${h} L ${pts[0][0].toFixed(1)},${h} Z`;
              return (
                <svg key="spark" width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{display:'block', overflow:'hidden'}}>
                  <path d={area} fill="currentColor" fillOpacity="0.18"/>
                  <path d={d} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              );
            })()}
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