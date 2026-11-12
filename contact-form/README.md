# contact-form: the website's forms, stored in KoboToolbox

The site's Adopt RISA (`/adopt`) and Feedback (`/feedback`) forms send their answers to a small DigitalOcean Function. The function stores each one as an anonymous submission to the KoboToolbox form "RISA website messages". A Kobo REST service then emails each new message.

```
browser ──POST JSON──▶ contact/submit (DO Function) ──OpenRosa, anonymous──▶ Kobo form ──REST service──▶ email
```

Until the function is deployed, `formEndpoint` in `content/settings/site.yml` is empty, and the forms open an email to the contact address instead. They also do that if sending fails, and without JavaScript.

## What's set up (12 Nov 2026)

| | |
|---|---|
| Kobo project | [RISA website messages](https://kf.kobotoolbox.org/#/forms/aoJVGiaU2BHwRjtwv68VjZ), `aoJVGiaU2BHwRjtwv68VjZ`, owned by `bob_kobo` on kf.kobotoolbox.org |
| Anonymous submissions | On: AnonymousUser has **Add submissions** only. Nobody can view the data without an account |
| Submission URL | `https://kc.kobotoolbox.org/bob_kobo/submission` |
| Email notification | REST service `hWxR2ivxCu2dQWSico4UNG`: every new message goes to joshua@kobotoolbox.org. The subject is "RISA website: new Adopt/Feedback message", and the body lists all the answers and links the data table. It's sent by kobo-mcp's email relay; delivery logs are under the project's REST services |
| Test messages | Two: `913334962` (an endpoint probe) and `913337991` (the end-to-end test). Both marked *Not Approved* |
| Function | Not deployed yet: see [Deploy](#deploy-the-function) |

All of this was set up with kobo-mcp, signed in as `bob_kobo`. Move the project to the partners' organisation account when there is one (SOP §3.7).

## Files

| Path | What |
|---|---|
| `build_xlsform.py` | Writes `RISA_website_messages.xlsx` and `packages/contact/submit/form.json` from the form fields in `content/pages/*.md` |
| `RISA_website_messages.xlsx` | The Kobo form (generated; commit it) |
| `packages/contact/submit/form.json` | The form's questions and choice codes, for the function (generated; commit it) |
| `packages/contact/submit/index.js` | The function |
| `project.yml` | The DigitalOcean Functions project |
| `test.mjs` | Tests the function against a mock Kobo: `npm run test:contact` |
| `.env` | The settings (not committed; no secrets, but kept out of git anyway) |

## How it works

1. The site sends `{ kind, page, …fields, website }` as JSON. It uses `text/plain`, so the browser sends the request straight away, without a CORS preflight.
2. The function only accepts requests from `ALLOWED_ORIGINS`. That stops other sites' pages using it, but it isn't authentication.
   - If the hidden `website` field (a honeypot) has anything in it, the function answers "ok" and stores nothing.
3. It keeps only the fields in `form.json`.
   - A select answer must be one of the form's choice codes.
   - Values are trimmed and capped at 5,000 characters.
   - Unknown fields are dropped, with a warning in the logs.
4. It builds the submission XML as Enketo does: root tag and `id` = the form's uid, one element per answer, and `meta/instanceID`. It then posts the XML to the owner's anonymous OpenRosa URL, with no credentials.
   - 201 means stored.
   - 202 means a duplicate: a retry of a message that was already stored.
   - Kobo accepts the submission without `formhub/uuid` or `__version__`. Only KoboCAT's `/<owner>/submission` takes anonymous posts; KPI's `/submission` answers 404 without a token.

**What anonymous submissions mean.** Anyone who knows the form's uid can submit to it directly, without the site or the function. That's normal for a public form and exposes no data: viewing still needs the owner's account. If spam arrives that way, turn anonymous submissions off and give the function a dedicated submit-only account's token instead.

## Deploy the function

```sh
doctl serverless namespaces create --label risa-website-forms --region fra1   # once
doctl serverless connect risa-website-forms
doctl serverless deploy contact-form
doctl serverless functions get contact/submit --url
```

Put the URL in `formEndpoint` in `content/settings/site.yml`, then push. `doctl` talks to one namespace at a time, so `connect` to hda-website's or kobo.ngo's namespace before deploying their functions.

`contact-form/.env`:

```sh
KOBO_SUBMISSION_URL=https://kc.kobotoolbox.org/bob_kobo/submission
KOBO_ASSET_UID=aoJVGiaU2BHwRjtwv68VjZ
ALLOWED_ORIGINS=https://risa.kobolabs.dev,http://localhost:5173,http://localhost:4173
```

If the project moves to another account, change the owner in `KOBO_SUBMISSION_URL`. On the EU server, use `https://kc-eu.kobotoolbox.org/<owner>/submission`.

## Change the form

When an Adopt or Feedback field changes in `content/pages/`:

```sh
python3 contact-form/build_xlsform.py           # rebuild the xlsx and form.json
python3 contact-form/build_xlsform.py --check   # or just check they're up to date
```

Then:
1. Replace the form in Kobo with the new xlsx and redeploy it. You can use kobo-mcp's `deploy_form` with `redeploy`, or Replace form in the project's ⋯ menu.
2. Redeploy the function, so it gets the new `form.json`.

Rules:
- Add fields; don't rename or delete them once messages exist. That's the same rule as the RISA template.
- `kind`, `page` and `website` are reserved: `lint:content` rejects them as field names.
- The `--check` isn't part of `lint:content`, because the DigitalOcean build has no Python. Run it before you push a form change.

## Test

```sh
npm run test:contact                                                     # mock Kobo, no network
doctl serverless activations logs --function contact/submit --limit 5    # recent logs, after deploying
```

End to end: with `formEndpoint` set, send the Feedback form from `npm run dev` or `npm run preview`. The message appears in the project's data table, and the email arrives. Mark test messages *Not Approved*.
