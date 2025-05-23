interface Config {
  port: number;
  nodeEnv: string;
  apiUrl: string;
  // Add more configuration options as needed
}

// Validate required environment variables
const requiredEnvVars = ['NODE_ENV', 'API_URL'] as const;

// Check if all required environment variables are present
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

export const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  // Add more configuration options as needed
}; 