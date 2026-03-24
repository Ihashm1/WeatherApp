import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function LineChart({ labels, values, name}) {
  const ref = useRef();
  const formattedLabels = labels.map(t => t.split("T")[1]);

  useEffect(() => {
    const chart = new Chart(ref.current, {
      type: "line",
      data: {
        labels: formattedLabels,
        datasets: [
          {
            label: name,
            data: values,
          }
        ]
      }
    })
    return () => chart.destroy();
  })

  return <canvas ref={ref} />;
}