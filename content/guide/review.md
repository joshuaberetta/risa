---
title: Daily review and changes
order: 9
annexRef: Annex F §7–8, Annex A §4, SOP §3.5
summary: Review each day's records every evening, mark their validation status, and change the form mid-mission without breaking the data.
lastChecked: 2026-11-12
---
Every evening, the data focal point reviews the day's records and gives collectors feedback before they go out again.

Why: collectors can still fix an error the next morning. A week later they cannot.

## The evening review

1. **Is everything in?** Compare the day's count per collector with what they say they collected. Chase unsent forms.
2. **Data table.** Read through the day's records. Check sector and type match the photo, status is answered, and notes make sense.
3. **Validation status.** Mark each record (see below).
4. **Duplicates.** Look for the same feature ID twice, or the same type at nearly the same point at the same site.
5. **GPS accuracy.** Check records with accuracy above 10 m, and those placed by hand (`obs/location_method` = `manual`), against the imagery.
6. **Photos.** Check for faces and remove any that slip through (see [Data protection](/guide/protection)).
7. **Feedback.** Brief collectors the next morning: what was good, what to fix, which records are on hold.
8. **Back up.** Export a full copy at the end of the day (see [Exports](/guide/data)).

## Validation status

| Status | Use it for |
|---|---|
| **Approved** | Checked. |
| **On hold** | A question for the collector. |
| **Not Approved** | Test, duplicate or wrong. |

Products leave out Not Approved records. The RISA dashboard shows the validation status with each record but does not yet hide Not Approved ones {tbc}. Until it does, delete true duplicates and test records, or keep them out of the dashboard's layer.

Kobo's article on [viewing and validating your data](https://support.kobotoolbox.org/viewing_validating_data.html) shows where the validation status is set, and [editing and deleting your data](https://support.kobotoolbox.org/editing_deleting_data.html) covers corrections.

:::kobo-mcp The review with an assistant
```prompt tool=summarize_submissions
For the RISA <country> project, summarise today's submissions by collector: counts, missing answers, and the map extent.
```

```prompt tool=find_duplicates
Find possible duplicates: the same obs/feature_id twice, or the same obs/feature_type at the same site.
```

```prompt tool=get_submissions
List today's records with GPS accuracy above 10 m, or with location_method manual.
```

```prompt tool=set_validation_status
Mark the duplicates Not Approved after I confirm. Show me a dry run first.
```
:::

## Changing the form mid-mission

Sometimes a change cannot wait: a missing site, a new organisation, a confusing label. Every change creates a new form version. Additive changes join cleanly; renames and deletions break the data.

The change rules apply from the moment the first real observation exists:

1. **Never rename or delete a question name or a choice code.** The data already collected uses them. A rename splits one column into two; a delete orphans the old answers.
2. **Add only.** New questions, new choices and new languages are safe. To stop offering a choice, leave it in the list and agree with the template owner how to hide it.
3. **Bump the version** with every change you deploy: yyyymmddNN, e.g. 2026111201, then 2026111202 for a second change the same day.
4. **Keep the contract paths** where they are (see [The RISA form](/guide/template)).

Adding a site, an organisation or a language is safe. Adding a feature type also needs a map symbol: tell the dashboard team.

## How to deploy a change

1. Edit the XLSForm, following the rules above.
2. Replace the form in the **existing** project with the new XLSForm and redeploy. Do not create a new project: the data stays in one place.
3. Ask collectors to send all finalised forms first, then update the form on their devices (automatic if set up as in [Phones and tablets](/guide/devices)).
4. Record the change in the deployment log and tell the remote GIS owner.

See [deploying and redeploying forms](https://support.kobotoolbox.org/deploy_form_new_project.html), and for ODK Central, [managing form versions](https://docs.getodk.org/central-forms/).

```prompt tool=deploy_form
Add the site … to the site list of the RISA <country> project, bump the version and redeploy. Flag any rename or delete before you deploy.
```

`compare_form_versions` shows what changed between two versions.

:::failure Common failure
Review is left to the GIS team at the end of the mission. Do it daily. And when the form changes, a new project is created for it: data splits across two projects and the dashboard only reads one.
:::
