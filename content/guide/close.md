---
title: Closing and handover
order: 12
annexRef: Annex F §13–14, SOP §3.9
summary: The feedback form, the final archive, ownership transfer and removing access when collection ends.
lastChecked: 2026-11-12
---
RISA is designed to be handed over, usually to the cluster or sector lead or the national authority, around week 3. The handover is planned from the start. On the data side, it means the receiving organisation ends up owning the project, the data and the dashboard connection, and the deploying team's access is gone.

## The feedback form

A short form for map users, linked by a QR code on every RISA map. RISA needs to know whether the maps were used and what was missing.

- Kobo builds the form by the end of 2026. Its questions, its owner account and whether answers are anonymous are not decided yet {tbc}.
- It should live on a project owned by the partnership, not by one deployment, so it outlives each handover.
- The RISA dashboard prints its QR code on page 1 when a feedback link is set.

## Closing a deployment

1. **Final review.** Finish validation (see [Daily review and changes](/guide/review)).
2. **Archive the data.** Export XLS (XML values and headers), GeoJSON and the media. Download the form as an XLSForm. Store them in the agreed archive with the codebook.
3. **Transfer ownership** of the project to the receiving organisation's account, if agreed. Both accounts must be on the same server. Check the receiving team can open it before you leave.
4. **Remove access** for the deploying team's collectors and reviewers, except those the receiving organisation asks to keep.
5. **Dashboard.** Replace the dashboard's token with one from the receiving organisation, or disconnect it.
6. **Archive the project** to stop new submissions while keeping the data. Delete it only when the data-sharing agreement says so, after the archive is checked. Deleted projects cannot be recovered.
7. **Devices.** Delete sent forms and remove the project from devices.

Kobo's articles: [managing projects (archiving and deleting)](https://support.kobotoolbox.org/managing_projects.html) and [transferring ownership](https://support.kobotoolbox.org/project_sharing_settings.html).

:::kobo-mcp Closing with an assistant
```prompt tool=create_export
Make the final exports of the RISA <country> project: XLSX with XML values and headers, and GeoJSON.
```

```prompt tool=list_permissions
List everyone with access to the project, so I can check the access list before handover.
```

```prompt tool=archive_project
Archive the project to stop new submissions. Confirm with me first.
```
:::

## What else goes to the receiving team

With the project, hand over the SOP and annexes, the current form and codebook, the latest products and the folder of archived versions. Agree what happens to the data at closure ([Data protection](/guide/protection)).

:::failure Common failure
The project is archived on the deploying team's account and the host has no copy. Transfer ownership, or hand over the full archive, before you leave.
:::
