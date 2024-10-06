import shortid from "shortid"

// Generates a 4 characters long ID
export default () => shortid.generate().slice(0, 4).toLowerCase()