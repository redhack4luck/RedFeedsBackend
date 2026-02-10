require('dotenv').config({ path: './src/.env' });
const nodemailer = require('nodemailer');

const createTransporter = () => {
  console.log('Email config:', {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    user: process.env.EMAIL_USER,
    hasPass: !!process.env.EMAIL_PASS
  });

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT || 587),
    secure: String(process.env.EMAIL_PORT) === '465',
    auth: {
      user: process.env.EMAIL_USER,
      pass: (process.env.EMAIL_PASS || '').replace(/\s+/g, ''),
    },
    tls: {
      servername: process.env.EMAIL_HOST,
      rejectUnauthorized: false
    },
  });
};

const sendEmail = async (options) => {
  const transporter = createTransporter();
  
  // Verify connection before sending
  try {
    await transporter.verify();
    console.log('Email transporter connection verified');
  } catch (verifyError) {
    console.error('Email transporter verification failed:', verifyError);
    throw new Error(`Email service connection failed: ${verifyError.message}`);
  }
  
  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: options.to,
    subject: options.subject,
    html: options.html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', {
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
      response: info.response,
    });
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error(`Email could not be sent: ${error.message}`);
  }
};

module.exports = {
  sendEmail,
};
