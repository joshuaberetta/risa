---
title: Method
description: How RISA works, step by step, and how each step most commonly fails. From the RISA SOP v3, working draft.
toc: true
sections:
  - type: hero
    kicker: RISA handbook · SOP v3 §1–3
    title: The method
    lead: One common workflow for every deployment, so products stay consistent, field and remote teams can work together, and any qualified team (or a national authority) can run it from the SOP and its annexes alone. This page explains why each step is done this way and how it most commonly fails; the field-level detail is in the annexes.
    links:
      - { label: Read the SOP and annexes, href: /toolbox, variant: primary }
      - { label: The data collection guide, href: /guide }

  - type: prose
    id: scope
    title: Scope of the pilot
    short: Scope
    body: |
      The pilot covers **displacement camps and collective centres in the first days of a sudden-onset response**. RISA fills the gap until a cluster or sector lead (such as IOM or CCCM) takes over, usually around week 3. UNDAC missions typically last about three weeks, and many camps are temporary.

      Other uses were discussed and deliberately parked for a later phase: other infrastructure types, environmental emergencies, preparedness, anticipatory action and early recovery. Community needs assessment stays with IOM and the clusters. RISA records what physically exists; it does not interview people.

  - type: rows
    id: principles
    title: Guiding principles
    short: Principles
    intro: Every deployment aims to produce information that is
    items:
      - { term: Rapid, body: Useful products within the first days of an emergency. }
      - { term: Accurate, body: Based on direct observation and verified geospatial data. }
      - { term: Standardised, body: Consistent between deployments and comparable over time. }
      - { term: Operational, body: Focused on concrete humanitarian decisions. }
      - { term: Scalable, body: "Drone, aircraft, satellite or hybrid, depending on context." }
      - { term: Collaborative, body: Strengthening coordination between humanitarian actors and national authorities. }

  - type: prose
    id: standards
    title: "Standards: open, low-tech, platform-neutral"
    short: Standards
    body: |
      - **XLSForm** is the data-collection standard. The RISA template (Annex A) fixes the field names and codes, so any XLSForm platform can run it: KoboToolbox, ODK Central or Ona, for example.
      - **Standard field names, symbology and map elements** keep products comparable, whoever makes them.
      - **Open source and low-tech first.** Every step can be done with free software and basic equipment. ArcGIS is not required. The partners keep at least one ArcGIS licence to test interoperability.
      - **Links, not manuals.** Where a step uses software, the annexes link to the vendor's own tutorials. Software changes faster than the SOP.
      - **Language.** The SOP is the English reference. Translations are made with AI and then reviewed by a native speaker. The same rule applies to form labels.

  - type: steps
    id: workflow
    title: The six-step workflow
    short: Six steps
    items:
      - title: Mission preparation
        body: Define objectives and sites with partners and authorities; adapt the RISA form and prepare imagery; confirm team, equipment, logistics, security clearances, flight authorisations and the data-sharing agreement.
        failure: The receiving organisation is named on the last day, and drone authorisation is sought too late, especially near airports.
      - title: Field data collection
        body: Georeferenced observations by direct observation, one per submission; drone flights or satellite imagery for site coverage.
        failure: Statuses come from what people say instead of what collectors see.
      - title: Data processing
        body: Review and validate the observations daily; process drone imagery into a georeferenced orthomosaic; check GPS accuracy; prepare datasets for GIS.
        failure: Nobody reviews the data until the end, so errors are found when the collectors have gone.
      - title: GIS integration
        body: Overlay observations on imagery with standard symbology; apply the common map layout; quality control.
        failure: Field data are re-coded by hand, so map categories drift from the form.
      - title: Dissemination
        body: Share the printed map, its online view and the key findings through coordination channels as fast as possible.
        failure: Products go to a mailing list nobody in the site reads.
      - title: Updating and handover
        body: Repeat as the site evolves; hand over to the receiving organisation around week 3.
        failure: Systems stay on the deploying team's accounts.

  - type: prose
    id: field
    title: Field data collection
    short: Field observation
    body: |
      Field teams walk the site and record what they see: each water point, latrine block, health post or blocked road, with its status, location and a photo. This is the layer imagery cannot provide. A drone shows a tank; only a person standing next to it can say whether water comes out.

      1. **Observe, don't ask.** If a status can only be known by asking someone, record "Can't see" and put what you were told in the note.
      2. **One observation per submission.** A lost or unsent form costs one observation, not a whole site visit, and each observation reaches the map as soon as it is sent.
      3. **Record the status on one scale**: the same four statuses as the map colours (below).
      4. **Use the standard categories.** Each observation has a sector and a feature type, fixed by the template.
      5. **Take the GPS point at the object**, and wait for the accuracy to settle.
      6. **Protect people in photos.** Photograph the object, not people.
      7. **Sync daily, review daily.**
      8. **Freeze the form before fieldwork.** Once data exists, add only, and change the version.

      How to set up the form, the accounts and the devices is in the [data collection guide](/guide).

      :::failure How this step most commonly fails
      - The form is changed in the field without rules, and the data splits into versions that no longer join.
      - One shared login: nobody knows who collected what, and the password ends up in a document.
      - Points taken from a distance cluster around the vehicle or the camp entrance.
      - Finalised forms sit on a tablet for days.
      - Faces of children or survivors end up on a printed map.
      - Each country renames codes, so maps and data cannot be compared.
      :::

  - type: status-scale
    id: status
    title: The status scale
    intro: Every observation records whether the object works, on the same four-point scale as the map colours. For access points the same statuses read as passable, restricted and blocked.
    body: |
      If the status is Partly working or Not working, the form asks why. "Can't see" is an honest answer and better than a guess. Status is always shown twice, by colour and by symbol shape or line style, so the map still reads in greyscale.

  - type: table
    id: imagery
    title: Aerial and satellite imagery
    short: Imagery
    columns: [Source, Typical resolution, Status]
    rows:
      - ["Drone", "About 5 cm", "Preferred where flying is possible."]
      - ["Cameras on helicopters and planes", "About 10 cm", "Untested. Needs the pilot's agreement and georeferencing. Atlas plans a test before the end of 2026."]
      - ["Satellite", "About 30 cm", "Fallback where access is constrained."]
    body: |
      Drone operations are always coordinated with national authorities and humanitarian partners before deployment, including flight authorisations. Local authorities and camp management are told, for transparency and community acceptance. When a drone orthomosaic becomes available, it replaces the satellite layer. When and how to combine sources is parked for a later phase {tbc}.

      :::failure How this step most commonly fails
      - Firmware or geofencing databases out of date, so the drone will not take off in restricted airspace.
      - Orthomosaics too large to upload from the field, so the remote GIS team waits.
      - Pre-event satellite imagery used as if it showed the site today.
      - Cloud cover over the site, found only after the imagery was ordered.
      :::

  - type: prose
    id: gis
    title: GIS processing
    short: GIS
    body: |
      GIS combines the field observations and the imagery into standard operational maps. Any GIS works; the reference template is a QGIS project (Annex B) whose layers are re-pointed to each deployment's data, in a fixed folder structure. ArcGIS is not required. Records marked Not Approved during the daily review are left out. Site outlines and blocks are still mostly drawn by hand; any automated detection is a suggestion that a person checks against the ground truth.

      :::failure How this step most commonly fails
      - The GIS project lives on one person's laptop, and leaves with them.
      - Maps go out before the field team has checked the odd points.
      :::

  - type: prose
    id: products
    title: Products and dissemination
    short: Products
    body: |
      RISA products come in two linked forms: **the printed map**, a dated, versioned snapshot for meetings, walls and places without internet; and **the online view**, the same data kept up to date and filterable by sector. The online view is the source of truth, and the printed map carries a QR code that opens it. It must work offline-first.

      Every map carries the site and assessment details, the imagery, standard symbols with status by colour and shape, **counts** of tents, latrines, water points and other features, a summary table, a QR code to the online view, a QR code to the feedback form, and the RISA, partner and endorser logos (endorser logo pending clearance). A key-findings page goes with the map. See [the product](/product).

      Products go out as fast as possible, through the coordination channels the site actually uses (OSOCC and the Virtual OSOCC, ReliefWeb, cluster lists, agreed messaging groups, the national authority and camp management). Printed maps remain essential: A4 for field teams, A3 for coordination meetings, A0 for OSOCCs and EOCs.

      Every map also carries a QR code to a short feedback form {tbc: Kobo builds it, end of 2026}. Feedback goes to the working group, not to a helpdesk.

      :::failure How this step most commonly fails
      - An old print circulates as if it were current. The date, version and QR code prevent this.
      - The map shows symbols but no counts, so readers cannot see the size of a gap.
      - The online link needs a login that field users do not have.
      - Printing is left to the last day and there is no printer.
      :::

  - type: rows
    id: roles
    title: Roles
    intro: Roles are named, not people. One person may hold several roles in a small deployment, but every role has a named holder and a back-up.
    items:
      - { term: Team lead, body: "Overall coordination; engagement with authorities and partners; assessment priorities." }
      - { term: Data / Kobo focal point, body: "Adapts the form from the template; owns the data-collection project and its permissions; sets up and tests devices; trains collectors; runs the daily review; manages exports and the connection to the online view; applies the data-protection rules." }
      - { term: Field assessment team, body: "Direct observation; GPS points; photos; one account each; daily sync." }
      - { term: Drone operator, body: "When applicable: mission preparation, flight authorisation, image acquisition, flight safety, initial imagery review." }
      - { term: GIS specialist, body: "Data preparation and integration; map production; quality control; final products." }
      - { term: Remote GIS owner, body: "A named person, usually remote, who owns the GIS project, the templates and the product versions for the whole deployment, so work continues when field staff rotate." }
      - { term: Remote support team, body: "Parallel processing and map production while field work continues; troubleshooting; product review." }
      - { term: Host focal point, body: "A person in the national authority or receiving organisation who joins the work early, has access to the data and products, and takes them over at handover." }
      - term: Handover focal point
        body: "Assesses the receiving organisation's capacity and plans the handover. Who fills this role is still open."
        tbc: true

  - type: prose
    id: handover
    title: Accounts, data protection and handover
    short: Handover
    body: |
      Every system RISA uses (the data-collection project, cloud storage, the online view, the GIS files) belongs to an organisation, not a person, and can be transferred to the host at handover. Each collector has their own account; there are no shared logins, and no credentials in documents. The server is chosen with the host, for data residency. Details: [Accounts and ownership](/guide/accounts).

      RISA collects locations of services, not personal data, but some locations and photos are sensitive. A data-sharing agreement is signed with the host before collection {tbc: template text}. Sensitive services (safe spaces, child-friendly spaces, some health and protection services) are agreed with protection actors before they appear on public products. Details: [Data protection](/guide/protection).

      Handover is planned from the start: name the receiving organisation and host focal point before deploying, produce at least one map together, transfer ownership and check it worked before leaving, then remove the deploying team's access. After handover, support is remote, by webinar and short videos, and through a contact form, on a best-effort basis. There is no ticketed helpdesk.

      :::failure How handover most commonly fails
      - The receiving organisation is named on the last day.
      - Systems stay on the deploying team's accounts. In Madagascar, a dashboard was left running on the deploying team's credentials, which was awkward to unwind.
      - The receiving team has never made a map before the deploying team leaves.
      :::
---
