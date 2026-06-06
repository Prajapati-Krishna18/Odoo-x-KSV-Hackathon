// ============================================
// Nodemailer Email Configuration
// ============================================
// Why: Centralized email transporter. Uses Ethereal
// in development (catches emails without sending),
// real SMTP in production.
// ============================================

const nodemailer = require('nodemailer');
const logger = require('./logger');

let transporter;

const createTransporter = async () => {
  if (process.env.NODE_ENV === 'production' && process.env.SMTP_USER) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    logger.info('✅ Email transporter configured (Production SMTP)');
  } else {
    // Create Ethereal test account for development
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      logger.info(`✅ Email transporter configured (Ethereal: ${testAccount.user})`);
    } catch (err) {
      logger.warn(`⚠️ Could not create Ethereal account: ${err.message}`);
      transporter = null;
    }
  }
  return transporter;
};

const getTransporter = () => transporter;

module.exports = { createTransporter, getTransporter };
