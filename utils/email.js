const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1) Create a transporter
  console.log("MAIL_HOST:", process.env.MAIL_HOST);
  console.log("MAIL_PORT:", process.env.MAIL_PORT);
  console.log("MAIL_USER:", process.env.MAIL_USER);
  console.log("MAIL_PASS:", process.env.MAIL_PASS);

  const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  // 2) Define the email options
  const mailOptions = {
    from: "Abdelrahman Eltohamy <hello@eltoo.io>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3) Actually send the email
  const info = await transport.sendMail(mailOptions);
  console.log("Email sent:", info.response);
};

module.exports = sendEmail;
