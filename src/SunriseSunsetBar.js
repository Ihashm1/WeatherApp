import React from 'react';

const SunIcon = ({ size = 16, color = "#f59e0b" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round">
        <circle cx="12" cy="12" r="4" fill={color} stroke="none"/>
        <line x1="12" y1="2" x2="12" y2="5"/>
        <line x1="12" y1="19" x2="12" y2="22"/>
        <line x1="2" y1="12" x2="5" y2="12"/>
        <line x1="19" y1="12" x2="22" y2="12"/>
        <line x1="4.22" y1="4.22" x2="6.34" y2="6.34"/>
        <line x1="17.66" y1="17.66" x2="19.78" y2="19.78"/>
        <line x1="19.78" y1="4.22" x2="17.66" y2="6.34"/>
        <line x1="6.34" y1="17.66" x2="4.22" y2="19.78"/>
    </svg>
);

const MoonIcon = ({ size = 16, color = "#6366f1" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
        <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/>
    </svg>
);

const SunriseSunsetCard = ({ sunrise, sunset, bgColor = "rgba(186,250,255,1)" }) => {
    if (!sunrise || !sunset) return null;

    const now = new Date();
    const rise = new Date(sunrise);
    const set  = new Date(sunset);

    const dayLen  = set  - rise;
    const elapsed = now  - rise;
    const pct = Math.min(1, Math.max(0, elapsed / dayLen));
    const isDay = now >= rise && now <= set;

    const fmt = (d) => d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    // SVG arc — semi-circle with centre below the viewBox so endpoints are hidden
    const W = 130, H = 70;
    const cx = W / 2;
    const cy = H + 12;     // centre is below viewBox bottom
    const r  = H + 4;      // radius large enough that arc top is well inside viewBox

    const arcPath = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;

    // sun dot position along the arc
    const angle = Math.PI * (1 - pct); // π→0  as  pct 0→1
    const dotX = cx + r * Math.cos(angle);
    const dotY = cy - r * Math.sin(angle);

    const isPrimary   = now <= set;
    const primaryLabel = isPrimary ? 'SUNSET'  : 'SUNRISE';
    const primaryTime  = isPrimary ? fmt(set)   : fmt(rise);
    const primaryIcon  = isPrimary ? <MoonIcon size={13} color="#6366f1"/> : <SunIcon size={13} color="#f59e0b"/>;
    const secondaryIcon = isPrimary ? <SunIcon size={12} color="#f59e0b"/> : <MoonIcon size={12} color="#6366f1"/>;
    const secondaryLabel = isPrimary ? `Sunrise: ${fmt(rise)}` : `Sunset: ${fmt(set)}`;

    return (
        <div
            style={{
                height: "40vw", width: "40vw",
                maxWidth: "180px", maxHeight: "180px",
                backgroundColor: bgColor,
                borderRadius: "1.5rem",
                boxShadow: "0 .125rem .25rem rgba(0,0,0,.075)",
                overflow: "hidden",
                flexShrink: 0,
            }}
        >
            <div className="d-flex flex-column justify-content-between h-100 w-100 p-2 text-start">
                {/* header */}
                <div className="d-flex align-items-center gap-1">
                    {primaryIcon}
                    <span style={{ fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.08em", color: "rgba(0,0,0,0.45)", textTransform: "uppercase" }}>
                        {primaryLabel}
                    </span>
                </div>

                {/* big time */}
                <div style={{ fontSize: "1.4rem", fontWeight: 700, lineHeight: 1, color: "rgba(0,0,0,0.82)", paddingTop: "2px" }}>
                    {primaryTime}
                </div>

                {/* arc SVG */}
                <div style={{ flex: 1, overflow: "hidden", display: "flex", alignItems: "flex-end" }}>
                    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block", overflow: "visible" }}>
                        <defs>
                            <clipPath id="arc-clip">
                                <rect x="0" y="0" width={W} height={H}/>
                            </clipPath>
                        </defs>
                        {/* track — amber dashes, clearly visible */}
                        <path d={arcPath} fill="none" stroke="rgba(245,158,11,0.4)" strokeWidth="2.5"
                            strokeDasharray="5 4" clipPath="url(#arc-clip)"/>
                        {/* elapsed portion — solid amber; always visible (full arc after sunset) */}
                        <path
                            d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${dotX} ${dotY}`}
                            fill="none" stroke="rgba(245,158,11,0.75)" strokeWidth="2.5"
                            clipPath="url(#arc-clip)"
                        />
                        {/* sun dot — shown when above the horizon (dotY inside viewBox) */}
                        {dotY < H && (
                            <>
                                <circle cx={dotX} cy={dotY} r="8" fill="rgba(251,191,36,0.3)"/>
                                <circle cx={dotX} cy={dotY} r="5" fill="#fbbf24" stroke="rgba(245,158,11,0.8)" strokeWidth="1.5"/>
                            </>
                        )}
                    </svg>
                </div>

                {/* secondary row */}
                <div className="d-flex align-items-center gap-1">
                    {secondaryIcon}
                    <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "rgba(0,0,0,0.55)" }}>
                        {secondaryLabel}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SunriseSunsetCard;
