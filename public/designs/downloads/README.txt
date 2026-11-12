Static downloads for the toolbox page (themes/<id>/toolbox.html).

Put the published files here, for example:
  RISA_template.xlsx   master XLSForm (SOP Annex A)
  RISA_codebook.md     data dictionary for the template

Each file is referenced from a resource in assets/content.js by its path from
the site root (file: 'downloads/RISA_template.xlsx', or files: [{ label, file }]).
The download button only appears when that resource's status is 'available',
so add the file first, then change the status.
