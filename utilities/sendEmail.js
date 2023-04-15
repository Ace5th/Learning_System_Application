var nodemailer = require("nodemailer");

const sendEmail = function (receiver, subject, msg) {
  var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.MASTER_EMAIL,
      pass: process.env.MASTER_EMAIL_PASSWORD,
    },
  });

  var mailOptions = {
    from: process.env.MASTER_EMAIL,
    to: receiver,
    subject: subject,
    text: msg,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) throw err;
    console.log("Email sent: " + info.response);
  });
};

module.exports = sendEmail;
