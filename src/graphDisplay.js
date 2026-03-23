import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function LineChart({ labels, values }) {
  const ref = useRef();

  useEffect(() => {
    const chart = new Chart(ref.current, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Data",
            data: values,
          }
        ]
      }
    })
    return () => chart.destroy();
  })

  return <canvas ref={ref} />;
}