const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// ===============================
// Load Environment Variables
// ===============================

dotenv.config();

// ===============================
// Connect to MongoDB
// ===============================

connectDB();

// ===============================
// Create Express App
// ===============================

const app = express();

// ===============================
// CORS Configuration
// ===============================

const allowedOrigins = [
  'http://localhost:5173',
  'https://frontend-two-sigma-22.vercel.app',
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without an origin
      // Example: Postman, server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      // Allow only approved frontend URLs
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Reject unknown origins
      return callback(
        new Error(`CORS not allowed for origin: ${origin}`)
      );
    },

    credentials: true,

    methods: [
      'GET',
      'POST',
      'PUT',
      'PATCH',
      'DELETE',
      'OPTIONS',
    ],

    allowedHeaders: [
      'Content-Type',
      'Authorization',
    ],
  })
);

// ===============================
// Body Parser Middleware
// ===============================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// ===============================
// Logger
// ===============================

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ===============================
// Routes
// ===============================

app.use(
  '/api/auth',
  require('./routes/authRoutes')
);

app.use(
  '/api/users',
  require('./routes/userRoutes')
);

app.use(
  '/api/categories',
  require('./routes/categoryRoutes')
);

app.use(
  '/api/products',
  require('./routes/productRoutes')
);

app.use(
  '/api/cart',
  require('./routes/cartRoutes')
);

app.use(
  '/api/orders',
  require('./routes/orderRoutes')
);

app.use(
  '/api/reviews',
  require('./routes/reviewRoutes')
);

app.use(
  '/api/wishlist',
  require('./routes/wishlistRoutes')
);

app.use(
  '/api/expenses',
  require('./routes/expenseRoutes')
);

app.use(
  '/api/notifications',
  require('./routes/notificationRoutes')
);

app.use(
  '/api/complaints',
  require('./routes/complaintRoutes')
);

app.use(
  '/api/market-prices',
  require('./routes/marketPriceRoutes')
);

app.use(
  '/api/payments',
  require('./routes/paymentRoutes')
);

app.use(
  '/api/admin',
  require('./routes/adminRoutes')
);

// ===============================
// Health Check
// ===============================

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AgriMarket API is running',
    env: process.env.NODE_ENV,
  });
});

// ===============================
// 404 Handler
// ===============================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ===============================
// Global Error Handler
// Must be LAST
// ===============================

app.use(errorHandler);

// ===============================
// Start Server
// ===============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
});