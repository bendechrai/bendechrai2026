import type { Context } from "@netlify/functions";

export default async (request: Request, _context: Context) => {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { name, message } = await request.json();

  if (!name?.trim() || !message?.trim()) {
    return new Response(JSON.stringify({ error: "Name and message are required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const toEmail = process.env.CONTACT_EMAIL;

  if (!host || !user || !pass || !toEmail) {
    console.error("Missing SMTP env vars");
    return new Response(JSON.stringify({ error: "Messaging not configured" }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Use nodemailer for SMTP delivery
    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.default.createTransport({
      host,
      port,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: `"${name}" <${user}>`,
      to: toEmail,
      subject: `Website message from ${name}`,
      text: message,
      html: `<p><strong>From:</strong> ${name}</p><p>${message.replace(/\n/g, "<br>")}</p>`,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Send failed:", err);
    return new Response(JSON.stringify({ error: "Failed to send message" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
