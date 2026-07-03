const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config({ path: require('path').join(__dirname, '..', '.env') });

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ ok: true, service: 'SMRP Nestora API', time: new Date().toISOString() });
});

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/boardings', require('./routes/boarding.routes'));
app.use('/api/bookings', require('./routes/booking.routes'));
app.use('/api/notifications', require('./routes/notification.routes'));
app.use('/api/announcements', require('./routes/announcement.routes'));
app.use('/api/reviews', require('./routes/review.routes'));
app.use('/api/complaints', require('./routes/complaint.routes'));

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 SMRP Nestora API running on http://localhost:${PORT}`);
});
