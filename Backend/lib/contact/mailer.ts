import { serverEnv } from '@/lib/config/env';
import type { ContactInput } from './validation';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildEmailHTML(data: ContactInput): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Portfolio Contact</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1f2937;">
  <h2 style="color: #2563eb; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">New Portfolio Contact</h2>
  <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
    <tr>
      <td style="padding: 8px; font-weight: bold; width: 80px; color: #4b5563;">From:</td>
      <td style="padding: 8px;">${escapeHtml(data.name)} &lt;${escapeHtml(data.email)}&gt;</td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold; color: #4b5563;">Subject:</td>
      <td style="padding: 8px;">${escapeHtml(data.subject)}</td>
    </tr>
  </table>
  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
  <h3 style="color: #374151; margin-bottom: 8px;">Message:</h3>
  <p style="white-space: pre-wrap; background-color: #f9fafb; padding: 16px; border-radius: 6px; border: 1px solid #e5e7eb; line-height: 1.6;">${escapeHtml(
    data.message
  )}</p>
</body>
</html>`;
}

export async function sendContactEmail(
  data: ContactInput
): Promise<{ success: boolean; error?: string }> {
  let apiKey = '';
  let targetEmail = '';
  let isDev = false;

  try {
    apiKey = serverEnv.resendApiKey;
    targetEmail = serverEnv.contactEmail;
    isDev = serverEnv.nodeEnv === 'development';
  } catch {
    // env fallback
  }

  if (!apiKey || !targetEmail) {
    console.warn('[Mailer] Resend not configured — contact form submission discarded');
    if (isDev) {
      console.log('[Mailer DEV] Would send email:', data);
      return { success: true };
    }
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const { Resend } = await import('resend');
    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: targetEmail,
      reply_to: data.email,
      subject: `[Portfolio] ${data.subject}`,
      html: buildEmailHTML(data),
    });

    if (error) {
      console.error('[Mailer] Resend error:', error);
      return { success: false, error: 'Failed to send email' };
    }

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal error';
    console.error('[Mailer] Unexpected error sending contact email:', err);
    return { success: false, error: message };
  }
}
