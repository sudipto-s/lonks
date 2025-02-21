export const isEmail = email => /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(email)

export const devLogger = msg => import.meta.env.DEV && console.log(msg)