import { Button, NativeSelect, TextInput, Textarea } from '@mantine/core';
import { useEffect, useState, type FormEvent } from 'react';
import { site } from '../../lib/content';
import { HONEYPOT, slug } from '../../lib/forms';
import type { FormField, FormSection as FormData } from '../../lib/types';
import { Blocks } from '../Blocks';
import { Tbc } from '../Typography';
import { Section } from './Section';
import classes from './FormSection.module.css';

/**
 * A real form. With `formEndpoint` set in site.yml, it sends the answers to
 * the contact-form function, which stores them as a submission to the RISA
 * website messages form in KoboToolbox (contact-form/README.md). Without one,
 * or if sending fails, it opens an email to the contact address instead, as
 * it also does without JavaScript (the form's mailto: action).
 *
 * Fields with `param` are prefilled from the link, so the feedback QR code on
 * a printed map can say which site, product and version it came from
 * (?site=&product=&version=, the dashboard's FEEDBACK_URL).
 */
export function FormSection({ section }: { section: FormData }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'failed' | 'mailed'>('idle');
  const [fromLink, setFromLink] = useState<Record<string, string>>({});
  const endpoint = site.formEndpoint;
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const prefill = Object.fromEntries(
      section.fields.filter((f) => f.param && params.get(f.param)).map((f) => [f.name, params.get(f.param!)!.slice(0, 200)]),
    );
    setFromLink(prefill);
    if (Object.keys(prefill).length) setValues((v) => ({ ...prefill, ...v }));
  }, [section.fields]);

  const set = (name: string) => (value: string) => setValues((v) => ({ ...v, [name]: value }));
  const mailto = () => {
    const lines = section.fields.map((f) => `${f.label}: ${values[f.name]?.trim() || '-'}`);
    return `mailto:${site.contact}?subject=${encodeURIComponent(section.subject)}&body=${encodeURIComponent(lines.join('\n\n'))}`;
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!endpoint) {
      window.location.href = mailto();
      setState('mailed');
      return;
    }
    setState('sending');
    // Select answers go to Kobo as their choice codes.
    const answers = Object.fromEntries(
      section.fields.map((f) => [f.name, f.type === 'select' && values[f.name] ? slug(values[f.name]) : (values[f.name] ?? '')]),
    );
    const honeypot = (new FormData(e.currentTarget).get(HONEYPOT) as string | null) ?? '';
    try {
      // text/plain keeps this a "simple" request, so the browser doesn't send a preflight first.
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
        body: JSON.stringify({ kind: section.kind, page: window.location.pathname, ...answers, [HONEYPOT]: honeypot }),
      });
      const out = (await res.json().catch(() => ({}))) as { ok?: boolean };
      if (!res.ok || !out.ok) throw new Error(String(res.status));
      setState('sent');
      setValues(fromLink);
    } catch {
      setState('failed');
    }
  };

  return (
    <Section section={section}>
      <Blocks body={section.body} />
      <form className={classes.form} onSubmit={submit} action={`mailto:${site.contact}`} method="post" encType="text/plain">
        {section.fields.map((f) => (
          <Field key={f.name} field={f} value={values[f.name] ?? ''} onChange={set(f.name)} />
        ))}
        {/* Hidden from people; bots fill it in, and the function then stores nothing. */}
        <div className={classes.trap} aria-hidden="true">
          <label>
            Leave this empty
            <input type="text" name={HONEYPOT} tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <Button type="submit" className={classes.submit} loading={state === 'sending'}>
          {endpoint ? section.submit : 'Write the email'}
        </Button>
        {state === 'sent' && (
          <p className={classes.sent} role="status">
            Thank you. Your message has reached the RISA partners.
          </p>
        )}
        {state === 'failed' && (
          <p className={classes.sent} role="alert">
            We couldn’t send it. Please <a href={mailto()}>send it by email instead</a>: your answers are filled in.
          </p>
        )}
        {state === 'mailed' && (
          <p className={classes.sent} role="status">
            Your email app should have opened with the message ready. If it didn’t, write to {site.contact}.
          </p>
        )}
        <p className={classes.how}>
          {endpoint ? (
            <>Your answers are stored by the RISA partners and read by the working group.</>
          ) : (
            <>
              This opens an email to <a href={`mailto:${site.contact}`}>{site.contact}</a>
              {site.contactTbc && <Tbc>address to be confirmed</Tbc>} in your email app, with your answers filled in. Nothing is sent until you send it.
            </>
          )}{' '}
          There is no helpdesk and no promised response time.
        </p>
      </form>
    </Section>
  );
}

function Field({ field: f, value, onChange }: { field: FormField; value: string; onChange: (v: string) => void }) {
  const common = { label: f.label, description: f.hint, required: f.required, name: f.name, value, className: classes.field };
  if (f.type === 'textarea') return <Textarea {...common} autosize minRows={4} onChange={(e) => onChange(e.currentTarget.value)} />;
  // A native select, so the form works before (or without) JavaScript.
  if (f.type === 'select') return <NativeSelect {...common} data={['', ...(f.options ?? [])]} onChange={(e) => onChange(e.currentTarget.value)} />;
  return (
    <TextInput
      {...common}
      type={f.type}
      autoComplete={f.type === 'email' ? 'email' : f.name === 'name' ? 'name' : f.name === 'organisation' ? 'organization' : undefined}
      onChange={(e) => onChange(e.currentTarget.value)}
    />
  );
}
