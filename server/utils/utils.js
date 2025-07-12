import { getName } from "country-list"

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

export const getCountryName = c => getName(c) || "Unknown"