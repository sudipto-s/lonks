export const isAnalyticsAvailable = (data) => {
   if (!data.analyticsAvailableFrom) return false
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