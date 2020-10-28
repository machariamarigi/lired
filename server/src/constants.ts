export const __prod__  = process.env.NODE_ENV === 'production'
export const REDIS_SECRET = process.env.REDIS_SECRET as string
export const COOKIE_NAME = "qid"
export const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
