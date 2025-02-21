import React, { useMemo, useState } from "react"
import { ComposableMap, Geographies, Geography, Sphere, Graticule } from "react-simple-maps"
import { scaleLinear } from "d3-scale"

const WorldMap = ({ countryStats }) => {
   const [tooltip, setTooltip] = useState(null)
   
   // Define color scale
   const colorScale = useMemo(() => scaleLinear().domain([0, 150]).range(["#EEE", "#0092b8"]), [])

   return (
      <div className="analytics-worldmap" style={{ position: "relative" }}>
         {tooltip && (
         <div
            style={{
               position: "absolute",
               top: tooltip.y - 60,
               left: tooltip.x - 290,
               backgroundColor: "rgba(0,0,0,0.7)",
               color: "#fff",
               padding: "5px 10px",
               borderRadius: "5px",
               pointerEvents: "none",
               fontSize: "14px",
            }}
         >
            {tooltip.label}
         </div>
         )}
         <ComposableMap
            projectionConfig={{ scale: 147, rotate: [-10, 0, 0]}}
            style={{ width: "100%", height: "auto" }}
         >
         <Sphere stroke="#E4E5E6" strokeWidth={0.9} />
         <Graticule stroke="#E4E5E6" strokeWidth={0.9} />
         <Geographies geography={"/world-110m.json"}>
            {({ geographies }) =>
               geographies.map((geo) => {
               const countryCode = geo.id
               const clickCount = countryStats[countryCode] || 0
               
               return (
                  <Geography
                     key={geo.rsmKey}
                     geography={geo}
                     fill={colorScale(clickCount)}
                     stroke="#FFF"
                     strokeWidth={0.5}
                     onMouseEnter={(event) => {
                        setTooltip({
                           label: `${geo.properties.name}: ${clickCount} clicks`,
                           x: event.clientX,
                           y: event.clientY,
                        })
                     }}
                     onClick={(event) => {
                        setTooltip({
                           label: `${geo.properties.name}: ${clickCount} clicks`,
                           x: event.clientX,
                           y: event.clientY,
                        })
                     }}
                     onMouseLeave={() => setTooltip(null)}
                     style={{
                        default: { outline: "none" },
                        hover: { fill: "#fe9a00", outline: "none" },
                     }}
                  />
               )
               })
            }
         </Geographies>
         </ComposableMap>
      </div>
   )
}

export default WorldMap
