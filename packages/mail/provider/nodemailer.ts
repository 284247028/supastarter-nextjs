import nodemailer from "nodemailer";
import { config } from "../config";
import { SendEmailHandler } from "../types";

const { from } = config;

export const send: SendEmailHandler = async ({ to, subject, text, html }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST as string,
    port: parseInt(process.env.MAIL_PORT as string, 10),
    auth: {
      user: process.env.MAIL_USER as string,
      pass: process.env.MAIL_PASS as string,
    },
  });

  await transporter.sendMail({
    to,
    from,
    subject,
    text,
    html,
  });
};
