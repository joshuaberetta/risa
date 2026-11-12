---
title: Home
description: RISA maps what exists in a displacement site and whether it works, within days. An open method from Kobo, MapAction and Atlas Logistique, built to be handed over to national authorities.
toc: true
sections:
  - type: hero
    kicker: RISA handbook · SOP v3, working draft
    siteName: true
    lead: RISA is a rapid way to map what exists on the ground in a displacement site, and whether it works. Field teams record each service with its status and location, drone or satellite imagery shows the site's layout, and the two become one standard map that everyone in the response can use. It answers three questions.
    questions:
      - Can we reach people?
      - Which services still work?
      - Where do we act first?
    links:
      - { label: See the product, href: /product, variant: primary }
      - { label: Open the toolbox, href: /toolbox }

  - type: audiences
    id: who
    title: Who it's for
    intro: For the people deciding what happens in the first days, and the national teams who will run it next.
    items:
      - who: National authorities
        examples: Heads of national disaster and emergency management agencies (NDMAs and NEMAs) and their regional bodies
        question: Can we run our own assessments, without waiting for international teams?
        gets:
          - One procedure and a toolbox built on open standards, so a national team can run RISA itself
          - The data, in open formats, owned by the national authority as agreed
          - Products that carry your authority's name first
        link: { label: Adopt RISA, href: /adopt }
        lead: true
      - who: Coordinators
        examples: UNDAC teams, OSOCC, cluster leads
        question: Where do we act first?
        gets:
          - One map and a key-findings page you can brief from
          - Priority gaps, with who should act
          - A follow-up about a week later
        link: { label: See the product, href: /product }
      - who: Site managers
        examples: Camp and site management, local authorities
        question: Which services in my site still work?
        gets:
          - Every water point, latrine and health post, mapped with its status
          - Counts on the map, so you can see the size of a gap
          - An online view kept up to date, filterable by sector
        link: { label: The key findings page, href: '/product#page-findings' }
      - who: Logistics teams
        examples: Logistics Cluster, agencies delivering aid
        question: Can we reach people, and by which route?
        gets:
          - 'Access routes by status: passable, restricted, blocked'
          - Choke points, gates, storage and landing zones
          - Drone or satellite imagery of what changed
        link: { label: The map page, href: '/product#page-map' }
      - who: Field and data teams
        examples: Data and Kobo focal points, collectors, drone operators, GIS officers
        question: What do I collect, fly and map, and how?
        gets:
          - The RISA XLSForm template and its codebook
          - A step-by-step data collection guide
          - Drone checklists, GIS standards and map layouts
        link: { label: The data collection guide, href: /guide }

  - type: prose
    id: why
    title: Why RISA
    body: |
      In the first days of a sudden-onset disaster, sites appear and change fast, and nobody has a reliable map of them. Sector assessments capture needs, but rarely show how a site is laid out or which services work. UNDAC teams often reach sites before other agencies. A clear picture of conditions on day four has led to latrines, tents and medical teams arriving where they were needed.

      RISA does not replace MIRA or other needs assessments, and it does not interview people. It adds the physical picture: what is there, and what is working.

  - type: rows
    id: method
    title: The method
    short: Method
    intro: Three inputs, collected in parallel and combined into one map.
    items:
      - term: Field observation
        detail: Kobo
        body: |
          Teams walk the site and record each object, its status and a photo, on phones or tablets that work offline. One observation per submission. A drone shows a tank; only a person standing next to it can say whether water comes out.
      - term: Drone or aircraft imagery
        detail: Atlas Logistique
        body: |
          Drones fly where allowed, at about 5 cm resolution. Cameras on helicopters and planes already flying in the response (about 10 cm) are untested.
      - term: Satellite imagery
        detail: MapAction
        body: |
          The fallback where flying isn't possible, at about 30 cm. GIS puts the observations on the imagery with standard symbols and colours.
    body: |
      [The full method](/method)

  - type: steps
    id: steps
    title: Six steps
    items:
      - title: Prepare
        body: Agree sites and objectives with the national authority and partners. Adapt the standard form. Arrange imagery, flight authorisations and the data-sharing agreement.
      - title: Observe
        body: Field teams record each object, its status (Working, Partly working, Not working, Can't see) and a photo. Drones fly where allowed; recent satellite imagery is the fallback.
      - title: Check
        body: The data is reviewed every evening, and collectors get feedback before they go out again.
      - title: Map
        body: Observations go on the imagery with standard symbols and colours, and counts of what's there.
      - title: Share
        body: Printed and digital maps go out through coordination channels the same day where possible.
      - title: Update and hand over
        body: The map follows the site as it changes, then passes to the organisation that takes over.

  - type: prose
    id: scope
    title: The pilot
    body: |
      The pilot covers **displacement camps and collective centres in the first days of a sudden-onset response**. RISA fills the gap until a cluster or sector lead (such as IOM or CCCM) takes over, usually around week 3. Community needs assessment stays with IOM and the clusters.

      Other uses (other infrastructure, environmental emergencies, preparedness, anticipatory action, early recovery) are parked on purpose until the camp pilot is proven.

  - type: timeline
    id: timing
    title: Timing
    items:
      - { when: Day 3–5, title: First map, body: 3–5 days after the site is established. }
      - { when: About a week later, title: Follow-up }
      - { when: As needed, title: Further updates, body: As the response evolves. }
      - when: Around week 3
        title: Handover
        body: To the cluster or sector lead (such as IOM or CCCM) or to the national authority, with mentoring before the team leaves and remote support after.

  - type: table
    id: scenarios
    title: Deployment scenarios
    short: Scenarios
    columns: [Scenario, Includes, When to use]
    rows:
      - ["Full RISA", "Field assessment team, drone mapping, GIS processing and the full standard products.", "Highest detail and accuracy; conditions allow drone flights."]
      - ["Hybrid RISA", "Field observations, available satellite imagery and GIS processing.", "Rapid initial products when drones can't fly."]
      - ["Rapid initial RISA", "Existing imagery, available datasets and limited field validation.", "Early support in the first days; updated as data become available."]

  - type: product
    id: product
    title: The product
    intro: A printed map for the field, an online view for the latest data, and a QR code linking the two.
    pages: [map]
    body: |
      - **A printed map** of the site (A4, A3 or A0), with services by type, coloured by status, and counts of tents, latrines and water points. It works without internet.
      - **A QR code on the map** that opens the online view: the same data, kept up to date and filterable by sector. The online view is the reference; the print is a dated snapshot.
      - **A key-findings page** with the map: access, logistics, the services table and the priority gaps, with who should act.
      - **A feedback QR code** on every map {tbc: feedback form, end of 2026}.
      - **The data itself**, in open formats, owned by the national authority as agreed.
    links:
      - { label: All three pages, href: /product, variant: primary }

  - type: resource-list
    id: toolbox
    title: The toolbox
    intro: Built on open standards and open-source tools, so a national team can run RISA itself.
    items: [sop, xlsform, kobo-annex]
    body: |
      This handbook and the two-page brief for decision makers; **the RISA SOP**, one procedure independent of any software, explaining each step and how it commonly fails; and **annexes** for technicians: the field form, data collection, drone checklists, GIS standards and map layouts.
    links:
      - { label: The whole toolbox, href: /toolbox, variant: primary }
      - { label: The data collection guide, href: /guide }

  - type: prose
    id: training
    title: Training and handover
    short: Handover
    body: |
      RISA is built to be handed over. The receiving organisation and a host focal point are named before the deployment, and work alongside the team from the start. Ownership of the data-collection project, the storage, the online view and the GIS files transfers at handover.

      Support comes in layers:

      - **In-country mentoring**: where possible, the deploying team stays a few extra days to produce the first maps with the receiving team.
      - **Remote support** from the partners.
      - **Webinars and short videos.**
      - **A contact form** {tbc}, answered on a best-effort basis.

      There is **no ticketed helpdesk** and no promised response time. In-country follow-up after the team leaves has no guaranteed owner yet {tbc}.

  - type: deployments
    id: deployments
    title: Where RISA has been used
    short: Deployments
    limit: 4
    links:
      - { label: All deployments, href: /deployments, variant: primary }

  - type: cta
    id: adopt
    title: Adopt RISA
    intro: Want to run RISA in your country, or bring it into an exercise? Tell us what you need.
    links:
      - { label: Adopt RISA, href: /adopt, variant: primary }
      - { label: Read the brief and the SOP, href: /toolbox, variant: secondary }

  - type: owners
---
