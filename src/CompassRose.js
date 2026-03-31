import React from 'react';

const CompassRose = ({ degrees, size = 76 }) => {
    const r  = size / 2;
    const cx = r, cy = r;

    const rad = (degrees - 90) * (Math.PI / 180);
    const needleLen = r * 0.60;
    const tipX  = cx + needleLen * Math.cos(rad);
    const tipY  = cy + needleLen * Math.sin(rad);
    const tailX = cx - needleLen * Math.cos(rad);
    const tailY = cy - needleLen * Math.sin(rad);

    const pw = needleLen * 0.22;
    const perpX = -Math.sin(rad) * pw;
    const perpY =  Math.cos(rad) * pw;

    const labels = [
        { t: 'N', x: cx,           y: cy - r * 0.72 },
        { t: 'S', x: cx,           y: cy + r * 0.72 },
        { t: 'E', x: cx + r * 0.72, y: cy            },
        { t: 'W', x: cx - r * 0.72, y: cy            },
    ];

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {/* ring */}
            <circle cx={cx} cy={cy} r={r - 2} fill="rgba(255,255,255,0.6)" stroke="rgba(0,0,0,0.18)" strokeWidth="1.5"/>
            {/* subtle crosshairs */}
            <line x1={cx} y1={4} x2={cx} y2={size - 4} stroke="rgba(0,0,0,0.08)" strokeWidth="1"/>
            <line x1={4}  y1={cy} x2={size - 4} y2={cy} stroke="rgba(0,0,0,0.08)" strokeWidth="1"/>
            {/* cardinal labels */}
            {labels.map(({ t, x, y }) => (
                <text key={t} x={x} y={y} textAnchor="middle" dominantBaseline="central"
                    fontSize={size * 0.155} fontWeight="700" fill="rgba(0,0,0,0.5)">{t}</text>
            ))}
            {/* two-tone diamond needle: blue tip (bearing direction) + grey tail */}
            <polygon
                points={`${tipX},${tipY} ${cx + perpX},${cy + perpY} ${cx - perpX},${cy - perpY}`}
                fill="rgba(55,85,210,0.9)"
            />
            <polygon
                points={`${tailX},${tailY} ${cx + perpX},${cy + perpY} ${cx - perpX},${cy - perpY}`}
                fill="rgba(175,175,180,0.85)"
            />
            {/* pivot */}
            <circle cx={cx} cy={cy} r={pw * 0.55} fill="white" stroke="rgba(0,0,0,0.35)" strokeWidth="1.2"/>
        </svg>
    );
};

export default CompassRose;
