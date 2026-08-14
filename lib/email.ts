import nodemailer from "nodemailer";

// Server-only transactional sender (signup notifications, attendee
// confirmations, contact form). Sends via Gmail SMTP as EMAIL_USER —
// crystalseedtarot@gmail.com — so mail is first-party with no third-party
// activation step. Replaces FormSubmit, which held every email behind an
// unclicked activation link while still reporting success.

type SendArgs = {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
};

export async function sendEmail({ to, subject, text, replyTo }: SendArgs) {
  const host = process.env.EMAIL_HOST;
  const port = Number(process.env.EMAIL_PORT || 587);
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  if (!host || !user || !pass) throw new Error("EMAIL_* env vars not configured");

  // Fresh transport per send: trivial at this volume, and avoids stale
  // pooled connections across serverless invocations.
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: `"Crystal Seed Tarot" <${user}>`,
    to,
    subject,
    text,
    ...(replyTo ? { replyTo } : {}),
  });
}
