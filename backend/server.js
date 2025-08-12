// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.set('trust proxy', 1);

const PORT = process.env.PORT || 5000;

// --- CORS ---
const allowlist = [
  'https://jollybaba.in',
  'https://www.jollybaba.in',
  'https://jollybaba.netlify.app',
  'http://localhost:3000',
  'http://localhost:5173',
];

const corsOptionsDelegate = (req, callback) => {
  const origin = req.header('Origin');
  const isNetlifyPreview = origin && origin.endsWith('.netlify.app');
  const isAllowed = !origin || allowlist.includes(origin) || isNetlifyPreview;

  callback(
    null,
    isAllowed
      ? {
          origin: true,
          credentials: true,
          methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
          allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
          exposedHeaders: ['Content-Range', 'X-Total-Count'],
          optionsSuccessStatus: 204,
        }
      : { origin: false }
  );
};

app.use(cors(corsOptionsDelegate));

// ✅ Express 5-safe preflight handlers (use real RegExp, not string with groups)
app.options(/^\/api\/.*$/, cors(corsOptionsDelegate));
app.options(/^\/auth\/.*$/, cors(corsOptionsDelegate));

// --- Parsers ---
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// --- Routes ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/mobiles', require('./routes/mobileRoutes'));
app.get('/api/health', (req, res) => res.json({ ok: true }));

// --- 404 fallback
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

// --- MongoDB ---
mongoose
  .connect(process.env.MONGO_URI, { dbName: 'jollybaba_db' })
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));
