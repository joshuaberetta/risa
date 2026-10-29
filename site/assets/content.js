/*
 * Shared content for the toolbox and deployments pages, the same in every
 * theme. Sources: the Notion workstream page (summary, SOP v2, Annex D,
 * 30 Sep call notes) and Kobo's humanitarian response records on kobo.ngo.
 * Anything not confirmed is marked tbc: true or says so in the text.
 *
 * Deployments
 *   kind     response | training | workshop | event
 *   status   completed | active | planned
 *   mode     deployed | remote | both   (how the consortium supported it)
 *   scenario full | hybrid | rapid      (RISA deployment scenario, responses only)
 *   locations [{ name, lat, lon }]       map pins; otherwise the country centre
 *
 * Resources
 *   category sop | forms | gis | training | comms
 *   status   available | draft | in-progress | planned
 *   build    for 'available' items generated in the browser (see library.js)
 */
window.RISAContent = {
  contact: 'contact@risa-method.org',

  partners: {
    atlas: { name: 'HI/Atlas Logistique', role: 'UAV operations, field logistics, consortium lead' },
    mapaction: { name: 'MapAction', role: 'GIS, satellite imagery, map products' },
    kobo: { name: 'Kobo', role: 'Field forms, data standards, toolbox' },
    undac: { name: 'UNDAC / OCHA', role: 'Activation and coordination' },
  },

  deployments: [
    {
      id: 'mozambique-floods-2026', kind: 'response', status: 'completed', mode: 'deployed', scenario: 'full',
      title: 'Mozambique floods: first RISA field test',
      place: 'Mozambique', countries: ['Mozambique'], hazard: 'Floods and displacement',
      start: '2026-01-26', end: '2026-02-08',
      partners: ['atlas', 'mapaction', 'kobo', 'undac'],
      summary: 'The first time the three inputs were collected in parallel and combined into the three-page product, during the response to flooding and mass displacement.',
      products: ['Common Operational Picture maps', 'Infrastructure inventory', 'Situation brief'],
      body: [
        ['The situation', 'Severe flooding in early 2026 displaced large numbers of people in Mozambique.'],
        ['What we did', 'Working alongside UNDAC, OCHA and MapAction, the consortium ran RISA end to end for the first time. Kobo built the observation form, HI/Atlas Logistique and Kobo collected field data with KoboCollect, and MapAction produced the maps. The output was the static three-page product, shared with response partners.'],
        ['What it showed', 'The core workflow works: three inputs collected in parallel, fused into one product, and disseminated within days. The static PDF, though, loses much of the richness of the combined drone, field and imagery data, which is why the next phase pilots an interactive product alongside it.'],
      ],
      lessons: [
        'A static PDF is still needed for low-connectivity settings and printed briefings, but layer relationships and before/after comparisons work far better interactively.',
        'National emergency management staff and drone teams who took part are the natural owners of the method.',
        'The response led to an invitation to SADC’s INFORM risk workshop, part of preparedness work in Southern Africa.',
      ],
      resources: ['sop', 'xlsform', 'gis-standards', 'map-layouts'],
      note: 'RISA in Brief lists this use as a SADC SIMEX, while the response records describe a floods response. The two need aligning.',
    },
    {
      id: 'venezuela-earthquake-2026', kind: 'response', status: 'completed', mode: 'both', scenario: 'full',
      title: 'Venezuela earthquake response',
      place: 'Caracas, Venezuela', countries: ['Venezuela'], locations: [{ name: 'Caracas', lat: 10.48, lon: -66.9 }],
      hazard: 'Earthquake', start: '2026-06-24', end: '2026-07-31',
      partners: ['atlas', 'kobo'],
      summary: 'Drone imagery and observation surveys of displacement sites after the magnitude 7.5 earthquake near Caracas.',
      products: ['Drone orthomosaics', 'Infrastructure inventory', 'Site maps'],
      body: [
        ['The situation', 'A magnitude 7.5 earthquake struck near Caracas.'],
        ['What we did', 'HI/Atlas Logistique flew the sites by drone while Kobo supported remotely with adapted assessment forms, KoboToolbox accounts and Spanish-language guidance.'],
        ['What it showed', 'The drone orthomosaic revealed handwashing stations, latrines, child-friendly spaces and health services that satellite imagery could not reliably show. This is the clearest case so far for the aerial input.'],
      ],
      lessons: [
        'The flight authorisation and the DJI GEO zone unlock are two separate steps. The unlock needs a connection and must be done before deploying.',
        'Datasets and forms from this response are being shared with MapAction.',
      ],
      resources: ['uav-checklist', 'xlsform', 'deployment-checklist'],
      note: 'The dates are those of Kobo’s support. The dates of the field flights are to be confirmed.',
      tbc: true,
    },
    {
      id: 'lyon-workshop-2026', kind: 'workshop', status: 'active', mode: 'deployed',
      title: 'Lyon design workshop',
      place: 'HI/Atlas Logistique HQ, Lyon, France', countries: ['France'], locations: [{ name: 'Lyon', lat: 45.76, lon: 4.84 }],
      start: '2026-10-29', end: '2026-10-30',
      partners: ['atlas', 'mapaction', 'kobo', 'undac'],
      summary: 'Two days to review every workstream, consolidate the first operational toolbox, and agree a six-month roadmap.',
      body: [
        ['Why', 'Before RISA can be handed over, the consortium needs one agreed version of the method, the toolbox and the products.'],
        ['Agenda', 'Review all workstreams, consolidate a first operational RISA toolbox, validate workflows and draft products, prepare the package for Durban, and agree a six-month roadmap and draft governance.'],
        ['Who', 'MapAction, Kobo and HI/Atlas Logistique, with UNDAC Canada and UNDAC A&A to be confirmed. Partners cover their own travel; Atlas helps with logistics.'],
      ],
      resources: ['sop', 'brief', 'tot-deck'],
    },
    {
      id: 'durban-workshop-2026', kind: 'workshop', status: 'planned', mode: 'deployed',
      title: 'Durban: RISA for SADC member states',
      place: 'Durban, South Africa', countries: ['South Africa', 'Madagascar', 'Malawi', 'Mozambique', 'Zambia', 'Zimbabwe'],
      locations: [{ name: 'Durban', lat: -29.86, lon: 31.02 }],
      start: '2026-11', partners: ['mapaction', 'atlas', 'kobo'],
      summary: 'A session with SHOC and SADC member states to present RISA and gather early feedback from regional bodies and national authorities.',
      body: [
        ['Why', 'Southern Africa is where RISA was first tested, and where a regional Training of Trainers could reach several national authorities at once.'],
        ['What’s planned', 'MapAction invited the RISA partners to a session with SHOC and member states (Madagascar, Malawi, Mozambique, Zambia and Zimbabwe). The consortium will present the method and the draft toolbox, and listen to what national teams need to run it themselves.'],
      ],
      resources: ['brief', 'sop'],
      tbc: true, note: 'Exact dates and Kobo’s attendance are to be confirmed.',
    },
    {
      id: 'tot-pilot', kind: 'training', status: 'planned', mode: 'deployed',
      title: 'Pilot Training of Trainers',
      place: 'Location to be decided', countries: [],
      start: '2027', partners: ['atlas', 'mapaction', 'kobo'],
      summary: 'The first RISA Training of Trainers, for 10 to 15 people from the partners’ own rosters, starting with a full SIMEX.',
      body: [
        ['Why', 'Before training national authorities, the consortium needs a cohort of trainers who have all run RISA the same way.'],
        ['What’s planned', 'A pilot course for partner rosters (Kobo, MapAction, Atlas), with a SIMEX on realistic scenario data. Atlas covers direct training costs; partners cover travel and staff time. Two further courses for national authorities, Flying Labs operators and national NGOs follow in year two.'],
      ],
      resources: ['tot-deck', 'simex-pack', 'sop'],
      tbc: true, note: 'Planned for the second half of year one of the capacity-transfer plan. Location and dates to be decided.',
    },
    {
      id: 'bahamas-pilot', kind: 'training', status: 'planned', mode: 'both',
      title: 'Bahamas capacity-strengthening pilot',
      place: 'Nassau, The Bahamas', countries: ['Bahamas'], locations: [{ name: 'Nassau', lat: 25.05, lon: -77.35 }],
      start: '2026-Q4', partners: ['mapaction', 'kobo'],
      summary: 'A possible RISA pilot and training test within a MapAction and Kobo project with the Bahamas disaster management authority.',
      body: [
        ['Why', 'A planned capacity-strengthening project with a national disaster management authority is a chance to test RISA training in a hurricane-prone small island state.'],
        ['What’s planned', 'MapAction and Kobo are exploring the pilot, and how HI/Atlas Logistique can be included.'],
      ],
      resources: ['sop', 'xlsform'],
      tbc: true, note: 'Under discussion. Nothing is agreed yet.',
    },
    {
      id: 'hnpw-2027', kind: 'event', status: 'planned', mode: 'deployed',
      title: 'HNPW 2027',
      place: 'Geneva, Switzerland', countries: ['Switzerland'], locations: [{ name: 'Geneva', lat: 46.2, lon: 6.14 }],
      start: '2027', partners: ['atlas', 'mapaction', 'kobo'],
      summary: 'Presenting RISA at Humanitarian Networks and Partnerships Week, and making the case for aerial and drone assessment in UNDAC.',
      body: [
        ['Why', 'HNPW is where UNDAC, OCHA and donors meet. It is a chance to seek recognition for RISA in learning pathways and to engage donors.'],
      ],
      resources: ['brief'],
      tbc: true, note: 'Dates and format to be confirmed.',
    },
  ],

  resources: [
    { id: 'sop', category: 'sop', code: 'SOP', title: 'Standard operating procedure', version: 'v2', status: 'draft', owner: 'HI/Atlas Logistique · MapAction · Kobo', format: 'PDF', updated: '2026-10-06', languages: ['English'],
      summary: 'The six-step workflow, roles, deployment scenarios and quality checks.',
      details: ['Steps: mission preparation, field data collection, data processing, GIS integration, dissemination, updating.', 'Principles: rapid, accurate, standardised, operational, scalable and collaborative.', 'Still to complete: section 2.1 (Kobo) and section 2.4 (GIS).'] },
    { id: 'xlsform', category: 'forms', code: 'Annex A', title: 'Master XLSForm', version: 'draft', status: 'in-progress', owner: 'Kobo', format: 'XLSX (XLSForm)', languages: ['English'],
      summary: 'The KoboCollect site observation survey, recorded by direct observation rather than interviews.',
      details: ['Covers access constraints, water, sanitation, health, protection, storage and logistics.', 'Works offline and syncs when there’s a connection.', 'Status choices match the map: working, partly working, not working, not assessed.'] },
    { id: 'gis-standards', category: 'gis', code: 'Annex B', title: 'GIS standards and symbology', version: 'draft', status: 'in-progress', owner: 'MapAction', format: 'PDF · QML styles', languages: ['English'],
      summary: 'Data model, naming, metadata and the shared map symbology.',
      details: ['Uses the reserved status colours and the line-style and symbol rules from the style guide.', 'Follows OCHA humanitarian icon conventions.'] },
    { id: 'map-layouts', category: 'gis', code: 'Annex C', title: 'Map layouts for the three pages', version: 'draft', status: 'in-progress', owner: 'MapAction', format: 'QGIS print layouts (QPT)', languages: ['English'],
      summary: 'QGIS templates for the Common Operational Picture, key findings and hotspot pages, at A3 and A4.' },
    { id: 'uav-checklist', category: 'sop', code: 'Annex D', title: 'UAV checklist and ADAK kit', version: 'draft', status: 'draft', owner: 'HI/Atlas Logistique', format: 'PDF', languages: ['English'],
      summary: 'Pre-flight, in-flight and processing checks, flight defaults and the kit list.',
      details: ['Platforms: DJI Mini 4 Pro and Mini 5 Pro, both under 250 g.', 'Defaults: nadir capture at 120 m AGL (about 4.3 cm/px), 80% forward and 70% side overlap.', 'Planning: 1 km² is about 27 minutes, 2 batteries and 740 photos, with 6–13 hours of local processing.', 'The ADAK kit fits in one Pelican 1535 Air case; six kits are held.'] },
    { id: 'deployment-checklist', category: 'sop', code: 'Annex E', title: 'Deployment checklist', version: 'draft', status: 'in-progress', owner: 'HI/Atlas Logistique · MapAction · Kobo', format: 'PDF', languages: ['English'],
      summary: 'What to pack, sign and unlock before travelling.' },
    { id: 'tot-deck', category: 'training', code: 'ToT', title: 'Training of Trainers slides', version: 'draft', status: 'in-progress', owner: 'HI/Atlas Logistique · MapAction · Kobo', format: 'PPTX · Google Slides', languages: ['English'],
      summary: 'Module 1: why RISA, the three inputs, the six steps, reading the product, handover.', preview: 'collateral.html#slides' },
    { id: 'simex-pack', category: 'training', code: 'SIMEX', title: 'SIMEX scenario pack', version: 'draft', status: 'in-progress', owner: 'HI/Atlas Logistique · MapAction · Kobo', format: 'ZIP: scenario, injects, sample imagery', languages: ['English'],
      summary: 'A full simulation on realistic scenario data, used to start every course.' },
    { id: 'product-template', category: 'gis', code: 'Product', title: 'Three-page product, worked example', version: 'sample', status: 'available', owner: 'RISA design system', format: 'Web preview', languages: ['English'],
      summary: 'The Common Operational Picture, key findings and hotspot pages, on a fictional site.', preview: 'product.html' },
    { id: 'symbols', category: 'gis', code: 'Symbols', title: 'Map symbol set', version: 'draft', status: 'available', owner: 'RISA design system', format: 'SVG', languages: ['—'], build: 'symbols',
      summary: 'Every service symbol in every status, plus route line styles, as one SVG sheet.' },
    { id: 'status-tokens', category: 'gis', code: 'Tokens', title: 'Status colours', version: 'draft', status: 'available', owner: 'RISA design system', format: 'JSON', languages: ['—'], build: 'tokens',
      summary: 'The reserved status and hazard colours, for QGIS, Kobo and slide templates.' },
    { id: 'brief', category: 'comms', code: 'Brief', title: 'RISA in Brief', version: 'v2', status: 'draft', owner: 'HI/Atlas Logistique · MapAction · Kobo', format: 'PDF, 2 pages', languages: ['English'],
      summary: 'The two-page advocacy note for partners, donors and national authorities.', preview: 'collateral.html#brief' },
    { id: 'viewer', category: 'gis', code: 'Viewer', title: 'Interactive viewer (pilot)', version: 'pilot', status: 'planned', owner: 'MapAction', format: 'Web', languages: ['English'],
      summary: 'The same layers and symbols as the printed product, with base maps and layers you can switch.', preview: 'product.html#interactive' },
  ],

  categories: {
    sop: 'Procedures',
    forms: 'Forms and data',
    gis: 'GIS and maps',
    training: 'Training',
    comms: 'Communication',
  },
};
