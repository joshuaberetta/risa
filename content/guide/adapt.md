---
title: Adapt it to a new emergency
order: 3
annexRef: Annex A §3, Annex F §3, §15
summary: Put the country's admin areas, sites and organisations into the template, check it and deploy it, with an AI assistant or by hand.
lastChecked: 2026-11-12
---
Every deployment adapts the template for the country before the first upload. You replace the placeholder places with real ones, add the organisations on site, add a language if needed, then check, test and deploy.

Start from the template, not from the last country's form. That keeps the names and codes the dashboard and the GIS team expect. Work on a copy named for the country, for example `RISA_BHS_2026112001.xlsx`.

## What to change

The `adapt` sheet inside the template holds this checklist.

| Topic | Step |
|---|---|
| Settings | Keep `form_id` as `risa_obs`, or append the ISO3 code (`risa_obs_bhs`). Add the country to `form_title`. Set `version` to today's date and 01. |
| Admin areas | Replace the placeholder `level_1` and `level_2` lists with the country's COD-AB (administrative boundaries) from [HDX](https://data.humdata.org/): the P-code as `name`, the admin name as label. Each `level_2` row carries its parent P-code in the `level_1` column. Delete every placeholder XX row. Relabel the questions if the country uses other terms (island, parish). |
| Sites | Replace the placeholder `site` list with the camps and collective centres to assess. Use the CCCM or DTM site code if one exists; otherwise build one from the district P-code (BS0101 becomes BS010101). Each site row carries its district P-code in the `level_2` column. Keep the `other` row last. |
| Organisations | Add the agencies working on site to the `org` list. Keep the seven existing codes. |
| Feature types | Don't rename a feature-type code: they are the dashboard's map symbols. To add a type, add a row with its sector and tell the dashboard team, so it gets a map symbol. A type the country doesn't need can be deleted before the first deployment, or left in. |
| Languages | English is the reference. See [Add a language](/guide/languages). |
| Extra questions | Add detail questions inside the `obs` group, after the existing ones, shown only for the relevant feature type. Each question with an "other" choice gets its own `<name>_other` text question. |
| Server | Choose the server with the host authority, for data residency. See [Accounts and ownership](/guide/accounts). |
| Check | Convert the form, fill one observation of each type you use on a real device, offline, then look at the data. See [Test, then deploy](/guide/test-and-deploy). |

Names are snake_case ASCII, 32 characters or fewer, and unique across the form. `other` is the only code for "other".

## Two routes

:::tabs
::tab With an AI assistant (kobo-mcp) | recommended
kobo-mcp is a remote MCP server that lets an AI assistant, such as Claude, work with your KoboToolbox projects. It runs at `https://mcp.kobolabs.dev/mcp`. Setup instructions for each assistant are at [mcp.kobolabs.dev](https://mcp.kobolabs.dev).

### 1. Connect with your own account

1. Get the API token of **your own** KoboToolbox account: sign in, then open Account Settings, Security, API Key.
2. Add kobo-mcp to your assistant, following the setup instructions. The sign-in page asks for that token and the server (Global or EU). It never asks for a password and never needs a shared login.
3. The assistant sees what your account can see and acts as your account, so the project permissions still apply. Connect an account with only the permissions the task needs.

Never paste a token into the chat.

### 2. Adapt the template

Give the assistant the template file, then ask in plain language.

```prompt
Here is the RISA template. Replace the admin areas with the COD-AB P-codes for <country> (admin 1 and 2) from HDX, and the site list with these camps: …
Keep the parent columns, delete every XX placeholder row, and keep the other site last.
```

```prompt
Set the organisations to … Keep the seven existing codes.
```

```prompt
Set form_title to "RISA site observation - <country>", form_id to risa_obs_<iso3>, and version to today's date and 01.
```

To add a language, see [Add a language](/guide/languages).

### 3. Check and preview

```prompt tool=convert_xlsform
Check the form.
```

`convert_xlsform` converts the file as KoboToolbox would and reports errors.

```prompt tool=preview_form
Show me the form.
```

`preview_form` lets you fill the form in inside the chat before it is deployed. It is a close approximation, not Enketo: maps and pages are left out. You still need the device test.

### 4. Deploy

```prompt tool=deploy_form
Deploy it as a new project called RISA_<ISO3>_<site>.
```

Starting from a public "RISA template" project with `clone_project` is not set up yet {tbc: no shared template project exists yet}. For now, deploy the adapted file.

### 5. Test

```prompt tool=create_submissions
Create 10 test submissions.
```

Then look at them, and before real collection starts:

```prompt tool=set_validation_status
Mark all the test submissions Not Approved.
```

Or ask it to delete the test data. Deleting takes two steps: the assistant shows what would go and asks you to confirm.

### 6. Share with the team

```prompt tool=share_project
Share it with these collectors, add submissions only: …
```

For a larger team, `bulk_share_project` shares with many accounts at once, with a dry run first.

### During the mission

```prompt tool=summarize_submissions
Summarise today's submissions by collector.
```

```prompt tool=find_duplicates
Find duplicates: the same feature ID twice, or the same feature type at nearly the same point at the same site.
```

```prompt tool=set_validation_status
Approve the records I have checked.
```

### Changes mid-mission

```prompt tool=deploy_form
Add a choice … to the site list, bump the version and redeploy.
```

The assistant must flag any rename or delete, because that breaks data already collected. The change rules are in [Daily review and changes](/guide/review).

:::kobo-mcp Before you use it on real data
The assistant sends what it reads to the AI provider. Use it on RISA data only if the data-sharing agreement allows it, and not on restricted records. See [Data protection](/guide/protection).
:::

::tab By hand
### 1. Edit the spreadsheet

Open a copy of the `.xlsx` in Excel, LibreOffice or Google Sheets and follow the `adapt` sheet inside it.

1. Replace the placeholder `level_1`, `level_2` and `site` lists on the `choices` sheet. Keep the parent columns: `level_1` on `level_2` rows, `level_2` on site rows.
2. Add the agencies on site to the `org` list.
3. For a new language, add `label::<Language> (<code>)`, `hint::…` and `constraint_message::…` columns. Every one carries a language suffix, never mixed with unsuffixed ones. See [Add a language](/guide/languages).
4. On the `settings` sheet, set `form_title`, `form_id` and bump `version`.

The [XLSForm reference](https://xlsform.org/en/) and Kobo's [introduction to XLSForm](https://support.kobotoolbox.org/getting_started_xlsform.html) explain the sheets and columns. The district and site lists use [choice filters](https://support.kobotoolbox.org/choice_filters_xls.html).

### 2. Upload, test, deploy

1. On the owner account, create a new project by uploading the XLSForm. Give it a clear name, for example "RISA – Bahamas – 2026".
2. Preview it in the browser and check every feature type shows the right detail questions.
3. Test it offline on a real device (see [Test, then deploy](/guide/test-and-deploy)).
4. Deploy it, then share it with the collector and reviewer accounts (see [Accounts and ownership](/guide/accounts)).

Kobo's article on [using XLSForm with KoboToolbox](https://support.kobotoolbox.org/xlsform_with_kobotoolbox.html) and on [deploying forms](https://support.kobotoolbox.org/deploy_form_new_project.html) cover the clicks.

### 3. Don't edit the form in Kobo's form builder

The form builder gives new lists and questions random names, such as `bp0fd95`. That is how the earlier forms drifted from each other. Always change the XLSForm and upload it again.

If someone did edit the form in the builder, download it as an XLSForm and fix the names before the next deployment.
:::

## The final check

Whichever route you took, check two things before the first real observation:

1. The form ID (`form_id` on the `settings` sheet) starts with `risa_obs`.
2. The field names are unchanged from the template, above all the paths marked `contract` in the [codebook](/guide/template).

That is what lets the RISA dashboard recognise the form and map it with no mapping step. The automatic mapping is being added to the dashboard with this template; until it is released, check the mapping in the dashboard's "Map form to RISA" dialog {tbc: release date}.

:::failure Common failure
The form is built in the web form builder "to save time", and question names become auto-generated codes. Always upload the XLSForm.
:::

:::tip
Keep the adapted `.xlsx` with the deployment's records. At handover it goes to the receiving team with the codebook.
:::
