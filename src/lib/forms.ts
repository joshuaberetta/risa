// Shared with contact-form/build_xlsform.py, which builds the Kobo form behind
// the site's forms: change both together.

/** A select option's code in Kobo: its label, lower case, with runs of anything else as _. */
export const slug = (label: string) =>
  label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

/** The hidden field bots fill in (contact-form: HONEYPOT). */
export const HONEYPOT = 'website';
