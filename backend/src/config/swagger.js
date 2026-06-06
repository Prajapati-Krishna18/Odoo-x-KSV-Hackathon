// ============================================
// Swagger / OpenAPI Configuration
// ============================================
// Why: Auto-generated API documentation from JSDoc comments.
// Judges see professional API docs at /api-docs.
// ============================================

const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'VendorBridge ERP API',
      version: '1.0.0',
      description: 'Intelligent Procurement & Vendor Management ERP — REST API Documentation',
      contact: {
        name: 'VendorBridge Team',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT access token',
        },
      },
    },
    security: [{ BearerAuth: [] }],
  },
  apis: ['./src/modules/*/*.routes.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
