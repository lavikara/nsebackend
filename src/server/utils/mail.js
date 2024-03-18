const nodemailer = require('nodemailer');
require('dotenv').config();

function sendEmail (recipient, subject, text, html) {

    // Create a transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT), // Parse the port as an integer
        secure: true, // Use SSL (port 465)
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    // Setup email data
    let mailOptions = {
        from: process.env.EMAIL_FROM,
        to: recipient,
        subject: subject,
        text: text,
        html: html
    };

    // Send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return false;
        }
        return true;
    });
}

module.exports = sendEmail;
