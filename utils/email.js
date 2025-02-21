const nodemailer = require("nodemailer");
const pug = require("pug");
const path = require("path");

const htmlToText = require("html-to-text");

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
    this.from = `Abdelrahman Eltohamy <${process.env.Email_From}>`;
  }
  newTransport() {
    if (process.env.NODE_ENV == "production") {
      return 1;
    }
    return nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }
  async send(template, subject) {
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(
      path.join(__dirname, "../", "views", "email", `${template}.pug`),
      {
        firstName: this.firstName,
        url: this.url,
        subject,
      },
    );

    // 2 ) Define email options

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: subject,
      text: htmlToText.convert(html),
      html,
    };

    // 3) Create transport and send email
    await this.newTransport().sendMail(mailOptions);
  }
  async sendWelcome() {
    await this.send("welcome", "Welcome to the Natours Family!");
    // becouse send return promise
  }
 async  sendPasswordReset(){
  await this.send('passwordReset' , 'Your Password reset token (valid for only 10 minuits)');
  }
};
