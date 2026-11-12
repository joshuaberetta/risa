---
title: Feedback
description: Tell the RISA partners what worked and what didn't, about a map you used, the form template or this site.
sections:
  - type: hero
    kicker: RISA handbook · Feedback
    title: Was this map useful?
    lead: Every RISA map carries a QR code that leads here. Tell us what helped, what was wrong or missing, and what you decided with it. Feedback goes to the working group that maintains RISA, not to a helpdesk.

  - type: form
    id: form
    title: Your feedback
    kind: feedback
    subject: RISA feedback
    submit: Write the email
    body: |
      If you came from a map's QR code, the site, product and version are already filled in. Kobo is building a dedicated feedback form for the end of 2026 {tbc}; this page will link to it then.
    fields:
      - { name: site, label: Site, type: text, param: site, hint: The site name or code on the map. }
      - { name: product, label: Product, type: text, param: product, hint: "For example: initial assessment, follow-up." }
      - { name: version, label: Version, type: text, param: version }
      - { name: response, label: Response or emergency, type: text, param: response }
      - name: role
        label: Your role
        type: select
        options: [National authority, Coordination (UNDAC / OSOCC / cluster), Site or camp management, Logistics, Field or data team, Other]
      - name: useful
        label: How useful was the map?
        type: select
        options: [Very useful, Useful, A little, Not useful]
      - { name: message, label: "What worked, and what didn't?", type: textarea, required: true }
      - { name: email, label: Your email (optional), type: email, hint: Only if you'd like a reply. }

---
