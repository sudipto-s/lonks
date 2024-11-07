// Returns favicon of the host
export const getFaviconUrl = originalUrl => {
   const url = new URL(originalUrl)
   return `https://icon.horse/icon/${url.hostname}`
}

// Returns created ago
export const getDaysCreatedAge = date => {
   const today = new Date()
   const createdAt = new Date(date)
   const diffTime = Math.abs(today - createdAt)
   const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))

   if (diffDays === 0)
      return 'today'
   else if (diffDays < 7)
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
   else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7)
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`
   } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30)
      return `${months} month${months > 1 ? 's' : ''} ago`
   } else {
      const years = Math.floor(diffDays / 365)
      return `${years} year${years > 1 ? 's' : ''} ago`
   }
}

// Copies link to clipboard
export const copyLink = async (link, setCopySlug) => {
   try {
      await navigator.clipboard.writeText(link)
      setCopySlug(true)
      setTimeout(() => setCopySlug(false), 1500)
   } catch (err) {
      console.log(err)
   }
}

export const shareLink = async (url, setCopySlug) => {
   if (navigator.share) {
      try {
         await navigator.share({
            title: 'Check out this link!',
            url
         })
      } catch (err) {
         console.error('Error sharing the link:', err)
      }
   } else {
      if(confirm('Your browser does not support sharing! Copy URL to clipboard?'))
         copyLink(url, setCopySlug)
   }
}