---
title: Data protection
order: 11
annexRef: Annex F §12, SOP §3.8
summary: The data-sharing agreement, sensitive locations, photos, the access list, devices, and retention.
lastChecked: 2026-11-12
---
RISA collects locations of services, not personal data, but some locations and photos are sensitive. Locations of services for women, children or survivors can put people at risk if they reach the wrong hands. This page is the technical side of SOP §3.8.

## Before collection

**Data-sharing agreement.** Sign it with the host authority before collection. It says who owns the data, who may see it, which server it is stored on (data residency), how long it is kept and how it is deleted. Template text for the agreement is not written yet {tbc}.

**Sensitive locations.** Agree with the protection actors on site which types appear on public products, only on restricted ones, or not at all. The types to discuss include safe spaces for women and girls (`safe_space`), child-friendly spaces (`cfs`), and some health and protection services. Restrict who can view those records, for example with row-level permissions, and leave them out of public exports.

## Photos

No identifiable faces, children or vulnerable people. Do not photograph inside safe spaces, health consultations or registration desks. Delete any photo that slips through during the [daily review](/guide/review).

## Access and devices

**The access list.** Keep a list of who has which permission on the project, the storage and the dashboard. Review it at each rotation and remove people who have left.

```prompt tool=list_permissions
List everyone with access to the RISA <country> project and their permissions.
```

**Devices.** Screen lock on every device. Delete sent forms from devices at the end of the mission.

**Credentials.** No password, API token or settings QR code in any document, slide, chat, screenshot or shared spreadsheet (see [Accounts and ownership](/guide/accounts)).

## Retention and deletion

At closure, export a full archive for the host, then delete or transfer the working copies: the project, the storage and the devices (see [Closing and handover](/guide/close)). The default retention period is not agreed yet {tbc}.

## AI assistants

An assistant connected through kobo-mcp sends what it reads to the AI provider. Use it on RISA data only if the data-sharing agreement allows it, and not on restricted records. Connect an account with only the permissions the task needs. Never paste a token into the chat.

Kobo's articles: [data security and protection](https://support.kobotoolbox.org/is_my_data_safe.html), [data storage](https://support.kobotoolbox.org/data_storage.html), [GDPR](https://support.kobotoolbox.org/gdpr.html), [project-level sharing settings](https://support.kobotoolbox.org/project_sharing_settings.html) and [encrypting forms](https://support.kobotoolbox.org/encrypting_forms.html).

:::failure Common failure
The project is made public "so partners can see it". Share with named accounts, or share products, not the raw data.
:::
