#!/usr/bin/env python3
"""
Writes the Kobo form behind the site's Adopt RISA and Feedback forms,
from their fields in content/pages/*.md, so the two never drift apart.

One form takes both: `kind` says which page it came from (adopt, feedback),
and `page` the path. Each site field becomes one question with the same name;
a select's options become a choice list, coded as slugs of their labels
(the same rule as src/lib/forms.ts). Fields with the same name on both pages
(name, email, message) share a question.

  python3 contact-form/build_xlsform.py           # write the xlsx and the function's form.json
  python3 contact-form/build_xlsform.py --check   # fail if the xlsx is out of date

After changing a form's fields in content/, run this, then replace the form
in Kobo with the new file and redeploy it (contact-form/README.md).
"""
import datetime
import json
import pathlib
import re
import sys

import openpyxl
import yaml

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / 'contact-form' / 'RISA_website_messages.xlsx'
# The questions and choice codes, for the function: it accepts nothing else.
SPEC = ROOT / 'contact-form' / 'packages' / 'contact' / 'submit' / 'form.json'
FORM_ID = 'risa_website_messages'
TITLE = 'RISA website messages'
# Filled in by the function, not by the visitor.
SYSTEM = [
    {'type': 'select_one kind', 'name': 'kind', 'label': 'Sent from', 'required': 'yes'},
    {'type': 'text', 'name': 'page', 'label': 'Page'},
]


def slug(label):
    """Choice codes: the label, lower case, with runs of anything else as _ (src/lib/forms.ts)."""
    return re.sub(r'[^a-z0-9]+', '_', label.lower()).strip('_')


def forms():
    """(kind, fields) for every form section in content/pages/."""
    for path in sorted((ROOT / 'content' / 'pages').glob('*.md')):
        front = path.read_text().split('---', 2)[1]
        for section in yaml.safe_load(front).get('sections', []):
            if section.get('type') == 'form':
                yield section['kind'], section['fields']


def build():
    survey, choices, seen = list(SYSTEM), [], {}
    kinds = []
    for kind, fields in forms():
        kinds.append(kind)
        for f in fields:
            name = f['name']
            if name in seen:
                if seen[name] != f['type']:
                    sys.exit(f'Field "{name}" is a {seen[name]} on one form and a {f["type"]} on another: give one a new name.')
                # Asked differently on each page: a neutral label in Kobo.
                row = next(r for r in survey if r['name'] == name)
                if row['label'] != f['label']:
                    row.update(label=name.replace('_', ' ').capitalize(), hint='')
                continue
            seen[name] = f['type']
            row = {'name': name, 'label': f['label'], 'hint': f.get('hint', '')}
            if f['type'] == 'select':
                row['type'] = f'select_one {name}'
                choices += [{'list_name': name, 'name': slug(o), 'label': o} for o in f['options']]
            elif f['type'] == 'textarea':
                row.update(type='text', appearance='multiline')
            elif f['type'] == 'email':
                row.update(type='text', constraint=r"regex(., '^[^@\s]+@[^@\s]+$')", constraint_message='An email address')
            else:
                row['type'] = 'text'
            # Required on either page is enforced by the site and the function, not
            # by Kobo: a field required on one page may be absent on the other.
            survey.append(row)
    choices = [{'list_name': 'kind', 'name': k, 'label': k.capitalize()} for k in kinds] + choices
    return survey, choices


SURVEY_COLS = ['type', 'name', 'label', 'hint', 'required', 'appearance', 'constraint', 'constraint_message']
CHOICE_COLS = ['list_name', 'name', 'label']


def rows(survey, choices):
    return (
        [[r.get(c, '') for c in SURVEY_COLS] for r in survey],
        [[r.get(c, '') for c in CHOICE_COLS] for r in choices],
    )


def spec(survey, choices):
    lists = {}
    for c in choices:
        lists.setdefault(c['list_name'], []).append(c['name'])
    questions = {r['name']: (r['type'].split(' ', 1)[1] if r['type'].startswith('select_one ') else None) for r in survey}
    return json.dumps({'form_id': FORM_ID, 'questions': questions, 'choices': lists}, indent=2) + '\n'


def write(survey, choices):
    SPEC.write_text(spec(survey, choices))
    s_rows, c_rows = rows(survey, choices)
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = 'survey'
    ws.append(SURVEY_COLS)
    for r in s_rows:
        ws.append(r)
    wc = wb.create_sheet('choices')
    wc.append(CHOICE_COLS)
    for r in c_rows:
        wc.append(r)
    st = wb.create_sheet('settings')
    st.append(['form_title', 'form_id', 'version'])
    st.append([TITLE, FORM_ID, datetime.datetime.now().strftime('%Y%m%d%H')])
    wb.save(OUT)


def check(survey, choices):
    """True when the xlsx has the same questions and choices (the version may differ)."""
    if not OUT.exists():
        return False
    wb = openpyxl.load_workbook(OUT)
    read = lambda ws: [[c if c is not None else '' for c in r] for r in ws.iter_rows(min_row=2, values_only=True)]
    same_spec = SPEC.exists() and SPEC.read_text() == spec(survey, choices)
    return same_spec and (read(wb['survey']), read(wb['choices'])) == rows(survey, choices)


if __name__ == '__main__':
    survey, choices = build()
    if '--check' in sys.argv:
        if not check(survey, choices):
            sys.exit('The Kobo form or the function\'s form.json is out of date: run python3 contact-form/build_xlsform.py')
        print(f'{OUT.relative_to(ROOT)} matches the site forms.')
    else:
        write(survey, choices)
        print(f'Wrote {OUT.relative_to(ROOT)}: {len(survey)} questions, {len(choices)} choices.')
