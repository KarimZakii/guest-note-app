const mailOptions = (
  mails: string[],
  subject: string,
  text: string,
  html: string
) => {
  return {
    from: { name: "Guest-note-app", address: process.env.EMAIL }, // sender address
    to: mails, // list of receivers
    subject: subject, // Subject line
    text: text, // plain text body
    html: `<b>${html}</b>`, // html body
  };
};
export default mailOptions;
