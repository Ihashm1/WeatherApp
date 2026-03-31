import React from 'react';

const TideSparkline = ({ values, times, size = { w: 140, h: 40 } }) => {
    if (!values || values.length < 2) return null;

    const now = new Date();
    let startIdx = 0;
    if (times) {
        const idx = times.findIndex(t => new Date(t) >= now);
        if (idx >= 0) startIdx = idx;
    }

    const slice = values.slice(startIdx, startIdx + 24).filter(v => v !== null);
    if (slice.length < 2) return null;

    const min = Math.min(...slice);
    const max = Math.max(...slice);
    const range = max - min || 1;

    const { w, h } = size;
    const pad = 2;

    const pts = slice.map((v, i) => {
        const x = pad + (i / (slice.length - 1)) * (w - pad * 2);
        const y = pad + (1 - (v - min) / range) * (h - pad * 2);
        return `${x},${y}`;
    }).join(' ');

    // current position marker
    const nowPct = 0;
    const nowX = pad;
    const nowY = pad + (1 - (slice[0] - min) / range) * (h - pad * 2);

    return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
            <defs>
                <linearGradient id="tide-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(80,100,200,0.3)" />
                    <stop offset="100%" stopColor="rgba(80,100,200,0)" />
                </linearGradient>
            </defs>
            {/* fill */}
            <polygon
                points={`${pad},${h} ${pts} ${w - pad},${h}`}
                fill="url(#tide-grad)"
            />
            {/* line */}
            <polyline points={pts} fill="none" stroke="rgba(80,100,200,0.8)" strokeWidth="1.5" strokeLinejoin="round" />
            {/* now dot */}
            <circle cx={nowX} cy={nowY} r="3" fill="rgba(80,100,200,1)" />
        </svg>
    );
};

export default TideSparkline;
