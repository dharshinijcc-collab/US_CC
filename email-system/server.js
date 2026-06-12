const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files from public folder
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Validate email address format using regular expression
 * @param {string} email 
 * @returns {boolean}
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// POST route to send validation / welcome email
app.post('/send-email', async (req, res) => {
  const { email } = req.body;

  // 1. Input Validation
  if (!email) {
    return res.status(400).json({ 
      success: false, 
      message: 'Email address is required.' 
    });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Please provide a valid email address.' 
    });
  }

  // 2. Nodemailer Transporter Configuration (Gmail SMTP)
  // Ensure you use your Gmail App Password here in production, not your personal account password!
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // 3. Email Options Structure
  const mailOptions = {
    from: `"CrestCode Ventures" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Welcome',
    text: 'Thank you for using our website.',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <h2 style="color: #005AE2; text-align: center;">Welcome to CrestCode</h2>
        <p style="font-size: 16px; color: #334155; line-height: 1.6;">Hello,</p>
        <p style="font-size: 16px; color: #334155; line-height: 1.6;">Thank you for using our website. We are thrilled to have you here.</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="font-size: 12px; color: #64748b; text-align: center;">This is an automated message, please do not reply directly to this email.</p>
      </div>
    `
  };

  try {
    // 4. Send Email using Async/Await
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    
    return res.status(200).json({ 
      success: true, 
      message: 'Welcome email sent successfully!',
      messageId: info.messageId
    });
  } catch (error) {
    console.error('Nodemailer Error:', error.message);
    
    // Check if error is authentication-related (incorrect App Password or user settings)
    if (error.message.includes('Username and Password not accepted')) {
      return res.status(500).json({
        success: false,
        message: 'Gmail authentication failed. Please verify your Gmail account user and App Password settings.'
      });
    }

    return res.status(500).json({ 
      success: false, 
      message: 'Failed to send email. Please try again later.' 
    });
  }
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
