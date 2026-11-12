---
title: The RISA form
order: 2
annexRef: Annex A §1–2, §5
summary: What is in the template package, why the form is built this way, and the field names the dashboard reads.
lastChecked: 2026-11-12
---
The RISA form is the field form for a site visit: one submission for each object observed. It is plain XLSForm, so it runs on KoboToolbox, ODK Central, Ona and any other XLSForm platform. Only the connection to the RISA dashboard is specific to RISA.

{{download-card}}

This is a test version until the working group signs it off. Whether Michael (Atlas) or the Kobo focal point reviews the detail questions before the template is marked v3 is still open {tbc}.

## What is in the package

| File | What it is |
|---|---|
| `RISA_template_<version>.xlsx` | The form. Sheets: `survey`, `choices`, `settings`, plus `codebook` (one row per question) and `adapt` (the country checklist and change rules). KoboToolbox and pyxform ignore the last two. |
| `codebook.md` | The data dictionary: every question path, type, list, label, logic and constraint, every code list, and the settings. Read it before any analysis. |
| `legacy_codes.csv` | The mapping from the old codes (the 47 of the Mozambique and Venezuela forms, the 18 of Michael's draft) to the new sector and feature type, with a detail answer where one applies. |

The three files are generated from one source, so they always agree. Changes to the global template go through the template owner (Kobo), so every country can pick them up. The template is English only; to add a language, see [Add a language](/guide/languages).

## Design choices

Each choice answers a problem found in the earlier forms.

### One observation per submission

One form is one object at one point: a water point, a latrine block, a gate. There is no repeat group. The site details in the `visit` group (date, organisation, admin areas, site) carry over from the last submission, so collectors fill them once per site.

Why: in a repeat, nothing reaches the server until the whole visit is finalised and sent. One lost tablet loses the site. With one observation per submission, each object syncs on its own and reaches the map as one feature.

### Sector, then feature type

The collector picks a sector (`obs/sector`), then a feature type filtered by sector (`obs/feature_type`). The feature-type codes are the RISA dashboard's map-symbol codes, so a code means the same symbol everywhere.

| Sector | Feature types |
|---|---|
| `wash` | `water`, `latrine`, `bathing`, `hand`, `waste` |
| `shelter` | `shelter` |
| `health` | `health` |
| `protection` | `cfs`, `safe_space`, `registration` |
| `food` | `kitchen`, `dist` |
| `logistics` | `storage`, `landing` (including helipads), `gate` |
| `access` | `choke` (access constraint) |
| `energy` | `lighting`, `energy` |
| `environment` | `hazard` (not a service, so left out of service counts) |
| `commerce` | `market` |
| `other` | `other`, with a text question |

Each feature type has a few detail questions, shown only for that type: for example the water source and tap count, the shelter type and capacity, or a health facility's level of care and beds. Each "other" answer has its own `<question>_other` text question. Education is not in the list {tbc}.

### Status

Every observation answers "Is it working?" (`obs/status`) on the four-point scale: Working (`ok`), Partly working (`partial`), Not working (`no`), Can't see (`unknown`). For an access constraint or a hazard, the same answers mean Passable, Restricted and Blocked. When the answer is Partly working or Not working, `obs/status_reason` asks what is wrong.

Why: none of the earlier forms recorded status, though the maps' colours depend on it.

### Feature ID and count

`obs/feature_id` is a short label such as WP-03. It is the label on the map, and lets a later visit refer to the same object. `obs/count` is the number of units at this point: taps on a stand, latrines in a block, tents in a cluster. The map and its summary table add them up.

### Location

`obs/location` is a geopoint. The form captures automatically at 5 m accuracy and warns above 10 m. `obs/location_method` records whether the point was taken by GPS at the object (`gps`) or placed by hand on the map (`manual`). `obs/location_accuracy` keeps the accuracy in metres.

The `audit` metadata logs each question opened and changed, with the device location every 10 seconds while a form is open. It works only in KoboCollect and ODK Collect, not in web forms. It is not a continuous GPS track between forms.

### Photos and the note

`obs/photo`, then optional `obs/photo_2` and `obs/photo_3`, each shown once the one before is taken. Images are capped at 1600 pixels on the long side to keep uploads small. The hint reminds collectors to avoid faces.

`note` (text) and `note_audio` (voice) sit outside any group, at the top level. The dashboard's key-findings page and the brief read `note` directly.

### Names in exports

Calculations (`visit/level_1_label`, `visit/level_2_label`, `visit/site_label`) store the names as well as the codes, so exports are readable without the choices sheet.

## Settings

| Setting | Value |
|---|---|
| `form_title` | RISA site observation |
| `form_id` | `risa_obs` (a country may append its ISO3 code: `risa_obs_bhs`) |
| `version` | yyyymmddNN, e.g. 2026111201 |
| `instance_name` | site, feature type, feature ID and time, so each record has a readable name |
| `style` | `pages theme-grid` |
| `default_language` | English (en) |

## The data contract

Some field names are a contract. The RISA dashboard reads them directly, with no mapping step, and the GIS template and any analysis rely on them. They are marked `contract` in the codebook:

- the `visit` group: `visit/date`, `visit/org`, `visit/level_1`, `visit/level_2`, `visit/site` and their `_other` questions;
- `obs/sector`, `obs/feature_type`, `obs/feature_id`, `obs/status`, `obs/status_reason`, `obs/count`;
- `obs/location`, `obs/location_method`;
- `obs/photo`, `obs/photo_2`, `obs/photo_3`;
- `note`, `note_audio`;
- the metadata: `start`, `end`, `today`, `username`, `deviceid`, `audit`, `start_geopoint`.

Never rename, delete or move these to another group. Paths are the keys KoboToolbox sends (`group/name`) and the column headers of an export with group names kept. How the dashboard uses them: [Exports, the API and the RISA dashboard](/guide/data).

:::failure Common failure
Each country renames codes in its own copy, so maps and data cannot be compared across deployments. Follow the country checklist in [Adapt it to a new emergency](/guide/adapt) and keep the names.
:::

## The codebook

Every question, code list and setting in the current template. Search it for a field name or a code.

{{codebook}}
