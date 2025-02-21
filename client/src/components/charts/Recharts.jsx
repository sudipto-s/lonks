import React, { useState, useEffect, useMemo, useCallback } from "react"
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts"

// Responsive styling using a function, apply single column layout
const getResponsiveStyle = () => {
   return window.innerWidth <= 768
     ? { gridTemplateColumns: "1fr" } : {}
}

// Function to convert object to array for Recharts
const formatChartData = obj =>
  Object.entries(obj).map(([key, value]) => ({ name: key, value }))

const PieChartComponent = ({ url: { referrers, deviceStats, osStats, browserStats } }) => {
   const [responsiveStyle, setResponsiveStyle] = useState(getResponsiveStyle())

   // Listen for screen resize to update styles dynamically
   useEffect(() => {
      setResponsiveStyle(getResponsiveStyle());
   }, [])
   
   const data = useMemo(() => ({ browserStats, deviceStats, osStats, referrers }), [browserStats, osStats, deviceStats, referrers])
   
   // Memoize the transformed data
   const chartData = useMemo(() => {
      return Object.entries(data).map(([category, stats]) => ({
         category,
         data: formatChartData(stats),
      }))
   }, [data])

   // Memoized function to generate colors
   const generateColors = useCallback((num) => {
      return Array.from({ length: num }, () =>
         `#${Math.floor(Math.random() * 16777215).toString(16)}`
      )
   }, [])

   return (
      <div className="analytics-chart Recharts" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", ...responsiveStyle }}>
         {chartData.map(({ category, data }, index) => {
            const colors = generateColors(data.length)

            return (
               <div key={index} style={{ textAlign: "center" }}>
                  <h3>{category.replace(/([A-Z])/g, " $1").trim()}</h3>
                  <PieChart width={350} height={350}>          {/* .recharts-container */}
                  <Pie
                     data={data}
                     cx="50%"
                     cy="50%"
                     outerRadius={100}
                     fill="#8884d8"
                     dataKey="value"
                     label
                  >                                            {/* .recharts-surface */}
                     {data.map((entry, idx) => (
                        <Cell key={idx} fill={colors[idx]} />
                     ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                  </PieChart>
               </div>
            )
         })}
      </div>
   )
}

export default PieChartComponent
