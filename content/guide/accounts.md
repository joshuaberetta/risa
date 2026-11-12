---
title: Accounts and ownership
order: 5
annexRef: Annex F §2, SOP §3.7
summary: Who owns the project, one account per collector, no shared logins, and which server to use.
lastChecked: 2026-11-12
---
Every system RISA uses (the data-collection project, cloud storage, the online view, the GIS files) must belong to an organisation, not to a person, and must be transferable to the host at handover. Decide the accounts before the first upload. They are hard to change afterwards.

## Who owns the project

The project is owned by an organisation account of the deploying partner (a KoboToolbox Team account where the partner has one), or by the host NDMA's own account. Never by a person's own account.

Why: a project on a person's account leaves with that person. The Madagascar lesson (SOP §3.7): a dashboard left running on the deploying team's credentials was hard to unwind. Plan ownership on day one, not at handover.

## One account per person

| Who | Permission on the project |
|---|---|
| Each collector | **Add submissions** only |
| Reviewers | **View submissions** and **Validate submissions** |
| The data focal point and one back-up | Can edit the form |
| The dashboard connection | A dedicated account with **View submissions** only (see [the dashboard](/guide/data)) |

No shared logins. A shared login hides who collected what, cannot be withdrawn from one person, and ends up written in a guide.

Never write a password, API token or settings QR code into a document, slide, chat, screenshot or shared spreadsheet. Share access through the project's permissions instead.

## Choose the server

Choose the server for data residency, and agree it with the host in the data-sharing agreement:

- the KoboToolbox Global server (`https://kf.kobotoolbox.org`);
- the KoboToolbox EU server (`https://eu.kobotoolbox.org`), hosted in the EU;
- or a national or organisational server.

Accounts and projects cannot move between servers by transfer. Moving means redeploying the form and migrating the data, so choose before the first upload. Ownership can be transferred at handover only between accounts on the same server.

## How to set it up

1. Create or choose the owner account on the agreed server. Turn on [two-factor authentication](https://support.kobotoolbox.org/two_factor_authentication.html).
2. Create one account per collector, or ask each collector to [create their own](https://support.kobotoolbox.org/creating_account.html) on the same server.
3. [Share the project](https://support.kobotoolbox.org/managing_permissions.html) with each account at the right permission level. For larger teams, use bulk sharing, or row-level permissions so reviewers see only their own team's records. Teams accounts are covered in [Team management](https://support.kobotoolbox.org/team_management_feature.html).
4. Keep the access list: who has which permission on the project, the storage and the dashboard. Review it at each rotation (see [Data protection](/guide/protection)).

On ODK Central, "App Users" and their QR codes replace per-collector accounts on the device.

```prompt tool=bulk_share_project
Share the RISA <country> project with the collectors in this sheet, add submissions only. Show me the changes first.
```

```prompt tool=list_permissions
List who has access to the RISA <country> project, and with which permissions.
```

:::kobo-mcp
Connect kobo-mcp with an account that has only the permissions the task needs. For a read-only task, use a reviewer account, not the owner account.
:::

:::failure Common failure
The deploying team creates the project on whichever account is open on the laptop. At handover nobody can transfer it. Decide the owner account before the first upload.
:::

## At handover

At the end of the deployment, ownership of the project moves to the receiving organisation's account, if agreed, and the deploying team's access is removed. See [Closing and handover](/guide/close).
