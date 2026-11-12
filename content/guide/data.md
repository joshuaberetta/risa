---
title: Exports, the API and the RISA dashboard
order: 10
annexRef: Annex F §9–11, Annex A §5
summary: Which export to use for what, how to keep API tokens safe, and how to connect a project to the RISA dashboard.
lastChecked: 2026-11-12
---
The data leaves KoboToolbox in three ways: as an export, through the API, or straight to the RISA dashboard. Whichever you use, keep the names from the codebook, so the GIS template and any analysis read the data without re-coding.

## Which export for what

| Need | Use |
|---|---|
| Analysis, with the codebook's names | XLS or CSV export with **XML values and headers**, so columns are the question names and answers are the codes. Keep group names in headers (`obs/status`). |
| Reading by people | XLS export with labels. |
| GIS | GeoJSON export. KML still exists but KoboToolbox will drop it; prefer GeoJSON. |
| A live link for Excel, Power BI or QGIS | Synchronous export links (CSV or XLSX), which always return the latest data. |
| Automation | The KoboToolbox REST API (v2), with an API token. |
| Pushing each submission elsewhere | REST services (webhooks). |
| Media | Attachments downloaded with the export, or through the API. |

Kobo's articles: [exporting and downloading your data](https://support.kobotoolbox.org/export_download.html), [advanced export options](https://support.kobotoolbox.org/advanced_export.html), [synchronous exports](https://support.kobotoolbox.org/synchronous_exports.html), [the API](https://support.kobotoolbox.org/api.html) and [REST services](https://support.kobotoolbox.org/rest_services.html).

```prompt tool=create_export
Make a GeoJSON export of the RISA <country> project, and an XLSX export with XML values and headers and group names kept.
```

## Keep tokens out of documents

An API token gives full access to its account, like a password.

- Use the token of a dedicated view-only account for anything automatic.
- Store tokens in a password manager or the receiving tool's settings. Never in a script, a shared spreadsheet, or a synced export URL pasted into a document.
- Rotate the token if it leaks.

## Connect the RISA dashboard

The [RISA dashboard](https://risa-dash.kobolabs.dev) reads the project directly and keeps the map up to date. A connected project puts new observations on the map within minutes, without anyone exporting files.

1. Create a dedicated account (for example one per deployment) and share the project with it at **View submissions** only.
2. Sign in as that account and copy its API token (Account settings, Security).
3. In the dashboard, connect the project with that token and the server. The dashboard stores the token encrypted and never shows it to the browser.
4. Check the first records appear with the right symbols and colours.
5. At handover, transfer or remove the connection with the project (see [Closing and handover](/guide/close)).

The dashboard has its own [guide](https://risa-dash.kobolabs.dev/guide/). Who runs the dashboard for responses is still to be agreed {tbc}.

## How a RISA form maps itself

If the `form_id` starts with `risa_obs`, or the form has `obs/feature_type` and `obs/status`, the dashboard takes the location, type, status and label from the contract paths, with no mapping step. Any other form gets the "Map form to RISA" dialog, where someone picks the questions by hand.

| Form path | Dashboard |
|---|---|
| `obs/location` | map position |
| `obs/feature_type` | map symbol |
| `obs/status` | map colour and the page 1 figures |
| `obs/feature_id` | map label |
| `obs/count` | counts on the map and page 1 |
| `obs/status_reason`, `note` | the popup and the key-findings page |
| `obs/location_method` | data-quality checks |
| `end` | when the observation was made |

The automatic mapping is being added to the dashboard with this template (November 2026). Until it is released, check the mapping in the dialog {tbc: release}.

Read `obs/location` for the feature's position. KoboToolbox fills its own `_geolocation` column from `start_geopoint`, where the form was opened, not from the feature.

## Media and bandwidth

Photos and voice notes are most of the data volume. Field connections are slow and expensive, and large photos block the sync of the forms behind them.

- Keep the 1600 px cap in the form. Reduce the device image size further only if needed.
- Up to three photos per observation is a maximum, not a target.
- Export data without media for quick checks; download attachments in bulk on a good connection.
- Check the account's [storage and submission limits](https://support.kobotoolbox.org/account_usage_limits.html) before the mission.

See also [media questions](https://support.kobotoolbox.org/photo_audio_video_file.html) and [managing submitted media](https://support.kobotoolbox.org/managing_media_responses.html).

:::failure Common failure
The dashboard is connected with the data focal point's own token. When that person leaves, or changes their password or token, the map stops updating, and their full account access sits in the dashboard. Use a dedicated view-only account. And a label export fed into GIS does not match the symbology: use XML values and headers.
:::
