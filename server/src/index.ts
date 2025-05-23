import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { config } from './config.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to the API',
    environment: config.nodeEnv,
    apiUrl: config.apiUrl
  });
});

// Start server
app.listen(config.port, () => {
  console.log(`Server is running in ${config.nodeEnv} mode on port ${config.port}`);
  console.log(`API URL: ${config.apiUrl}`);
}); 