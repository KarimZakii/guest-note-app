import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "yourmail",
    pass: "yourpw",
  },
});

const sendMail = async (mailOpt) => {
  try {
    await transporter.sendMail(mailOpt);
    console.log("mail sent successfully");
  } catch (e) {
    console.log(e);
  }
};

export { sendMail };
