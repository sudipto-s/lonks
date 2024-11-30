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

// Returns expires in days
export const getExpiresIn = expirationDate => {
   const timeDiff = new Date(expirationDate) - new Date();
   const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

   if (daysDiff <= 0)
      return "today";
   else if (daysDiff === 1)
      return "in 1 day";
   else if (daysDiff <= 3)
      return `in ${daysDiff} days`;
   else if (daysDiff <= 7)
      return "in 1 week";
   return `in ${daysDiff} days`;
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

// Shows share option or copies link if Web Share API is not available
export const shareLink = async (url, setCopySlug) => {
   if (navigator.share) {
      try {
         await navigator.share({
            title: 'Check out this link! Shorten your links with Lonks for free',
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