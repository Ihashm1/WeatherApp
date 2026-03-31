import { useState } from 'react'
import Chart from 'chart.js/auto'
import { jsPDF } from 'jspdf'


//scale of wind force with associated names, and a function to convert mph to beaufort scale
const BEAUFORT_NAMES = ['Calm','Light air','Light breeze','Gentle breeze','Moderate breeze',
    'Fresh breeze','Strong breeze','Near gale','Gale','Severe gale','Storm','Violent storm','Hurricane']
const BEAUFORT_MAX = [1, 5, 11, 19, 28, 38, 49, 61, 74, 88, 102, 117, Infinity]
const toBft = (mph) => { for (let i = 0; i < BEAUFORT_MAX.length; i++) { if (mph < BEAUFORT_MAX[i]) return i } return 12 }

//convert degrees to cardinal direction
const degreesToCardinal = (deg) => {
    const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW']
    return dirs[Math.round((deg % 360) / 22.5) % 16]
}

// Helper function to format ISO time strings
const fmtTime = (iso) => iso ? iso.slice(11, 16) : '--:--'

// List of all available metrics with their units and whether they are marine-specific
const ALL_METRICS = [
    { key: 'Temperature',           unit: '°C',  marine: false },
    { key: 'Precipitation',         unit: 'mm',  marine: false },
    { key: 'Wind Speed',            unit: 'mph', marine: false },
    { key: 'Wind Gusts',            unit: 'mph', marine: false },
    { key: 'Wave Height',           unit: 'm',   marine: true  },
    { key: 'Wave Period',           unit: 's',   marine: true  },
    { key: 'Swell Height',         unit: 'm',   marine: true  },
    { key: 'Swell Period',         unit: 's',   marine: true  },
    { key: 'Sea Surface Temperature',     unit: '°C',  marine: true  },
    { key: 'Sea Level Height',     unit: 'm',   marine: true  },
    { key: 'Wind Direction',       unit: '°',   marine: false, textOnly: true },
    { key: 'Wave Direction',       unit: '°',   marine: true,  textOnly: true },
    { key: 'Swell Direction',      unit: '°',   marine: true,  textOnly: true },
    { key: 'Sunrise / Sunset',     unit: '',    marine: false, textOnly: true },
]

// Function to extract hourly data for a given metric key from the weather data
const getHourlyData = (wData, key) => {
    const f = wData.forecast
    const m = wData.marine
    const now = new Date()

    //  function to slice the time and value arrays for the next 24 hours starting from the current time
    const slice = (timeArr, valArr) => {
        let i = timeArr.findIndex(t => new Date(t) >= now)
        if (i < 0) i = 0
        const labels = timeArr.slice(i, i + 24).map(t =>
            new Date(t).getHours().toString().padStart(2, '0') + ':00'
        )
        const vals = valArr.slice(i, i + 24).map(v => v ?? 0)
        return { labels, vals }
    }

    //switch statement to determine which data arrays to slice based on the metric key
    switch (key) {
        case 'Temperature':       return slice(f.hourly[0][1], f.hourly[1][1])
        case 'Precipitation':     return slice(f.hourly[0][1], f.hourly[7][1])
        case 'Wind Speed':        return slice(f.hourly[0][1], f.hourly[3][1])
        case 'Wind Gusts':        return slice(f.hourly[0][1], f.hourly[8][1])
        case 'Wave Height':       return slice(m.hourly[0][1], m.hourly[1][1])
        case 'Wave Period':       return slice(m.hourly[0][1], m.hourly[7][1])
        case 'Swell Height':     return slice(m.hourly[0][1], m.hourly[4][1])
        case 'Swell Period':     return slice(m.hourly[0][1], m.hourly[8][1])
        case 'Sea Surface Temp': return slice(m.hourly[0][1], m.hourly[6][1])
        case 'Sea Level Height': return slice(m.hourly[0][1], m.hourly[2][1])
        default:                  return null
    }
}

// Function to get the current value of a given metric key from the weather data
const getCurrentVal = (wData, key) => {
    const f = wData.forecast
    const m = wData.marine
    switch (key) {
        case 'Temperature':       return f.current[2][1]
        case 'Precipitation':     return f.current[3][1]
        case 'Wind Speed':        return f.current[4][1]
        case 'Wind Gusts':        return f.current[6][1]
        case 'Wave Height':       return m.current[2][1]
        case 'Wave Period':       return m.current[8]?.[1] ?? 'N/A'
        case 'Swell Height':     return m.current[7][1]
        case 'Swell Period':     return m.current[9]?.[1] ?? 'N/A'
        case 'Sea Surface Temp': return m.current[5][1]
        case 'Sea Level Height': return m.current[4][1]
        case 'Wind Direction':  { const d = f.current[5][1]; return `${d}° (${degreesToCardinal(d)})` }
        case 'Wave Direction':  { const d = m.current[3][1]; return `${d}° (${degreesToCardinal(d)})` }
        case 'Swell Direction': { const d = m.current[6][1]; return `${d}° (${degreesToCardinal(d)})` }
        case 'Sunrise / Sunset': return `Sunrise ${fmtTime(f.daily[4][1]?.[0])}  /  Sunset ${fmtTime(f.daily[9]?.[1]?.[0])}`
        default:                  return null
    }
}

// function to create a line chart and return it as a data URL for embedding in the PDF
const chartToDataUrl = (labels, values, title) => {
    const canvas = document.createElement('canvas')
    canvas.width = 700
    canvas.height = 220
    const chart = new Chart(canvas, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: title,
                data: values,
                borderColor: 'rgba(80,100,200,1)',
                backgroundColor: 'rgba(180,195,240,0.35)',
                fill: true,
                tension: 0.4,
                pointRadius: 2,
            }]
        },
        options: {
            animation: false,
            responsive: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { grid: { color: 'rgba(0,0,0,0.06)' }, ticks: { maxTicksLimit: 5 } },
                x: { grid: { color: 'rgba(0,0,0,0.06)' } }
            }
        }
    })
    const url = canvas.toDataURL('image/png')
    chart.destroy()
    return url
}

// main component for generating and downloading the pdf report based on the weather data and the selected metrics
const PdfReport = ({ weatherData, geoData, darkMode}) => {

    // Check if marine data is available to determine which metrics can be included in the report
    const marineAvailable = weatherData?.marine?.current[2][1] != null
    const toTemp = (c) => tempUnitFlag ? Math.round((parseFloat(c) * 9/5 + 32) * 10) / 10 : c
    const tUnit = tempUnitFlag ? '°F' : '°C'

    // set default selected metrics based on availability of the marine data
    const defaultKeys = ALL_METRICS
        .filter(m => !m.marine || marineAvailable)
        .map(m => m.key)

    // State variables to manage the visibility of the metric selection the selected metrics, and the generation status of the PDF
    const [open, setOpen] = useState(false)
    const [selected, setSelected] = useState(defaultKeys)
    const [generating, setGenerating] = useState(false)

    //toggle function to add or remove a metric from the selected list when the user clicks on the checkbox
    const toggle = (key) =>
        setSelected(prev =>
            prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
        )


    //select all and clear all functions to quickly select or deselect all metrics
    const selectAll = () => setSelected(ALL_METRICS.filter(m => !m.marine || marineAvailable).map(m => m.key))
    const clearAll  = () => setSelected([])

    //  handles the PDF generation and downloading when the user clicks the download button
    const handleDownload = async () => {
        if (!weatherData || selected.length === 0) return
        setGenerating(true)
        try {
            const doc = new jsPDF({ unit: 'mm', format: 'a4' })
            const pw = doc.internal.pageSize.getWidth()
            const margin = 14

            //header
            doc.setFontSize(20)
            doc.setTextColor(50, 60, 140)
            doc.text('Sailor Weather Report', margin, 20)

            doc.setFontSize(10)
            doc.setTextColor(90, 90, 90)
            const loc = geoData?.name
                ? `${geoData.name}, ${geoData.admin1}, ${geoData.country}`
                : 'Location unknown'
            doc.text(loc, margin, 28)
            doc.text(`Generated: ${new Date().toLocaleString('en-GB')}`, margin, 33)

            doc.setDrawColor(180, 185, 220)
            doc.line(margin, 36, pw - margin, 36)

            let y = 43

            //metrics  
            for (const key of selected) {
                const metric = ALL_METRICS.find(m => m.key === key)
                if (!metric) continue
                if (y > 245) { doc.addPage(); y = 20 }

                const cur = key === 'Temperature' ? toTemp(getCurrentVal(weatherData, key))
                           : key === 'Sea Surface Temperature' ? toTemp(getCurrentVal(weatherData, key))
                           : getCurrentVal(weatherData, key)
                const rawHourly = getHourlyData(weatherData, key)
                const hourly = (rawHourly && (key === 'Temperature' || key === 'Sea Surface Temperature'))
                    ? { labels: rawHourly.labels, vals: rawHourly.vals.map(v => toTemp(v)) }
                    : rawHourly

                //section header
                doc.setFontSize(13)
                doc.setTextColor(50, 60, 140)
                doc.text(key, margin, y)
                y += 5

                doc.setFontSize(10)
                doc.setTextColor(40, 40, 40)
                if (cur !== null && cur !== undefined) {
                    if (metric.textOnly) {
                        doc.text(String(cur), margin, y)
                    } else {
                        const unit = (key === 'Temperature' || key === 'Sea Surface Temperature') ? tUnit : metric.unit
                        doc.text(`Current: ${cur} ${unit}`, margin, y)
                        if (key === 'Wind Speed' || key === 'Wind Gusts') {

                            //annotate with beaufort force
                            const bft = toBft(parseFloat(cur))
                            doc.setTextColor(100, 100, 100)
                            doc.text(`  Beaufort ${bft} — ${BEAUFORT_NAMES[bft]}`, margin + 52, y)
                            doc.setTextColor(40, 40, 40)
                        }
                    }
                    y += 5
                }

                //hourly chart for the metric if it's not text-only and if the data is available
                if (!metric.textOnly && !metric.textOnly && hourly) {
                    const imgData = chartToDataUrl(hourly.labels, hourly.vals, key)
                    const imgW = pw - margin * 2
                    const imgH = imgW * (220 / 700)

                    //add new page if overflow
                    if (y + imgH > 280) { doc.addPage(); y = 20 }
                    doc.addImage(imgData, 'PNG', margin, y, imgW, imgH)
                    y += imgH + 10
                }

                doc.setDrawColor(220, 220, 235)
                doc.line(margin, y, pw - margin, y)
                y += 6
            }

            //create filename based on location and current date
            const filename = `weather-${geoData?.name ?? 'report'}-${new Date().toISOString().slice(0, 10)}.pdf`
            doc.save(filename.replace(/\s+/g, '-').toLowerCase())
        } catch (e) {
            console.error('PDF error:', e)
        }
        setGenerating(false)
    }

    //metrics in the checkbox list
    const visible = ALL_METRICS.filter(m => !m.marine || marineAvailable)

    return (
        <div className="row mx-auto">
            {/* Button to toggle the visibility of the metric selection panel */}
            <button
                className={darkMode ? "btn btn-dark mb-2 mx-auto col-12 col-md-2" : "btn btn-light mb-2 mx-auto col-12 col-md-2"}
                onClick={() => setOpen(o => !o)}
                disabled={!weatherData}
            >
                Download PDF Report {open ? '▲' : '▼'}
            </button>

            {/*options panel*/}
            {open && (
                <div className={darkMode ? "card border-0 shadow mb-1 bg-dark text-white" : "card border-0 shadow mb-1 bg-light text-dark"}>
                    <div className="card-body">
                        <p className='text-center'>Select what to include:
                            <button className='btn btn-secondary btn-sm mx-1' onClick={selectAll}>Select All</button>
                            <button className='btn btn-secondary btn-sm mx-1' onClick={clearAll}>Select None</button>
                        </p>

                        {/*chechbox list for metrics*/}
                        <div className="row row-cols-2 row-cols-md-3 g-1 mb-3">
                            {visible.map(m => (
                                <div key={m.key} className="col">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id={`pdf-${m.key}`}
                                            checked={selected.includes(m.key)}
                                            onChange={() => toggle(m.key)}
                                        />
                                        <label className="form-check-label small" htmlFor={`pdf-${m.key}`}>
                                            {m.key}
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Button to trigger PDF generation and download, disabled if no metrics are selected or if generation is in progress */}
                        <button
                            className={"btn btn-primary btn-sm"}
                            onClick={handleDownload}
                            disabled={generating || selected.length === 0}
                        >
                            {generating ? 'Generating...' : 'Download PDF'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default PdfReport
