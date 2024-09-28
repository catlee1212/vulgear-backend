declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGO_DB_URL: string | undefined;
    }
  }
}

export { }