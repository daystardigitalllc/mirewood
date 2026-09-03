// Cloudflare Pages Function: POST /api/contact
// Receives the "Let's Chat" inquiry form and emails it via Resend.
// Requires an environment variable RESEND_API_KEY set in the Cloudflare
// Pages project settings (Settings -> Environment Variables).

const NOTIFY_EMAIL = 'Tracihp12@icloud.com';

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function onRequestPost({ request, env }) {
  let data;
  try {
    data = await request.json();
  } catch {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  // Honeypot: bots fill every field, real users never see or fill this one.
  if (data.company) {
    return Response.json({ ok: true });
  }

  const firstName = (data.firstName || '').trim();
  const lastName = (data.lastName || '').trim();
  const email = (data.email || '').trim();
  const phone = (data.phone || '').trim();
  const eventDate = (data.eventDate || '').trim();
  const details = (data.details || '').trim();

  if (!firstName || !lastName || !email || !phone || !eventDate) {
    return Response.json({ error: 'Please fill in all required fields.' }, { status: 400 });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return Response.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }

  if (!env.RESEND_API_KEY) {
    return Response.json({ error: 'Email service is not configured.' }, { status: 500 });
  }

  const subject = `New Event Inquiry — ${firstName} ${lastName} (${eventDate})`;
  const html = `
    <h2>New Event Inquiry from Mirewood Events website</h2>
    <p><strong>Name:</strong> ${escapeHtml(firstName)} ${escapeHtml(lastName)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
    <p><strong>Event Date:</strong> ${escapeHtml(eventDate)}</p>
    <p><strong>Details:</strong></p>
    <p>${escapeHtml(details).replace(/\n/g, '<br>') || '(none provided)'}</p>
  `;

  const resendResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Mirewood Events Website <inquiries@themirewood.com>',
      to: [NOTIFY_EMAIL],
      reply_to: email,
      subject,
      html,
    }),
  });

  if (!resendResponse.ok) {
    const errBody = await resendResponse.text();
    console.error('Resend error:', errBody);
    return Response.json({ error: 'Failed to send email.' }, { status: 502 });
  }

  return Response.json({ ok: true });
}
