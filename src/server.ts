import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import gameRoutes from './routes/gameRoutes';
import userRoutes from './routes/userRoutes';
import adminRoutes from './routes/adminRoutes';
import https from 'https';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', gameRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gamevault';
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Self-pinging mechanism to keep the server active
const PING_INTERVAL = 5 * 60 * 1000; // 5 minutes
const pingServer = () => {
  const url = process.env.BACKEND_URL || 'https://gamevault-api.onrender.com';
  https.get(url, (res) => {
    console.log(`Pinged server. Status: ${res.statusCode}`);
  }).on('error', (err) => {
    console.error('Error pinging server:', err.message);
  });
};

// Start pinging when in production
if (process.env.NODE_ENV === 'production') {
  setInterval(pingServer, PING_INTERVAL);
}

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 