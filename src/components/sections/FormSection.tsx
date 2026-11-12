import { Button, NativeSelect, TextInput, Textarea } from '@mantine/core';
import { useEffect, useState, type FormEvent } from 'react';
import { site } from '../../lib/content';
import type { FormField, FormSection as FormData } from '../../lib/types';
import { Blocks } from '../Blocks';
import { Tbc } from '../Typography';
import { Section } from './Section';
import classes from './FormSection.module.css';

/**
 * A real form that submits by opening an email to the contact address (as in
 * hda-website). Fields with `param` are prefilled from the link, so the
 * feedback QR code on a printed map can say which site, product and version
 * it came from (?site=&product=&version=, the dashboard's FEEDBACK_URL).
 */
export function FormSection({ section }: { section: FormData }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromLink = Object.fromEntries(
      section.fields.filter((f) => f.param && params.get(f.param)).map((f) => [f.name, params.get(f.param!)!.slice(0, 200)]),
    );
    if (Object.keys(fromLink).length) setValues((v) => ({ ...fromLink, ...v }));
  }, [section.fields]);

  const set = (name: string) => (value: string) => setValues((v) => ({ ...v, [name]: value }));
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const lines = section.fields.map((f) => `${f.label}: ${values[f.name]?.trim() || '-'}`);
    const href = `mailto:${site.contact}?subject=${encodeURIComponent(section.subject)}&body=${encodeURIComponent(lines.join('\n\n'))}`;
    window.location.href = href;
    setSent(true);
  };

  return (
    <Section section={section}>
      <Blocks body={section.body} />
      <form className={classes.form} onSubmit={submit} action={`mailto:${site.contact}`} method="post" encType="text/plain">
        {section.fields.map((f) => (
          <Field key={f.name} field={f} value={values[f.name] ?? ''} onChange={set(f.name)} />
        ))}
        <Button type="submit" className={classes.submit}>
          {section.submit}
        </Button>
        <p className={classes.how}>
          This opens an email to <a href={`mailto:${site.contact}`}>{site.contact}</a>
          {site.contactTbc && <Tbc>address to be confirmed</Tbc>} in your email app, with your answers filled in. Nothing is sent until you send it.
          There is no helpdesk and no promised response time.
        </p>
        {sent && (
          <p className={classes.sent} role="status">
            Your email app should have opened with the message ready. If it didn’t, write to {site.contact}.
          </p>
        )}
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
