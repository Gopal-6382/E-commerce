import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

// Optional dependencies
let helmet, rateLimit, morgan;
try {
  helmet = (await import('helmet')).default;
  rateLimit = (await import('express-rate-limit')).default;
  morgan = (await import('morgan')).default;
} catch (err) {
  console.warn('Optional security packages not found. Running in reduced security mode.');
}

dotenv.config();

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 4000;

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

await connectDB();

// Middleware

// Allow ALL origins (for dev only)
app.use(cors({
  origin: '*', // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Security middlewares if available
if (helmet) app.use(helmet());
if (morgan) app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting if package is available
if (rateLimit) {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100
  });
  app.use(limiter);
}

// Import routes
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';

// Routes
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

// Basic route
app.get('/', (req, res) => {
  res.send('E-commerce API is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Something broke!'
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
