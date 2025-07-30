const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const loginRoute = require('./auth/login');
const signupRoute = require('./auth/signup');
const verifyEmailRoute = require('./auth/verify-email');
const forgotPasswordRoute = require('./auth/forgot-password');
const changePasswordRoute = require('./auth/change-password');
const userRoutes = require('./routes/userRoutes');  // Unified user routes (follow, followers, following, search, etc.)

const app = express();

// --- Config ---
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

// --- Global Middleware ---
app.use(cors());               // Enable CORS for all origins
app.use(helmet());             // Secure HTTP headers
app.use(morgan('dev'));        // Logger in dev format
app.use(express.json());       // Parse JSON request bodies

// --- API Routes ---
app.use('/api/signup', signupRoute);
app.use('/api/login', loginRoute);
app.use('/api/verify-email', verifyEmailRoute);
app.use('/api/forgot-password', forgotPasswordRoute);
app.use('/api/change-password', changePasswordRoute);
// Mount all user related routes under /api/users
app.use('/api/users', userRoutes);

// --- Root route for health check / sanity ---
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Server Status</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background: #f4f4f4;
            text-align: center;
            padding-top: 50px;
          }
          .container {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            display: inline-block;
          }
          h1 {
            color: green;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>✅ Server is Running</h1>
          <p>All systems are operational.</p>
          <p>Listening on <strong>${HOST}:${PORT}</strong></p>
        </div>
      </body>
    </html>
  `);
});

// --- Global error handler ---
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// --- Start server ---
app.listen(PORT, HOST, () => {
  console.log(`✅ Server running at http://${HOST}:${PORT}`);
});

module.exports = app;
