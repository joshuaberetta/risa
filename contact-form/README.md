# contact-form: the website's forms, stored in KoboToolbox

The site's Adopt RISA (`/adopt`) and Feedback (`/feedback`) forms send their answers to a small DigitalOcean Function. The function stores them as one submission to a KoboToolbox form, "RISA website messages". From there, Kobo's REST services (webhooks) can send email notifications or anything else, and every message is kept, exportable like any Kobo data.

```
browser ──POST JSON──▶ contact/submit (DO Function) ──OpenRosa──▶ KoboToolbox form ──REST service──▶ email, Slack…
```

Until the function is set up, `formEndpoint` in `content/settings/site.yml` is empty, and the forms open an email to the contact address instead. They also do that if sending fails, and without JavaScript.

| Path | What |
|---|---|
| `build_xlsform.py` | Writes `RISA_website_messages.xlsx` from the form fields in `content/pages/*.md` |
| `RISA_website_messages.xlsx` | The Kobo form (generated; commit it) |
| `packages/contact/submit/index.js` | The function |
| `project.yml` | The DigitalOcean Functions project |
| `test.mjs` | Tests the function against a mock Kobo server: `npm run test:contact` |
| `.env` | The secrets (not committed) |

## How it works

1. The site sends `{ kind, page, …fields, website }` as JSON. It uses `text/plain`, so the browser sends the request straight away, without a CORS preflight.
2. The function only accepts requests from `ALLOWED_ORIGINS`. That stops other sites' pages using it, but it isn't authentication.
   - If the hidden `website` field (a honeypot) has anything in it, the function answers "ok" and stores nothing.
3. It reads the **deployed** Kobo form's questions and choice codes, and caches them for five minutes.
   - Only fields the form has are kept. Others are dropped, with a warning in the logs.
   - A select answer must be one of the form's choice codes.
   - Values are trimmed and capped at 5,000 characters.
4. It builds the submission XML as Collect and Enketo do, and as kobo-mcp's `create_submissions` does: root tag and `id` = the form's uid, `formhub/uuid`, `__version__`, `meta/instanceID`. It then posts the XML to `{KOBO_SERVER}/submission` with the dedicated account's token.
   - 201 means stored.
   - 202 means a duplicate: a retry of a message that was already stored.

The Kobo form is flat:

| Question | What it holds |
|---|---|
| `kind` | `adopt` or `feedback` |
| `page` | The path the message was sent from |
| One question per site field | Same name; select options become choice codes, slugs of their labels (`src/lib/forms.ts`) |

Fields both pages share (`name`, `email`, `message`) are one question. Required fields are checked by the site. Kobo can't enforce them, because a field required on one page may not exist on the other.

## Set it up

Follow SOP §3.7 (accounts and ownership): the form belongs to an organisation account, and the function uses a dedicated account, never a person's.

1. **Choose the server.** Use `https://kf.kobotoolbox.org` (global) or `https://eu.kobotoolbox.org` (EU), depending on where the messages may be stored. They hold names and email addresses.
2. **Create the form.** In the organisation's Kobo account, create a project from `RISA_website_messages.xlsx`, then deploy it. Its uid is in the URL: `…/#/forms/<uid>/…`.
3. **Create the sending account.** Make a dedicated Kobo account (for example `risa-website-forms`) that owns nothing. Share the form with it with **Add submissions** only.
   - Get that account's API token: Account settings → Security → API key, or `<server>/token/`.
   - The token gives full access to that account, so the account must have access to nothing else.
4. **Put the settings in `contact-form/.env`.** It's gitignored; never commit it.
   ```sh
   KOBO_SERVER=https://kf.kobotoolbox.org
   KOBO_TOKEN=…
   KOBO_ASSET_UID=a…
   ALLOWED_ORIGINS=https://risa.kobolabs.dev,http://localhost:5173,http://localhost:4173
   ```
5. **Deploy the function.**
   ```sh
   doctl serverless namespaces create --label risa-website-forms --region fra1   # once
   doctl serverless connect risa-website-forms
   doctl serverless deploy contact-form
   doctl serverless functions get contact/submit --url
   ```
   `doctl` talks to one namespace at a time. To deploy hda-website's or kobo.ngo's functions afterwards, `connect` to theirs first.
6. **Point the site at it.** Put the URL in `formEndpoint` in `content/settings/site.yml`, then push.
7. **Notifications.** In the Kobo project, go to Settings → REST Services → Register a new service. Kobo POSTs each new submission as JSON to the endpoint you give.
   - Any email relay works: a Zapier, Make or n8n webhook, or another small function.
   - The JSON has `kind`, so one service can route Adopt and Feedback messages differently.
   - Kobo's docs: <https://support.kobotoolbox.org/rest_services.html>.

## Change the form

When an Adopt or Feedback field changes in `content/pages/`:

```sh
python3 contact-form/build_xlsform.py           # rebuild the xlsx
python3 contact-form/build_xlsform.py --check   # or just check it's up to date
```

Then, in Kobo, **replace** the form with the new file (the project's ⋯ menu → Replace form) and redeploy. The function picks up the change within five minutes.

- Add fields; don't rename or delete them once messages exist. That's the same rule as the RISA template.
- `kind`, `page` and `website` are reserved: `lint:content` rejects them as field names.
- A field that's on the site but not yet in the deployed form is dropped, not stored. Its name is in the function's logs.

The `--check` isn't part of `lint:content`, because the DigitalOcean build has no Python. Run it before you push a form change.

## Test

```sh
npm run test:contact                                                     # mock Kobo, no account needed
doctl serverless activations logs --function contact/submit --limit 5    # recent logs, after deploying
```

To try the real thing end to end, set `formEndpoint` and run `npm run dev`. Send the Feedback form, and the message appears in the Kobo project's Data table. Mark test messages *Not Approved*, or delete them.
