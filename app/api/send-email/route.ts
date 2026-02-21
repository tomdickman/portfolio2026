import { createTransport } from "nodemailer";
import sanitizeHtml from "sanitize-html";

export async function POST(request: Request) {
  console.log('root was hit')
  try {
    const { name, email, message } = await request.json();

    // Sanitise all user inputs.
    const sanitised = {
      name: sanitizeHtml(name, { allowedTags: [] }),
      email: sanitizeHtml(email, { allowedTags: [] }),
      message: sanitizeHtml(message, { allowedTags: [] }),
    };

    const transporter = createTransport({
      host: "smtp.zoho.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.ZOHO_USERNAME,
        pass: process.env.ZOHO_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.ZOHO_EMAIL,
      to: process.env.ZOHO_EMAIL,
      replyTo: sanitised.email,
      subject: `Contact Form: ${name}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>From:</strong> ${sanitised.name} (${sanitised.email})</p>
        <p><strong>Message:</strong></p>
        <p>${sanitised.message}</p>
      `,
    });

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Email error:", error);
    return Response.json({ error: "Failed to send email" }, { status: 500 });
  }
}
