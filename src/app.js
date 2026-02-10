require('dotenv').config({ path: './src/.env' });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middlewares/errorHandler');

const authRoutes = require('./routes/auth');
const threadRoutes = require('./routes/threads');
const followRoutes = require('./routes/follow');
const notificationRoutes = require('./routes/notifications');

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});

app.use(helmet());
app.use(cors({
  origin: ['https://redfeeds.netlify.app', 'http://localhost:3000'],
  credentials: true
}));
app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/threads', threadRoutes);
app.use('/api/users', followRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Auth Social App API is running',
    timestamp: new Date().toISOString()
  });
});

// Keep-alive endpoint to prevent Render from sleeping
app.get('/api/ping', (req, res) => {
  res.status(200).send('pong');
});

// Email test endpoint for debugging
app.get('/api/test-email', async (req, res) => {
  const { sendEmail } = require('./config/email');
  try {
    await sendEmail({
      to: 'red1.solfado@gmail.com',
      subject: 'Test Email from RedFeeds',
      html: '<h2>Test Email</h2><p>This is a test email from RedFeeds backend.</p>'
    });
    res.json({ message: 'Test email sent successfully' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Test email failed', 
      error: error.message 
    });
  }
});

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use(errorHandler);

module.exports = app;
