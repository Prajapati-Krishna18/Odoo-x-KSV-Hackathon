// ============================================
// Express Application Assembly
// ============================================
// Why: Separating app.js from server.js follows the
// "app as a module" pattern. app.js configures Express
// (middleware, routes, error handler). server.js starts the server.
// This enables testing the app without starting a server.
// ============================================

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const swaggerUi = require('swagger-ui-express');

const swaggerSpec = require('./config/swagger');
const requestLogger = require('./middleware/requestLogger');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');
const { NotFoundError } = require('./utils/ApiError');

// Import route modules
const authRoutes = require('./modules/auth/auth.routes');
const userRoutes = require('./modules/users/users.routes');
const vendorRoutes = require('./modules/vendors/vendors.routes');
const rfqRoutes = require('./modules/rfqs/rfqs.routes');
const quotationRoutes = require('./modules/quotations/quotations.routes');
const approvalRoutes = require('./modules/approvals/approvals.routes');
const purchaseOrderRoutes = require('./modules/purchase-orders/purchaseOrders.routes');
const invoiceRoutes = require('./modules/invoices/invoices.routes');
const notificationRoutes = require('./modules/notifications/notifications.routes');
const analyticsRoutes = require('./modules/analytics/analytics.routes');

const app = express();

// ──────────── Global Middleware ────────────

// Security headers
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Compression
app.use(compression());

// Request logging
app.use(requestLogger);

// Rate limiting
app.use('/api/', apiLimiter);

// Static files (uploaded attachments)
app.use('/uploads', express.static('uploads'));

// ──────────── API Documentation ────────────

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'VendorBridge API Docs',
}));

// ──────────── Health Check ────────────

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'VendorBridge ERP is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// ──────────── API Routes ────────────

const API_PREFIX = '/api/v1';

app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/users`, userRoutes);
app.use(`${API_PREFIX}/vendors`, vendorRoutes);
app.use(`${API_PREFIX}/rfqs`, rfqRoutes);
app.use(`${API_PREFIX}/quotations`, quotationRoutes);
app.use(`${API_PREFIX}/approvals`, approvalRoutes);
app.use(`${API_PREFIX}/purchase-orders`, purchaseOrderRoutes);
app.use(`${API_PREFIX}/invoices`, invoiceRoutes);
app.use(`${API_PREFIX}/notifications`, notificationRoutes);
app.use(`${API_PREFIX}/analytics`, analyticsRoutes);

// ──────────── 404 Handler ────────────

app.use((req, res, next) => {
  next(new NotFoundError(`Route ${req.method} ${req.originalUrl}`));
});

// ──────────── Global Error Handler ────────────

app.use(errorHandler);

module.exports = app;
