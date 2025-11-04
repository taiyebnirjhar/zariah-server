export const defaultEnvValues = {
  PORT: 3000,
  NODE_ENV: 'development',

  // MongoDB
  MONGODB_URI: 'mongodb://localhost:27017/dashforge', // Default MongoDB URI

  // Redis
  REDIS_HOST: 'localhost', // Default Redis host
  REDIS_PORT: 6379, // Default Redis port
  REDIS_USERNAME: '', // Default to an empty string if not set
  REDIS_PASSWORD: '', // Default to an empty string if not set

  // JWT Secret
  JWT_SECRET: 'your_jwt_secret', // Default JWT secret
  JWT_EXPIRATION: '90d', // Default JWT expiration 3 months
};
