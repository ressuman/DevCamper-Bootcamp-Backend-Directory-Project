const nodemailer = require("nodemailer");
const ErrorResponse = require("./errorResponse");

/**
 * Function to send an email using nodemailer and Mailtrap
 * @param {Object} options - Email options
 * @param {string} options.email - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.message - Email message
 * @param {string} [options.html] - HTML email message (optional)
 */
const sendEmail = async (options) => {
  try {
    // Create a transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER_EMAIL,
        pass: process.env.SMTP_USER_PASSWORD,
      },
    });

    // Setup email data with unicode symbols
    const message = {
      from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html,
    };

    // Send mail with defined transport object
    const info = await transporter.sendMail(message);

    // Log the message ID for tracking purposes
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    // Log error for debugging purposes
    console.error("Error sending email: %s", error.message);

    // Throw an error to be handled by the calling function or middleware
    throw new ErrorResponse("Email could not be sent");
  }
};

module.exports = sendEmail;
