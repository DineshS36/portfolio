// Cloudflare Worker Entrypoint - Serves Static Assets & Handles /api/send-email

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 1. API Route: /api/send-email
    if (url.pathname === '/api/send-email') {
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          status: 204,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        });
      }

      if (request.method !== 'POST') {
        return new Response(
          JSON.stringify({ success: false, error: 'Method not allowed' }),
          { status: 405, headers: { 'Content-Type': 'application/json' } }
        );
      }

      try {
        const payload = await request.json().catch(() => ({}));
        const { senderName, senderEmail, senderMessage } = payload || {};

        if (!senderName?.trim()) {
          return new Response(
            JSON.stringify({ success: false, error: 'Name is required.' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
        }

        if (!senderMessage?.trim()) {
          return new Response(
            JSON.stringify({ success: false, error: 'Message is required.' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
        }

        const apiKey =
          env?.RESEND_API_KEY ||
          (typeof process !== 'undefined' ? process.env?.RESEND_API_KEY : null);

        if (!apiKey) {
          console.error('RESEND_API_KEY is not configured in Cloudflare environment.');
          return new Response(
            JSON.stringify({
              success: false,
              error: 'Server configuration error: RESEND_API_KEY is not set on Cloudflare.',
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
          );
        }

        const cleanEmail =
          senderEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(senderEmail.trim())
            ? senderEmail.trim()
            : null;

        const escapeHtml = (str) =>
          str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');

        const safeName = escapeHtml(senderName.trim());
        const safeEmail = cleanEmail ? escapeHtml(cleanEmail) : 'Not provided';
        const safeMessage = escapeHtml(senderMessage.trim());

        const emailHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #08080c; color: #f8fafc; margin: 0; padding: 24px; }
              .container { max-width: 600px; margin: 0 auto; background: #0e0e16; border: 1px solid rgba(255,255,255,0.12); border-radius: 16px; padding: 32px; box-shadow: 0 20px 50px rgba(0,0,0,0.6); }
              .header { border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 20px; margin-bottom: 24px; }
              .eyebrow { font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #60a5fa; font-weight: 600; }
              .title { font-size: 22px; font-weight: 700; color: #ffffff; margin: 6px 0 0 0; }
              .field-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #94a3b8; margin-bottom: 4px; }
              .field-value { font-size: 15px; color: #ffffff; margin-bottom: 20px; font-weight: 500; }
              .field-value a { color: #38bdf8; text-decoration: none; }
              .message-box { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 18px; color: #e2e8f0; font-size: 14px; line-height: 1.65; white-space: pre-wrap; word-break: break-word; font-family: 'SFMono-Regular', Consolas, monospace; }
              .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 12px; color: #64748b; text-align: center; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="eyebrow">🚀 Transmission Received</div>
                <div class="title">New Message from Portfolio</div>
              </div>
              <div class="field-label">Sender</div>
              <div class="field-value">${safeName}</div>
              <div class="field-label">Email Address</div>
              <div class="field-value">${cleanEmail ? `<a href="mailto:${safeEmail}">${safeEmail}</a>` : '<span style="color:#94a3b8;">Not provided</span>'}</div>
              <div class="field-label">Message Payload</div>
              <div class="message-box">${safeMessage}</div>
              <div class="footer">
                Dispatched from Dinesh Portfolio Beacon • ${new Date().toUTCString()}
              </div>
            </div>
          </body>
          </html>
        `;

        const emailPayload = {
          from: 'Portfolio Contact <onboarding@resend.dev>',
          to: ['itsdinesh036@gmail.com'],
          subject: `[Portfolio Inquiry] ${senderName.trim()}`,
          html: emailHtml,
          text: `Name: ${senderName}\nEmail: ${cleanEmail || 'Not provided'}\n\nMessage:\n${senderMessage}`,
        };

        if (cleanEmail) {
          emailPayload.reply_to = cleanEmail;
        }

        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey.trim()}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(emailPayload),
        });

        const resendData = await resendRes.json();

        if (!resendRes.ok) {
          return new Response(
            JSON.stringify({
              success: false,
              error: resendData?.message || 'Failed to dispatch email via Resend API.',
            }),
            { status: resendRes.status, headers: { 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({
            success: true,
            message: 'Email dispatched successfully.',
            id: resendData?.id,
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      } catch (err) {
        return new Response(
          JSON.stringify({ success: false, error: err?.message || 'Server error' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // 2. Static Assets fallback (Serves the React portfolio frontend)
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('Not found', { status: 404 });
  },
};
