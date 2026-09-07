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
