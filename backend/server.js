// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.set('trust proxy', 1);

const PORT = process.env.PORT || 5000;

/* ---------------------------
   CORS (allow site + previews)
---------------------------- */
const staticAllow = [
  'https://jollybaba.in',
  'https://www.jollybaba.in',
  'https://jollybaba.netlify.app',
  'https://precious-adaptation-production-c86f.up.railway.app',
  'http://localhost:3000',
  'http://localhost:5173',
];

// include env-driven domains for future-proofing
const envOrigins = []
  .concat(process.env.SHORT_BASE_URL || [])
  .concat(process.env.CANONICAL_BASE_URL || [])
  .filter(Boolean)
  .map((u) => {
    try {
      return new URL(u).origin;
    } catch {
      return null;
    }
  })
  .filter(Boolean);

const allowlist = Array.from(new Set([...staticAllow, ...envOrigins]));

const corsOptionsDelegate = (req, callback) => {
  const origin = req.header('Origin');
  const isNetlifyPreview = origin && origin.endsWith('.netlify.app');
  // Allow any localhost origin (Flutter web dev uses random ports like 64173)
  const isLocalhost = origin && /^http:\/\/localhost(:\d+)?$/.test(origin);
  const isAllowed = !origin || allowlist.includes(origin) || isNetlifyPreview || isLocalhost;

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

/* ---------------------------
   Parsers
---------------------------- */
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

/* ---------------------------
   Routes
---------------------------- */
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/mobiles', require('./routes/mobileRoutes'));

// Link service:
// - /api/mobiles/:id/link → returns short link JSON
// - /m/:shortId → redirects to canonical product URL
app.use('/api', require('./routes/linkApiRoutes'));
app.use('/', require('./routes/publicRedirectRoutes'));

app.get('/api/health', (req, res) => res.json({ ok: true }));

/* ---------------------------
   404 fallback
---------------------------- */
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

/* ---------------------------
   MongoDB
---------------------------- */
console.log('DEBUG: MONGO_URI is', process.env.MONGO_URI ? 'defined' : 'undefined');
console.log('DEBUG: MONGO_URI starts with', process.env.MONGO_URI ? process.env.MONGO_URI.substring(0, 5) : 'N/A');

mongoose
  .connect(process.env.MONGO_URI, { dbName: process.env.MONGO_DB || 'jollybaba_db' })
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));
