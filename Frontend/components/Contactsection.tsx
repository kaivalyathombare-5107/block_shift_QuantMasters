'use client';

/**
 * components/ContactSection.tsx
 *
 * Client Component — handles the contact form with live submission,
 * state feedback, honeypot spam protection, and rate-limit messaging.
 *
 * Place this file at: Frontend/components/ContactSection.tsx
 */

import { useState, useRef } from 'react';
import { ArrowUpRight, Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useContact } from '@/hooks/useContact';

export default function ContactSection() {
  const { status, message, submit, reset } = useContact();

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const subjectRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await submit({
      name: nameRef.current?.value ?? '',
      email: emailRef.current?.value ?? '',
      subject: subjectRef.current?.value ?? '',
      message: messageRef.current?.value ?? '',
      // honeypot — left empty; bots fill it and get silently dropped
      _honeypot: '',
    });
  }

  const inputClass =
    'rounded-md border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-accent w-full transition';

  return (
    <section
      id="connect"
      className="mx-auto max-w-6xl scroll-mt-24 border-t border-border px-5 py-24 md:px-8"
    >
      <div className="grid gap-12 md:grid-cols-2">
        {/* ── Left column ── */}
        <div>
          <div className="mb-5 font-mono text-[11px] uppercase tracking-[.22em] text-muted">
            <span className="text-accent">008</span>
            <span className="mx-2 text-[#48505c]">/</span>Connect
          </div>
          <h2 className="font-display text-5xl tracking-tight">
            Have a hard problem?
            <br />
            <span className="text-accent">Let&apos;s talk.</span>
          </h2>
          <p className="mt-6 max-w-md leading-7 text-muted">
            Open to thoughtful collaborations, product architecture, and ambitious experiments.
          </p>
          <div className="mt-10 space-y-2">
            <a
              href="mailto:hello@example.com"
              className="flex items-center justify-between border-b border-border py-4 text-sm transition hover:pl-2 hover:text-accent"
            >
              <span className="flex items-center gap-3">
                <Mail size={16} /> hello@example.com
              </span>
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>

        {/* ── Right column — form ── */}
        <div>
          {status === 'success' ? (
            <div className="flex flex-col items-start gap-4 rounded-md border border-[#73d69b]/40 bg-[#73d69b]/10 p-8">
              <CheckCircle size={24} className="text-[#73d69b]" />
              <p className="font-display text-2xl">Message received.</p>
              <p className="text-sm text-muted">{message}</p>
              <button
                onClick={reset}
                className="mt-2 font-mono text-xs uppercase tracking-widest text-accent hover:underline"
              >
                Send another
              </button>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
              {/* Hidden honeypot — must NOT have a label or placeholder */}
              <input
                type="text"
                name="_honeypot"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{ display: 'none' }}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <input
                  ref={nameRef}
                  required
                  aria-label="Name"
                  placeholder="Your name"
                  className={inputClass}
                  disabled={status === 'submitting'}
                />
                <input
                  ref={emailRef}
                  required
                  type="email"
                  aria-label="Email"
                  placeholder="Email address"
                  className={inputClass}
                  disabled={status === 'submitting'}
                />
              </div>
              <input
                ref={subjectRef}
                required
                aria-label="Subject"
                placeholder="What are we building?"
                className={inputClass}
                disabled={status === 'submitting'}
              />
              <textarea
                ref={messageRef}
                required
                aria-label="Message"
                placeholder="A few words to start..."
                rows={6}
                className={`${inputClass} resize-none`}
                disabled={status === 'submitting'}
              />

              {/* Error / rate-limit feedback */}
              {(status === 'error' || status === 'rate_limited') && (
                <div className="flex items-start gap-3 rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  <span>{message}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="inline-flex items-center gap-3 rounded-full bg-accent px-6 py-3 text-sm font-medium text-[#08101d] transition hover:bg-[#9bc2ff] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 size={15} className="animate-spin" /> Sending…
                  </>
                ) : (
                  <>
                    Send message <ArrowUpRight size={15} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}