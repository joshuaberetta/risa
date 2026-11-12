---
title: Add a language
order: 4
annexRef: Annex A §3 step 6
summary: Add the collectors' language to the form, with AI translation and a native speaker's review.
lastChecked: 2026-11-12
---
The template is in English. Most deployments need the form in the language the collectors read: French, Spanish, Portuguese or a national language. You add it as extra columns next to the English ones. Nothing else in the form changes, so the data and the dashboard are not affected.

## The rule

1. **English is the reference.** Translate from the English labels, hints and constraint messages, and keep the English columns.
2. **Translate with AI.**
3. **Have a native speaker review it** before the form is tested.
4. **Set `default_language`** on the `settings` sheet to the language most collectors read.

Translate labels only. Never translate a `name`, a choice code or a list name: those are the data.

## The column convention

Each language gets its own columns, on both the `survey` and the `choices` sheets, named `<column>::<Language> (<code>)`:

| English (already in the template) | Spanish, for example |
|---|---|
| `label::English (en)` | `label::Español (es)` |
| `hint::English (en)` | `hint::Español (es)` |
| `constraint_message::English (en)` | `constraint_message::Español (es)` |

Every label, hint and constraint message column must carry a language suffix. KoboToolbox refuses a form that mixes a bare `label` column with `label::English (en)`. Kobo's article on [adding translations in XLSForm](https://support.kobotoolbox.org/language_xls.html) and the [XLSForm reference](https://xlsform.org/en/) explain the format.

## Two routes

:::tabs
::tab With an AI assistant (kobo-mcp) | recommended
Connect kobo-mcp with your own account first (see [Adapt it to a new emergency](/guide/adapt)). Give the assistant the adapted form, then ask:

```prompt
Add a Spanish translation (label::Español (es)) for every label, hint and constraint message, on the survey and choices sheets. Translate from the English. Don't change any name or code. Then list anything a native speaker should check.
```

Send that list and the file to the native-speaker reviewer. When the corrections are in:

```prompt
Set default_language to Español (es).
```

```prompt tool=convert_xlsform
Check the form.
```

```prompt tool=preview_form
Show me the form in Spanish.
```

If the form is already deployed, adding a language is a safe change. Bump the version and redeploy it in the same project:

```prompt tool=deploy_form
Bump the version and redeploy the form with the new language.
```

::tab By hand
1. In a copy of the adapted `.xlsx`, add `label::<Language> (<code>)`, `hint::<Language> (<code>)` and `constraint_message::<Language> (<code>)` columns next to the English ones, on the `survey` and the `choices` sheets.
2. Fill them in. Translate the English column with an AI tool, then paste the results in, row for row.
3. Have a native speaker review the new columns in the spreadsheet.
4. Set `default_language` on the `settings` sheet.
5. Bump `version`, upload the file to KoboToolbox and preview it in the new language.

Don't add the language in Kobo's form builder. Change the XLSForm and upload it again.
:::

## Test it

Test the translated form like any other (see [Test, then deploy](/guide/test-and-deploy)), with at least one collector who reads the new language. Check the choice lists and the constraint messages as well as the questions.

:::failure Common failure
The upload is refused with an error about "label" and "label::English (en)". A column was added without a language suffix. Give every label, hint and constraint message column a suffix.
:::
