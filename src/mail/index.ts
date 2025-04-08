import nodemailer from "nodemailer";
interface mailProps {
  to: string;
  subject: string;
  html: string;
}

const sendMail = async ({ to, subject, html }: mailProps) => {
  try {
    // transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER!,
        pass: process.env.GMAIL_PASS!,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const res = await transporter.sendMail({
      from: process.env.GMAIL_USER!,
      to,
      subject,
      html,
    });

    return res;
  } catch (error) {
    throw error;
  }
};

export default sendMail;
