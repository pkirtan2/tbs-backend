import nodemailer from "nodemailer";

export default async function handler(req, res) {

  // ✅ ADD THESE LINES (VERY IMPORTANT)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ HANDLE PREFLIGHT REQUEST
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // ❗ KEEP THIS AFTER OPTIONS
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
      tls: {
        rejectUnauthorized: false,
      },
    });

    // your email sending code...
    await transporter.sendMail({
      from: `"Website Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "New Contact Form Message 📩",
      html: `
        <div style="font-family:Arial, sans-serif; background:#0b1220; padding:30px;">

  <div style="
    max-width:600px;
    margin:auto;
    background:#0f172a;
    padding:25px;
    border-radius:10px;
    color:#ffffff;
  ">

    <h2 style="color:#22c55e; margin-bottom:20px;">
      New Inquiry 📩
    </h2>

    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone || "Not provided"}</p>

    <p style="margin-top:20px;"><strong>Message:</strong></p>

    <div style="
      background:#1e293b;
      padding:12px;
      border-radius:6px;
      margin-top:8px;
      color:#e5e7eb;
    ">
      ${message}
    </div>

  </div>

</div>
      `,
    });

    await transporter.sendMail({
      from: `"Trustellar" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "We Received Your Request ✅",
      html: `
        <div style="font-family:Arial, sans-serif; background:#0f172a; color:#ffffff; padding:20px; border-radius:8px;">
  
  <h2 style="color:#60a5fa;">Trustellar Business Solutions</h2>

  <p>Hi ${name},</p>

  <p>
    Thanks for reaching out! We have received your request and our team
    will get back to you shortly.
  </p>

  <hr style="border:0.5px solid #374151; margin:20px 0;" />

  <h3>Your Details:</h3>

  <p><strong>Name:</strong> ${name}</p>
  <p><strong>Email:</strong> ${email}</p>
  <p><strong>Phone:</strong> ${phone || "Not provided"}</p>

  <hr style="border:0.5px solid #374151; margin:20px 0;" />

  <p style="color:#9ca3af; font-size:12px;">
    This is an automated message. Please do not reply.
  </p>

  <p>
    Best Regards,<br/>
    <strong>Trustellar Team</strong>
  </p>

</div>
      `,
    });

    return res.status(200).json({ success: true });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error sending email ❌" });
  }
}