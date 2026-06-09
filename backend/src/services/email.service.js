// ============================================
// Shared Email Service
// ============================================
// Why: Multiple modules send emails (RFQ invitations, PO delivery,
// invoice delivery, password reset). Centralized service with
// HTML templates prevents duplication.
// ============================================

const nodemailer = require('nodemailer');
const { getTransporter } = require('../config/email');
const logger = require('../config/logger');

class EmailService {
  /**
   * Send an email
   * @param {object} options
   * @param {string} options.to
   * @param {string} options.subject
   * @param {string} options.html
   * @param {Array} [options.attachments]
   */
  static async send({ to, subject, html, attachments = [] }) {
    const transporter = getTransporter();
    if (!transporter) {
      logger.warn(`Email not sent (no transporter): ${subject} → ${to}`);
      return null;
    }

    try {
      const info = await transporter.sendMail({
        from: `"${process.env.EMAIL_FROM_NAME || 'VendorBridge'}" <${process.env.EMAIL_FROM || 'noreply@vendorbridge.com'}>`,
        to,
        subject,
        html,
        attachments,
      });

      // Log Ethereal preview URL in development
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        logger.info(`📧 Email preview: ${previewUrl}`);
      }

      logger.info(`Email sent: ${subject} → ${to}`);
      return info;
    } catch (err) {
      logger.error(`Email failed: ${subject} → ${to}`, { error: err.message });
      throw err;
    }
  }

  // ──────────── Email Templates ────────────

  static async sendVendorInvitation({ to, vendorName, rfqTitle, rfqNumber, deadline }) {
    return this.send({
      to,
      subject: `[VendorBridge] Invitation to Quote: ${rfqTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">VendorBridge</h1>
          </div>
          <div style="padding: 30px; background: #f9fafb;">
            <h2>Invitation to Quote</h2>
            <p>Dear ${vendorName},</p>
            <p>You have been invited to submit a quotation for:</p>
            <div style="background: white; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0;">
              <strong>${rfqTitle}</strong><br/>
              <small>RFQ Number: ${rfqNumber}</small><br/>
              <small>Submission Deadline: ${new Date(deadline).toLocaleDateString()}</small>
            </div>
            <p>Please log in to VendorBridge to submit your quotation.</p>
            <a href="${process.env.FRONTEND_URL}" style="display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 15px;">
              Submit Quotation
            </a>
          </div>
          <div style="padding: 20px; text-align: center; color: #9ca3af; font-size: 12px;">
            <p>© ${new Date().getFullYear()} VendorBridge ERP. All rights reserved.</p>
          </div>
        </div>
      `,
    });
  }

  static async sendPasswordReset({ to, name, resetToken }) {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    return this.send({
      to,
      subject: 'Reset Your VendorBridge Password',
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="margin:0;padding:0;background:#f4f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5f7;padding:40px 20px;">
            <tr>
              <td align="center">
                <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
                  <tr>
                    <td style="background:linear-gradient(135deg,#6366f1,#4f46e5);padding:40px 30px;text-align:center;">
                      <img src="https://vendorbridge-kfjl.onrender.com/Logo.png" alt="VendorBridge" width="120" style="display:block;margin:0 auto;" />
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:40px 30px;">
                      <h2 style="margin:0 0 8px;font-size:22px;color:#1e293b;">Reset your password</h2>
                      <p style="margin:0 0 24px;font-size:15px;color:#64748b;line-height:1.6;">
                        Hello ${name},
                      </p>
                      <p style="margin:0 0 24px;font-size:15px;color:#64748b;line-height:1.6;">
                        We received a request to reset your VendorBridge password. Click the button below to create a new password.
                      </p>
                      <table cellpadding="0" cellspacing="0" style="margin:0 auto 32px;">
                        <tr>
                          <td style="background:#6366f1;border-radius:8px;padding:12px 32px;text-align:center;">
                            <a href="${resetUrl}" style="color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;display:inline-block;">
                              Reset Password
                            </a>
                          </td>
                        </tr>
                      </table>
                      <p style="margin:0 0 24px;font-size:14px;color:#94a3b8;line-height:1.6;">
                        This link expires in 30 minutes. If you did not request this change, you can safely ignore this email.
                      </p>
                      <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;" />
                      <p style="margin:0;font-size:13px;color:#94a3b8;">
                        VendorBridge Team &middot; Vendor Management Platform
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });
  }

  static async sendPurchaseOrder({ to, vendorName, poNumber, pdfBuffer }) {
    return this.send({
      to,
      subject: `[VendorBridge] Purchase Order: ${poNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">VendorBridge</h1>
          </div>
          <div style="padding: 30px; background: #f9fafb;">
            <h2>Purchase Order</h2>
            <p>Dear ${vendorName},</p>
            <p>Please find attached Purchase Order <strong>${poNumber}</strong>.</p>
            <p>Please review and acknowledge receipt.</p>
          </div>
        </div>
      `,
      attachments: pdfBuffer ? [{
        filename: `${poNumber}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      }] : [],
    });
  }

  static async sendInvoice({ to, vendorName, invoiceNumber, pdfBuffer }) {
    return this.send({
      to,
      subject: `[VendorBridge] Invoice: ${invoiceNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">VendorBridge</h1>
          </div>
          <div style="padding: 30px; background: #f9fafb;">
            <h2>Invoice</h2>
            <p>Dear ${vendorName},</p>
            <p>Please find attached Invoice <strong>${invoiceNumber}</strong>.</p>
          </div>
        </div>
      `,
      attachments: pdfBuffer ? [{
        filename: `${invoiceNumber}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      }] : [],
    });
  }
}

module.exports = EmailService;
