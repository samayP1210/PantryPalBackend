const nodemailer = require("nodemailer");
const schedule = require("node-schedule");
require("dotenv").config();

const sendEmail = (toEmail, date, recipyName) => {
  let mailOptions = {
    from: 'btechprojects2069@gmail.com',
    to: toEmail,
    subject: `Reminder for ${recipyName}`,
    text: "Some content to send",
    html: `<b>This is a reminder as you have sheduled a dish(${recipyName}) to be prepared on ${date.toLocaleDateString()} at ${date.toLocaleTimeString()}</b><br><br>Thank You<br>Team PantryPal
    `,
  };

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "btechprojects2069@gmail.com",
      pass: "xtba xwib asft tvkj",
      // pass: 'rxlv xwuw eyty ntno',
    },
  });

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) console.log(error);
    // else console.log("Email sent: " + info.response);
  });
};

// sendEmail("samay1210patel@gmail.com", new Date(), "Sandwitch");

const scheduleEmail = (toEmail, date, recipyName) => {
  // date = new Date(date);
  // console.log(date, date.getFullYear(), date.getHours(), date.getMinutes());
  const tempDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes()
  );

  // console.log(tempDate.toLocaleDateString());
  // console.log(tempDate.toLocaleTimeString());
  const job = schedule.scheduleJob(tempDate, () => {
    // console.log(toEmail);
    sendEmail(toEmail, tempDate, recipyName);
  });
};

module.exports = {
  scheduleEmail,
};
