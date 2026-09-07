'use client';

/**
 * useContact
 * Client-side hook for the contact form. Handles submission state,
 * error messages, and success feedback without any extra libraries.
 *
 * Usage:
 *   const { status, message, submit } = useContact();
 *   <form onSubmit={(e) => { e.preventDefault(); submit(formData); }}>
 */

import { useState } from 'react';
import { submitContactForm, type ContactFormPayload } from '@/lib/api';

export type ContactStatus = 'idle' | 'submitting' | 'success' | 'error' | 'rate_limited';

export interface UseContactReturn {
  status: ContactStatus;
  message: string;
  submit: (payload: ContactFormPayload) => Promise<void>;
  reset: () => void;
}

export function useContact(): UseContactReturn {
  const [status, setStatus] = useState<ContactStatus>('idle');
  const [message, setMessage] = useState('');

  async function submit(payload: ContactFormPayload) {
    if (status === 'submitting') return;

    setStatus('submitting');
    setMessage('');

    const res = await submitContactForm(payload);

    if (res.status === 429 || res.emptyState?.reason === 'rate_limited') {
      setStatus('rate_limited');
      setMessage('Too many requests. Please try again in an hour.');
      return;
    }

    if (res.data?.success) {
      setStatus('success');
      setMessage(res.data.message || 'Message sent! I'll get back to you soon.');
      return;
    }

    // Validation error (422) or server error
    setStatus('error');
    setMessage(
      res.data?.message ||
        res.error ||
        'Something went wrong. Please try again.'
    );
  }

  function reset() {
    setStatus('idle');
    setMessage('');
  }

  return { status, message, submit, reset };
}