export const defaultEnvValues = {
  PORT: 50001,
  NODE_ENV: 'development',

  // MongoDB
  MONGODB_URI: 'mongodb://localhost:27017/zariah-server', // Default MongoDB URI

  // JWT Secret
  JWT_SECRET: 'your_jwt_secret', // Default JWT secret
  JWT_EXPIRATION: '90d', // Default JWT expiration 3 months
};
