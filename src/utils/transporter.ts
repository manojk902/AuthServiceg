import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export  const  transporter = async (to: string, subject: string, html: string) => {
  try {
    const data = await resend.emails.send({
      from: process.env.FROM_EMAIL!,
      to,
      subject,
      html,
    });

    console.log("Email sent:", data);
    return data;
  } catch (error) {
    console.error("Email send error:", error);
    throw new Error("Failed to send email");
  }
};
