import React, { useState, useEffect, useMemo } from "react"
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts"
import { generateBrightColor } from "../../utils/analytics"

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
   const [colorMap, setColorMap] = useState({})

   // Listen for screen resize to update styles dynamically
   useEffect(() => {
      const handleResize = () => {
         setResponsiveStyle(getResponsiveStyle())
      }
   
      window.addEventListener("resize", handleResize)
      handleResize()
   
      return () => {
         window.removeEventListener("resize", handleResize)
      }
   }, [])
   
   const data = useMemo(() => ({ browserStats, deviceStats, osStats, referrers }), [browserStats, osStats, deviceStats, referrers])
   
   // Memoize the transformed data
   const chartData = useMemo(() => {
      return Object.entries(data).map(([category, stats]) => ({
         category,
         data: formatChartData(stats),
      }))
   }, [data])

   // Effect to initialize colors on first render or when new items are added
   useEffect(() => {
      setColorMap(prevColorMap => {
         const newColorMap = { ...prevColorMap }

         chartData.forEach(({ data }) => {
            data.forEach(({ name }) => {
               if (!newColorMap[name])
                  newColorMap[name] = generateBrightColor()
            })
         })

         return newColorMap // Only add new colors without changing existing ones
      })
   }, [chartData])

   return (
      <div className="analytics-chart Recharts" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", ...responsiveStyle }}>
         {chartData.map(({ category, data }, index) => (
            <div key={index} style={{ textAlign: "center" }}>
               <h3>{category.replace(/([A-Z])/g, " $1").trim()}</h3>
               <PieChart width={350} height={350}>          {/* .recharts-container */}
               <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label
               >                                            {/* .recharts-surface */}
                  {data.map((entry, idx) => (
                     <Cell key={idx} fill={colorMap[entry.name]} />
                  ))}
               </Pie>
               <Tooltip />
               <Legend verticalAlign="bottom" height={100} wrapperStyle={{
                  bottom: 0, overflowY: "auto", maxHeight: "60px",
                  scrollbarWidth: "none"
               }} className="legend" />
               </PieChart>
            </div>
         ))}
      </div>
   )
}

export default PieChartComponent
