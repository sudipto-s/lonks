import lookup from "country-code-lookup"

export const extractDomain = (url) => {
   if(!url)
      return null
   try {
      let hostname = new URL(url).hostname
      return hostname.replace(/^www\./, "").split(".")[0]
   } catch (e) {
      return "Unknown"
   }
}

export const getCountryId = c => {
   if(!c) return null
   const countryData = lookup.byIso(c)
   return countryData ? countryData.isoNo : null
}