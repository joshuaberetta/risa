---
title: Troubleshooting
order: 13
annexRef: Annex F §16
summary: The problems that come up most often in the field, their likely causes and what to do.
lastChecked: 2026-11-12
---
The problems below come up most often. Each row links to the page that explains the fix. For anything else, see the [KoboToolbox help centre](https://support.kobotoolbox.org/) or the [ODK documentation](https://docs.getodk.org/).

## The form and its upload

| Problem | Likely cause | What to do |
|---|---|---|
| Upload refused: "label" and "label::English (en)" | Mixed language columns | Give every label, hint and constraint message column a language suffix ([Add a language](/guide/languages)). |
| Districts or sites list is empty | Parent column missing or P-code mismatch | Check each `level_2` row has its `level_1` P-code, and each site its `level_2` P-code ([Adapt](/guide/adapt)). |
| Two projects for one deployment | A changed form was uploaded as a new project | Use one project. Merge exports with the legacy mapping if needed, and replace the form in place next time ([Daily review and changes](/guide/review)). |

## Devices and sending

| Problem | Likely cause | What to do |
|---|---|---|
| The form on devices is out of date | Devices update manually | Set automatic form updates, or "Get blank form" on each device ([Phones and tablets](/guide/devices)). |
| "Submitted by" is the same for everyone | Shared login or a copied QR code | One account per collector ([Accounts](/guide/accounts), [Phones and tablets](/guide/devices)). |
| Forms stuck in "Ready to send" | No connection, or Wi-Fi-only auto send | Connect to Wi-Fi at the base, or send manually. Check the account still has Add submissions. |
| Authentication error on send | Wrong account, changed password, or permission removed | Re-enter the collector's own credentials; check the project's sharing. |
| Web form drafts lost | Browser cache cleared | Do not clear site data during collection; send drafts as soon as possible. |

## GPS and photos

| Problem | Likely cause | What to do |
|---|---|---|
| GPS will not settle | Indoors, under trees, high-accuracy off | Step outside, turn on high-accuracy location, wait; else place the pin on the map. |
| Points cluster in one place | Points taken from the vehicle or entrance | Brief collectors again; check against imagery in the daily review ([In the field](/guide/collect)). |
| Photos missing in the export | Media still uploading, or exported without media | Wait for devices to finish sending; download attachments separately. |

## Data and the dashboard

| Problem | Likely cause | What to do |
|---|---|---|
| No audit log in some records | Records came from the web form | Expected: web forms do not record the audit log. |
| Export columns do not match the codebook | Label export, or group names dropped | Export with XML values and headers, keeping group names ([Exports](/guide/data)). |
| Dashboard map stopped updating | Token changed, account removed, or project archived | Reconnect with a valid view-only token ([the dashboard](/guide/data)). |

:::failure Common failure
Forms never sent. Finalised forms sit on a tablet for days. Sync every evening and check the count per collector in the daily review.
:::
