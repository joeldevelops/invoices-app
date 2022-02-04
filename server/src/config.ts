export default Object.freeze({
  runtimeEnv: process.env.RUNTIME_ENV,
  port: process.env.PORT,
  mongo: {
    host: process.env.MONGO_HOST,
    port: process.env.MONGO_PORT,
    database: process.env.MONGO_DATABASE,
    connectionString: process.env.MONGO_CONN_STRING
  },
  auth: {
    privateKey: process.env.JWT_PRIVATE_KEY
  }
});