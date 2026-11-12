// Nothing on the site may carry a login. The old shared Kobo account leaked
// into one source document; these catch it, any API token, and any
// "password: …" (the word alone is fine: guides explain what a QR code
// carries). Used by validate-content.mjs (content and downloads) and
// prerender.mjs (every page it writes).
export const CREDENTIALS = [/password\s*[:=]/i, /undac123/i, /atlasdak/i, /Token [0-9a-f]{20,}/];

/** The patterns `text` matches. */
export const credentialsIn = (text) => CREDENTIALS.filter((re) => re.test(text));
