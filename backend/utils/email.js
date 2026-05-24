const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
  try {
    let transporter;

    // Check if we have SMTP credentials configured
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const isGmail = (process.env.EMAIL_HOST || '').toLowerCase().includes('gmail') || !process.env.EMAIL_HOST;

      if (isGmail) {
        // Gmail-specific optimized configuration
        transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });
      } else {
        // Generic custom SMTP configuration
        transporter = nodemailer.createTransport({
          host: process.env.EMAIL_HOST,
          port: parseInt(process.env.EMAIL_PORT || '587'),
          secure: process.env.EMAIL_SECURE === 'true' || process.env.EMAIL_PORT === '465',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });
      }
    } else {
      // Development fallback to console logging
      console.log(`\n========================================`);
      console.log(`[DEVELOPMENT EMAIL LOGGER]`);
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Body: ${text}`);
      console.log(`========================================\n`);
      return;
    }

    const mailOptions = {
      from: `"Nexus Task Manager" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to ${to} | Message ID: ${info.messageId}`);
  } catch (err) {
    console.error(`Error sending email to ${to}:`, err);
  }
};

module.exports = sendEmail;
