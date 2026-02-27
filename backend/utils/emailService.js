const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const sendOtpEmail = async (to, otp) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to,
    subject: 'Your CampusConnect OTP - Email Verification',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0;">CampusConnect</h1>
        </div>
        <div style="background: #f5f5f5; padding: 30px; border-radius: 0 0 8px 8px;">
          <p style="color: #333; font-size: 16px; margin: 0 0 20px 0;">Hello,</p>
          <p style="color: #333; font-size: 16px; margin: 0 0 30px 0;">
            Your email verification code is:
          </p>
          <div style="background: white; border: 2px solid #667eea; padding: 20px; text-align: center; border-radius: 8px; margin-bottom: 30px;">
            <p style="font-size: 36px; font-weight: bold; color: #667eea; margin: 0; letter-spacing: 5px;">
              ${otp}
            </p>
          </div>
          <p style="color: #666; font-size: 14px; margin: 0 0 10px 0;">
            This code will expire in <strong>10 minutes</strong>.
          </p>
          <p style="color: #666; font-size: 14px; margin: 0 0 20px 0;">
            If you didn't request this code, you can ignore this email.
          </p>
          <div style="border-top: 1px solid #ddd; padding-top: 20px; margin-top: 20px;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              © 2024 CampusConnect. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP email sent to ${to}`);
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw error;
  }
};

module.exports = { sendOtpEmail };
