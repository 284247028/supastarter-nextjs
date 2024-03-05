import fetch from "node-fetch";
import { config } from "../config";
import { SendEmailHandler } from "../types";

const { from } = config;

export const send: SendEmailHandler = async ({ to, subject, html, text }) => {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      html,
    }),
  });

  if (!response.ok) {
    console.error(await response.json());
    throw new Error("Could not send email");
  }
};
