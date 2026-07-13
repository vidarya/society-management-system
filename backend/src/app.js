const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./modules/auth/auth.routes');
const errorHandler = require('./middlewares/errorHandler');
const { authenticate } = require('./middlewares/auth.middleware');
const residentsRoutes = require('./modules/residents/residents.routes');
const billingRoutes = require('./modules/billing/billing.routes');
const complaintsRoutes = require('./modules/complaints/complaints.routes');
const visitorsRoutes = require('./modules/visitors/visitors.routes');
const facilitiesRoutes = require('./modules/facilities/facilities.routes');
const noticesRoutes = require('./modules/notices/notices.routes');

const app = express();

// Middleware
app.use(helmet());
const allowedOrigins = [
  'http://localhost:5173',
  'https://society-management-system-bice.vercel.app',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});



// Feature routes
app.use('/api/auth', authRoutes);
app.use('/api', residentsRoutes);
app.use('/api', billingRoutes);
app.use('/api', complaintsRoutes);
app.use('/api', visitorsRoutes);
app.use('/api', facilitiesRoutes);
app.use('/api', noticesRoutes);

// Global error handler — must be last
app.use(errorHandler);

module.exports = app;