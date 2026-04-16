import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ msg: "Method not allowed" });
  }

  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ msg: "All fields required ❌" });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Website Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "New Contact Form Message 📩",
      html: `
        <div style="font-family:Arial; padding:20px;">
          <h2>New Inquiry</h2>
          <p><b>Name:</b> ${name}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>Phone:</b> ${phone}</p>
          <p><b>Message:</b> ${message}</p>
        </div>
      `,
    });

    await transporter.sendMail({
      from: `"Trustellar" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "We Received Your Request ✅",
      html: `
        <p>Hi ${name},</p>
        <p>We received your message and will contact you soon.</p>
      `,
    });

    return res.status(200).json({ success: true });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error sending email ❌" });
  }
}