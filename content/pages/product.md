---
title: Product
toc: true
description: The RISA product, on a fictional sample site. A printed map with counts and two QR codes, a key-findings page and an optional hotspot page, plus an online view that is the source of truth.
sections:
  - type: hero
    kicker: RISA handbook · SOP v3 §2.5
    title: The RISA product
    lead: A printed map a coordinator can brief from, a key-findings page built on the three questions, and an online view with the latest data. The QR code on the print links the two. Every page here uses the same fictional site.
    links:
      - { label: See it working in the RISA dashboard, href: 'https://risa-dash.kobolabs.dev', variant: primary }
      - { label: The status scale, href: '#status' }

  - type: product
    id: map
    title: "Page 1: the map"
    intro: "The whole site on one page: shelter blocks, access routes by status, services by status, hazards and logistics points, with counts. The side panel carries the key message, the legend and two QR codes: one to the online view, one to the feedback form."
    pages: [map]
    body: |
      Whether the map keeps an overview inset or gives that space to counts and the legend is still open {tbc}. The working leaning is to keep an overview map and add the counts.

  - type: product
    id: findings
    title: "Page 2: key findings"
    intro: "One column per question: can we reach people, which services still work, and where do we act first. Each priority gap names who should act."
    pages: [findings]

  - type: product
    id: hotspot
    title: "Page 3: hotspot"
    intro: "Optional. The most urgent area, before and after, with recommended actions, for coordination briefings, donor reports and advocacy."
    pages: [hotspot]

  - type: status-scale
    id: status
    title: The status scale
    intro: The same four statuses in the form, on the map and in the online view. Status is shown by colour and by shape, so it survives a photocopier and colour-vision differences. The colours are reserved for status and are never used for branding.

  - type: prose
    id: online
    title: The online view
    body: |
      The printed map is a dated snapshot. **The online view is the source of truth**: the same data, kept up to date as observations arrive, and filterable by sector. It must work offline-first: the print and its PDF stand alone, and the online view should still open on a field server or from a cached copy.

      The [RISA dashboard](https://risa-dash.kobolabs.dev) is an open-source tool for the online view and the printed maps. Connect a form built from the RISA template and it maps itself. It can run on a national server or offline. It is a working MVP: it doesn't yet have the sector filter the SOP requires, and doesn't yet leave Not Approved records off the map {tbc}. Who runs it for responses is still to be decided {tbc}.

      To connect your form, see [Exports, the API and the RISA dashboard](/guide/data).
    
  - type: prose
    id: feedback
    title: Feedback
    body: |
      Every map carries a second QR code, to a short feedback form. Until Kobo's feedback form is ready (end of 2026), it leads to [the feedback page](/feedback), which already knows which site, product and version the reader is holding.

---
