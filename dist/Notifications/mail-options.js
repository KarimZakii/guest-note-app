"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mailOptions = (mails, subject, text, html) => {
    return {
        from: { name: "Guest-note-app", address: process.env.EMAIL },
        to: mails,
        subject: subject,
        text: text,
        html: `<b>${html}</b>`, // html body
    };
};
exports.default = mailOptions;
