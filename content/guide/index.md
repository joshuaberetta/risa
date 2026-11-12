---
title: Data collection for RISA
order: 1
annexRef: Annex F, Annex A, SOP §2.1
summary: What the field team records, the four statuses, the template, and the two ways to get a form ready.
lastChecked: 2026-11-12
---
This guide is for the data or Kobo focal point of a RISA deployment. It explains how to set up the RISA form, run it on KoboToolbox and get the data to the map. It is the user guide to Annex F (data collection with KoboToolbox) and Annex A (the XLSForm template) of the RISA SOP.

It is technical but not click by click. Each page says what to do, why, and how in outline, then links to the official [KoboToolbox](https://support.kobotoolbox.org/) and [ODK](https://docs.getodk.org/) documentation, which is kept up to date by the people who build the software.

## What the field team does

Field teams walk the site and record what they see: each water point, latrine block, health post or blocked road, with its status, location and a photo. This is the layer imagery cannot provide. A drone shows a tank; only a person standing next to it can say whether water comes out.

- **One object, one form.** Each submission is one feature at one point. The site details (date, organisation, admin areas, site) carry over from the last form, so collectors fill them once per site.
- **Observe, don't ask.** Collectors record what they can see and check. If a status can only be known by asking, they answer "Can't see" and put what they were told in the note.
- **GPS at the object, photos of the object.** Stand at the water point, not across the road. Photograph the object, not people.
- **Sync daily, review daily.** Forms go whenever there is a connection, and every evening. The data focal point reviews the day's records before the team goes out again.

GIS turns the observations into the printed map product (see [the product](/product)), and the [RISA dashboard](https://risa-dash.kobolabs.dev) maps them as they arrive. The method as a whole is on the [method page](/method).

## The four statuses

Every observation answers one question: "Is it working?" The answer sets the colour on the map.

{{status-scale}}

For an access constraint or a hazard, Working means Passable, Partly working means Restricted and Not working means Blocked. "Can't see" is an honest answer and better than a guess.

## The template

The RISA form is a standard XLSForm. It runs on KoboToolbox, ODK Central, Ona or any other XLSForm server, and on KoboCollect, ODK Collect or a web form. This guide uses KoboToolbox as the worked example, because the partners use it.

{{download-card}}

What is in the package and why it is built this way: [The RISA form](/guide/template).

## Two routes to a ready form

Every deployment starts from the template, not from the last country's form. That keeps the names and codes the dashboard and the GIS team expect. There are two ways to adapt it:

1. **With an AI assistant (kobo-mcp), recommended.** You connect an AI assistant to your own KoboToolbox account and ask in plain language: replace the admin areas, add a language, check the form, deploy it, share it. The assistant asks before anything that changes data.
2. **By hand.** You edit the `.xlsx` in a spreadsheet, following the `adapt` sheet inside it, then upload it to KoboToolbox.

Both routes end at the same check: the form ID starts with `risa_obs` and the field names are unchanged. Step by step: [Adapt it to a new emergency](/guide/adapt).

:::kobo-mcp kobo-mcp is optional
Every task in this guide can be done by hand. Where kobo-mcp can do a step for you, the page shows a copyable prompt and the tool it uses.
:::

:::failure Common failure
A country edits the form in a platform's own form builder and the names drift from the codebook. Edit the XLSForm, keep the names, and upload it.
:::

## The pages in this guide

{{guide-pages}}
