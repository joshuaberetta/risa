---
title: Test, then deploy
order: 6
annexRef: Annex F §3–4, Annex A §3 step 9
summary: Check the form, test it offline on a real device, clear the test data and freeze the form before the first real observation.
lastChecked: 2026-11-12
---
Test the form on the devices the team will use, offline, before the first real observation. Then freeze it.

Why: errors found on day one in the field cost a day; errors found after collection cost the data.

## Deploy to the owner account

1. Check the adapted form converts: upload it to a test project, or ask kobo-mcp to run `convert_xlsform`.
2. Upload the XLSForm to create a new project on the owner account (see [Accounts and ownership](/guide/accounts)). Give it a clear name, for example "RISA – Bahamas – 2026".
3. Deploy it.
4. Share it with the collector and reviewer accounts.

Alternatively, clone an existing RISA project and replace its form with the country's file. Kobo's article on [deploying forms](https://support.kobotoolbox.org/deploy_form_new_project.html) covers the clicks.

## Test it

1. **Preview** the form in the browser. Check every feature type shows the right detail questions.
2. **Dry run** on a real device with the network off: open the form, fill one observation of each type you use, take a GPS point and photos, finalise, then switch the network on and send. Do it in KoboCollect and in the web form (Enketo) if the team will use both.
3. **Look at the test data** in the data table and in an export. Check the column names match the [codebook](/guide/template).
4. **Clear the test data.** Delete it, or mark it **Not Approved**, before real collection starts.

```prompt tool=create_submissions
Create 10 dummy submissions in the RISA <country> project, at least one of each feature type we use.
```

```prompt tool=summarize_submissions
Summarise the test submissions: which questions are empty, and does every feature type have its detail questions?
```

Dummy submissions check the logic and the export. They don't replace the dry run on a real device, with GPS, photos and the network off.

## Freeze the form

Once real collection starts, the form is frozen. From then on, every change follows the change rules: add only, never rename or delete a name or a code, bump the version. See [Daily review and changes](/guide/review).

Links: [viewing and validating your data](https://support.kobotoolbox.org/viewing_validating_data.html), [editing and deleting your data](https://support.kobotoolbox.org/editing_deleting_data.html).

:::failure Common failure
Test submissions stay in the project and appear on the first map. Delete them or mark them Not Approved.
:::
