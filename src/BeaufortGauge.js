import React from 'react';

const BEAUFORT = [
    { max: 1,   label: "Calm",        color: "#baf8ff" },
    { max: 5,   label: "Light air",   color: "#ccffba" },
    { max: 11,  label: "Light breeze",color: "#d4f5a0" },
    { max: 19,  label: "Gentle",      color: "#e8f59e" },
    { max: 28,  label: "Moderate",    color: "#fff5b0" },
    { max: 38,  label: "Fresh",       color: "#ffe49a" },
    { max: 49,  label: "Strong",      color: "#ffce7a" },
    { max: 61,  label: "Near gale",   color: "#ffb060" },
    { max: 74,  label: "Gale",        color: "#ff8c50" },
    { max: 88,  label: "Severe gale", color: "#ff6040" },
    { max: 102, label: "Storm",       color: "#ff3020" },
    { max: 117, label: "Violent",     color: "#cc1010" },
    { max: Infinity, label: "Hurricane", color: "#800000" },
];

export const toBeaufort = (mph) => {
    for (let i = 0; i < BEAUFORT.length; i++) {
        if (mph < BEAUFORT[i].max) return i;
    }
    return 12;
};

const polarToXY = (cx, cy, r, angleDeg) => {
    const rad = (angleDeg - 90) * (Math.PI / 180);
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
};

const arc = (cx, cy, r, startDeg, endDeg) => {
    const s = polarToXY(cx, cy, r, startDeg);
    const e = polarToXY(cx, cy, r, endDeg);
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
};

const BeaufortGauge = ({ mph, size = 100 }) => {
    const cx = size / 2;
    const cy = size * 0.62;
    const r  = size * 0.40;
    const startDeg  = -140;
    const endDeg    =  140;
    const totalSpan =  280;
    const maxMph    =  120;
    const bft  = toBeaufort(mph);

    const segSpan  = totalSpan / 13;
    const sw       = r * 0.24;  // stroke width
    const fillAngle = startDeg + (Math.min(mph, maxMph) / maxMph) * totalSpan;

    const svgH = size * 0.54;
    return (
        <svg width={size} height={svgH} viewBox={`0 0 ${size} ${size * 0.70}`} style={{overflow:'hidden'}}>
            {/* grey track */}
            <path d={arc(cx, cy, r, startDeg, endDeg)} fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth={sw} strokeLinecap="butt"/>
            {/* coloured segments */}
            {BEAUFORT.map((seg, i) => {
                const s = startDeg + i * segSpan;
                const e = s + segSpan - 0.8;
                return <path key={i} d={arc(cx, cy, r, s, e)} fill="none" stroke={seg.color} strokeWidth={sw} strokeLinecap="butt"/>;
            })}
            {/* dim overlay past needle */}
            {fillAngle < endDeg && (
                <path d={arc(cx, cy, r, fillAngle, endDeg)} fill="none" stroke="rgba(0,0,0,0.22)" strokeWidth={sw + 0.5}/>
            )}
            {/* needle */}
            {(() => {
                const nr = (fillAngle - 90) * (Math.PI / 180);
                const nx = cx + r * 0.72 * Math.cos(nr);
                const ny = cy + r * 0.72 * Math.sin(nr);
                const bx = cx - r * 0.18 * Math.cos(nr);
                const by = cy - r * 0.18 * Math.sin(nr);
                return (
                    <>
                        <line x1={bx} y1={by} x2={nx} y2={ny}
                            stroke="rgba(15,15,15,0.88)" strokeWidth="2.5" strokeLinecap="round"/>
                        <circle cx={cx} cy={cy} r={r * 0.13}
                            fill="white" stroke="rgba(15,15,15,0.55)" strokeWidth="1.5"/>
                    </>
                );
            })()}
        </svg>
    );
};

export default BeaufortGauge;

