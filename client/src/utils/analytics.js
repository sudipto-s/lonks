export const isAnalyticsAvailable = (data) => {
   if (!data.countryStats || !Object.keys(data.countryStats).length) return false
   if (!data.deviceStats || !Object.keys(data.deviceStats).length) return false
   if (!data.osStats || !Object.keys(data.osStats).length) return false
   if (!data.browserStats || !Object.keys(data.browserStats).length) return false
   if (!data.referrers || !Object.keys(data.referrers).length) return false

   return true
}

export const getDate = url => {
   if(!url) return null
   const availableDate = new Date(url.analyticsAvailableFrom)
   const createdDate = new Date(url.createdAt)
   if(Math.abs(availableDate - createdDate) < 600000)
      return null
   return availableDate.toLocaleDateString('en-IN')
}

// Function to generate a bright, non-dark random color
export const generateBrightColor = () => {
   let color
   do {
      color = `#${Math.floor(Math.random() * 16777215).toString(16)}`
   } while (isDarkColor(color))
   return color
}

// Function to check if a color is too dark
const isDarkColor = (hex) => {
   if (!hex) return true
   hex = hex.replace("#", "")
   if (hex.length !== 6) return true

   // Convert hex to RGB
   const r = parseInt(hex.substring(0, 2), 16)
   const g = parseInt(hex.substring(2, 4), 16)
   const b = parseInt(hex.substring(4, 6), 16)

   // Calculate brightness (YIQ formula)
   const brightness = (r * 299 + g * 587 + b * 114) / 1000

   return brightness < 100
}