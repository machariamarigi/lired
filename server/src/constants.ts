import "dotenv-safe/config"

export const __prod__  = process.env.NODE_ENV === 'production'
export const REDIS_SECRET = process.env.REDIS_SECRET
export const REDIS_URL = process.env.REDIS_URL
export const DATABASE_URL = process.env.DATABASE_URL
export const CORS_ORIGIN = process.env.CORS_ORIGIN
export const COOKIE_NAME = "qid"
export const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
export const FORGET_PASSWORD_PREFIX = 'forget-password:'
export const PORT = parseInt(process.env.PORT)