import React, { useState, useEffect } from "react"
import {
   BarChart,
   Bar,
   XAxis,
   YAxis,
   CartesianGrid,
   Tooltip,
   ResponsiveContainer,
   Legend,
   Cell,
} from "recharts"

// Generate random colors
const generateColors = length => {
   return Array.from({ length }, () =>
      `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`
   )
}

/* Dynamic bar size */
const getBarSize = barCount => {
   const screenWidth = window.innerWidth
   if (screenWidth < 768)
      return Math.min(50, Math.floor(500 / barCount))
   return Math.min(90, Math.floor(700 / barCount))
}

const CountryBarChart = ({ url: { countryStats }}) => {
   const [countryData, setCountryData] = useState(null)
   const [barSize, setBarSize] = useState(0)
   
   useEffect(() => {
      // Convert object to array of { country, count }
      const data = Object.entries(countryStats).map(([country, count]) => ({
         country, count
      }))
      setCountryData(data)
      setBarSize(getBarSize(data.length))
   }, [countryStats])

   const colors = generateColors(countryData?.length)

   return (
      <div className="analytics-chart country-bar-chart-container">
         <h3 style={{ textAlign: "center" }}>🗺️ Country-wise clicks</h3>
         <div className="country-bar-chart">
            <ResponsiveContainer>
               <BarChart
                  data={countryData}
                  barCategoryGap={90}
                  barGap={0}
                  barSize={barSize}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
               >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="country" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                     dataKey="count"
                     legendType="none"
                     radius={[10, 10, 0, 0]}
                     isAnimationActive={true}
                     animationDuration={800}
                     label={{ position: "top", offset: 8 }}
                  >
                     {countryData?.map((entry, index) => (
                        <Cell key={entry.country} fill={colors[index]} />
                     ))}
                  </Bar>
               </BarChart>
            </ResponsiveContainer>
         </div>
      </div>
   )
}

export default CountryBarChart
