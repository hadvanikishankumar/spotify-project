const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const musicRoutes = require('./routes/music.routes');

const app = express();

app.use(express.json());
app.use(cookieParser());

// ✅ CORS — multiple origins support
const allowedOrigins = [
  'http://localhost:5173',                         // local dev
  process.env.FRONTEND_URL                         // production Vercel URL
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true    // cookies ke liye zaruri hai
}));

app.use('/api/auth', authRoutes);
app.use('/api/music', musicRoutes);

module.exports = app;