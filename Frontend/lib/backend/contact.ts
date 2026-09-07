import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(200),
  message: z.string().min(20, 'Message must be at least 20 characters').max(2000),
  _honeypot: z.string().max(0, 'Bot detected').optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export function validateContact(
  data: unknown
): { success: true; data: ContactInput } | { success: false; errors: Record<string, string> } {
  const result = contactSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors: Record<string, string> = {};
  result.error.errors.forEach((e) => {
    const field = e.path[0] as string;
    if (field) {
      errors[field] = e.message;
    }
  });

  return { success: false, errors };
}

export async function sendContactEmail(
  data: ContactInput
): Promise<{ success: boolean; message: string; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const targetEmail = process.env.CONTACT_EMAIL || 'contact@example.com';

  if (!apiKey) {
    console.log('[Mailer] Resend API key not set — simulating successful dispatch:', data);
    return {
      success: true,
      message: 'Message received! (Email service in demonstration mode)',
    };
  }

  try {
    const { Resend } = await import('resend');
    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: targetEmail,
      reply_to: data.email,
      subject: `[Portfolio] ${data.subject}`,
      html: `<h2>New Portfolio Contact</h2>
<p><strong>From:</strong> ${data.name} &lt;${data.email}&gt;</p>
<p><strong>Subject:</strong> ${data.subject}</p>
<p><strong>Message:</strong></p>
<p style="white-space: pre-wrap; background: #f9f9f9; padding: 12px; border-radius: 4px;">${data.message}</p>`,
    });

    if (error) {
      console.error('[Mailer] Resend error:', error);
      return { success: false, message: 'Failed to dispatch email', error: error.message };
    }

    return { success: true, message: 'Message sent successfully!' };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal error';
    return { success: false, message: 'Unexpected email delivery failure', error: message };
  }
}
