declare namespace NodeJS {
  interface ProcessEnv {
    REDIS_SECRET: string;
    CORS_ORIGIN: string;
    DATABASE_URL: string;
    REDIS_URL: string;
    PORT: string;
  }
}