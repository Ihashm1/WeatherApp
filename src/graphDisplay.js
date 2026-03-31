import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

//line chart component using Chart.js, takes in labels, values, name, and units as props
export default function LineChart({ labels, values, name, units }) {
    const canvasRef = useRef();
    const chartRef = useRef(null);

    useEffect(() => {

        //destroy previous chart instance if it exists before creating a new one
        if (chartRef.current) chartRef.current.destroy();
        chartRef.current = new Chart(canvasRef.current, {
            type: "line",
            data: {
                labels,
                datasets: [{
                    label: name,
                    data: values,
                    borderColor: "rgba(80, 100, 200, 1)",
                    backgroundColor: "rgba(180, 195, 240, 0.3)",
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => `${ctx.raw} ${units ?? ''}`
                        }
                    }
                },
                scales: {
                    y: { grid: { color: "rgba(0,0,0,0.05)" } },
                    x: { grid: { display: false } }
                }
            }
        });
        // function to destroy chart instance on unmount or when labels or values change
        return () => { if (chartRef.current) chartRef.current.destroy(); };
    }, [labels, values]);

    return <canvas ref={canvasRef} />;
}
