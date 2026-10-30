#!/usr/bin/env python3
"""
Generate each theme's toolbox, deployments and deployment-profile pages from
its home page, so they share the theme's own <head>, header and footer.
The page content itself is rendered by assets/library.js.

Also points each home page's nav at the new pages and adds links to them
under the home page's toolbox and deployments sections. Safe to re-run.

  python3 scripts/build-pages.py            # every theme
  python3 scripts/build-pages.py handbook   # one theme
"""
import pathlib, re, sys

SITE = pathlib.Path(__file__).resolve().parent.parent / 'site'
THEMES = ['briefing', 'groundtruth', 'overhead', 'streams', 'sharedground', 'first72', 'handbook', 'report', 'noticeboard']
PAGES = {
    'about': ('about.html', 'About', []),
    'toolbox': ('toolbox.html', 'Toolbox', []),
    'deployments': ('deployments.html', 'Deployments', ['world']),
    'deployment': ('deployment.html', 'Deployment', ['world']),
}
# Which home-page section holds the toolbox and deployments teasers.
TEASERS = {
    'toolbox': ['toolbox', 'before'],
    'deployments': ['deployments', 'follow-up'],
}
LINKS = {
    'toolbox': '<a class="btn btn--primary" href="toolbox.html">Open the toolbox</a>',
    'deployments': '<a class="btn btn--primary" href="deployments.html">All deployments on the map</a>',
}


def nav(header, current=None, home=False):
    """Point Toolbox and Deployments at their pages; other anchors back to the home page."""
    def fix(m):
        href = m.group(1)
        if href == '#toolbox':
            return 'href="toolbox.html"'
        if href == '#deployments':
            return 'href="deployments.html"'
        if home:
            return m.group(0)
        if href == '#':
            return 'href="index.html"'
        return f'href="index.html{href}"'
    header = re.sub(r'href="(#[^"]*)"', fix, header)
    for key, (file, label, _) in list(PAGES.items())[:3]:
        if f'href="{file}"' not in header:
            # Add the link before the header's call-to-action button, or at the end of the nav.
            link = f'<a href="{file}">{label}</a>'
            if re.search(r'<a class="btn', header):
                header = re.sub(r'(<a class="btn)', link + r'\1', header, count=1)
            else:
                header = header.replace('</nav>', link + '</nav>', 1)
    if 'href="#who"' not in header and 'href="index.html#who"' not in header:
        who = 'href="#who"' if home else 'href="index.html#who"'
        header = re.sub(r'(<nav[^>]*>\s*)', rf'\1<a {who}>Who it’s for</a>', header, count=1)
    if current:
        file = PAGES['deployments' if current == 'deployment' else current][0]
        header = header.replace(f'<a href="{file}">', f'<a href="{file}" aria-current="page">', 1)
    return header


# The "Who it's for" section goes straight after the hero (after First 72's clock bar).
AFTER = {'first72': 'clockbar'}
WHO = '<section class="lib-who" id="who" data-block="audiences" aria-label="Who RISA is for"></section>'


def block_end(html, start_re):
    m = re.search(start_re, html)
    return html.index('</section>', m.end()) + len('</section>') if m else None


def who_first(html, theme):
    """Put "Who it's for" after the hero, and the owners strip at the bottom of the page."""
    if 'data-block="audiences"' not in html:
        end = block_end(html, rf'<section class="{AFTER.get(theme, "hero")}[^"]*"[^>]*>')
        html = html[:end] + '\n\n  ' + WHO + html[end:]
    strip = re.search(r'\n  <section class="(?:strip|kitband)[^"]*"[^>]*>.*?</section>', html, re.S)
    if strip and not html[strip.end():].lstrip().startswith('</main>'):
        html = html[:strip.start()] + html[strip.end():]
        html = html.replace('\n</main>', strip.group(0) + '\n</main>', 1)
    # Shared styles and script for the section.
    if 'assets/library.css' not in html:
        html = html.replace('<link rel="stylesheet" href="../../assets/review.css">',
                            '<link rel="stylesheet" href="../../assets/library.css">\n  <link rel="stylesheet" href="../../assets/review.css">', 1)
    if 'assets/library.js' not in html:
        html = html.replace('<script src="../../assets/review.js"></script>',
                            '<script src="../../assets/content.js"></script>\n<script src="../../assets/library.js"></script>\n<script src="../../assets/review.js"></script>', 1)
    return html


def teasers(html):
    for key, ids in TEASERS.items():
        for sid in ids:
            m = re.search(rf'<section[^>]*\bid="{sid}"[^>]*>', html)
            if not m:
                continue
            end = html.index('</section>', m.end())
            if 'lib-more' in html[m.end():end]:
                break
            html = html[:end] + f'<div class="container lib-more">{LINKS[key]}</div>\n  ' + html[end:]
            break
    return html


for theme in (sys.argv[1:] or THEMES):
    folder = SITE / 'themes' / theme
    home = (folder / 'index.html').read_text()
    new_home = who_first(teasers(home.replace(
        re.search(r'<header class="site-header.*?</header>', home, re.S).group(0),
        nav(re.search(r'<header class="site-header.*?</header>', home, re.S).group(0), home=True))), theme)
    if new_home != home:
        (folder / 'index.html').write_text(new_home)
        home = new_home
    head = home[:home.index('</head>')]
    head = head.replace('\n  <link rel="stylesheet" href="../../assets/library.css">', '')
    head = head.replace('<link rel="stylesheet" href="../../assets/review.css">',
                        '<link rel="stylesheet" href="../../assets/library.css">\n  <link rel="stylesheet" href="../../assets/review.css">')
    header = re.search(r'<header class="site-header.*?</header>', home, re.S).group(0)
    footer = re.search(r'<footer class="site-footer.*?</footer>', home, re.S).group(0)
    title = re.search(r'<title>(.*?)</title>', head).group(1)

    for view, (file, label, extra) in PAGES.items():
        page_head = head.replace(f'<title>{title}</title>', f'<title>{label} · {title}</title>')
        scripts = ['themes', 'logos', 'sitemap'] + extra + ['content', 'library', 'review']
        out = f'''{page_head}</head>
<body data-root="../../" data-theme-id="{theme}" data-view="{view}">
<a class="skip-link" href="#lib">Skip to content</a>

{nav(header, view)}

<main id="lib"></main>

{footer}

{chr(10).join(f'<script src="../../assets/{s}.js"></script>' for s in scripts)}
</body>
</html>
'''
        (folder / file).write_text(out)

    print(f'{theme}: {", ".join(f for f, _, _ in PAGES.values())}')
