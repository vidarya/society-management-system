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

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
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

// Global error handler — must be last
app.use(errorHandler);

module.exports = app;