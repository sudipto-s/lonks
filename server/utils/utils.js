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