import { useEffect, useRef } from "react";  
import Chart from "chart.js/auto";
 export default function LineChart(){
    const ref = useRef();
    useEffect(() =>{
        const chart = new Chart(ref.current,{
            type: "line",
            data: {
                labels: ["Mon","tues","wedneday"],
                datasets: [
                    {
                        label : "Data",
                        data: [10,20,30],

                    }
                ]
            }
        })
    return () => chart.destroy();
    })
    return <canvas ref ={ref}/>;
 }