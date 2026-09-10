// api/contact.ts — Serverless API handler for Vercel & Resend email delivery.

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { name, email, message } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields (name, email, message) are required.' });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      return res.status(500).json({ error: 'RESEND_API_KEY is not configured in environment variables.' });
    }

    const recipientEmail = process.env.CONTACT_EMAIL || 'asahjada786@gmail.com';

    // Call Resend REST API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Portfolio Contact Form <onboarding@resend.dev>',
        to: [recipientEmail],
        reply_to: email,
        subject: `New Portfolio Message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background: #ffffff;">
            <div style="background: linear-gradient(135deg, #0ea5e9, #6366f1); padding: 24px; color: #ffffff; text-align: center;">
              <h2 style="margin: 0; font-size: 22px; font-weight: 700;">📬 New Portfolio Contact Message</h2>
            </div>
            <div style="padding: 28px;">
              <div style="margin-bottom: 18px;">
                <p style="margin: 0 0 4px 0; font-size: 13px; color: #64748b; font-weight: 600; text-transform: uppercase;">From</p>
                <p style="margin: 0; font-size: 16px; font-weight: 600; color: #0f172a;">${name}</p>
              </div>
              <div style="margin-bottom: 22px;">
                <p style="margin: 0 0 4px 0; font-size: 13px; color: #64748b; font-weight: 600; text-transform: uppercase;">Email Address</p>
                <p style="margin: 0; font-size: 15px; color: #0284c7;"><a href="mailto:${email}" style="color: #0284c7; text-decoration: none;">${email}</a></p>
              </div>
              <div style="border-top: 1px solid #e2e8f0; padding-top: 18px;">
                <p style="margin: 0 0 8px 0; font-size: 13px; color: #64748b; font-weight: 600; text-transform: uppercase;">Message</p>
                <div style="white-space: pre-wrap; background: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; color: #334155; font-size: 15px; line-height: 1.6;">${message}</div>
              </div>
            </div>
            <div style="background-color: #f1f5f9; padding: 14px; font-size: 12px; color: #64748b; text-align: center; border-top: 1px solid #e2e8f0;">
              Sent from your portfolio website • Reply directly to this email to contact ${name}
            </div>
          </div>
        `,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Resend API error:', data);
      return res.status(response.status).json({
        error: data.message || 'Failed to send email via Resend',
      });
    }

    return res.status(200).json({ success: true, id: data.id });
  } catch (error: any) {
    console.error('Error handling contact form:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
