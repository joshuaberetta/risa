#!/bin/sh
# Copies the RISA XLSForm template package from the risa-dashboard repo into
# public/files/ (served as /files/...), and records what it copied in
# content/settings/downloads.yml for the download card and the template page.
# The files are never edited here: change them in risa-dashboard and re-run.
#
#   npm run sync:downloads                       # from ../risa-dashboard
#   DASHBOARD=~/code/risa-dashboard npm run sync:downloads
set -eu

ROOT=$(cd "$(dirname "$0")/.." && pwd)
SRC=${DASHBOARD:-$ROOT/../risa-dashboard}/templates/xlsform
OUT=$ROOT/public/files
YML=$ROOT/content/settings/downloads.yml

[ -d "$SRC" ] || { echo "No template folder at $SRC (set DASHBOARD=...)" >&2; exit 1; }

# The newest template: versions are yyyymmddnn, so the names sort by date.
TEMPLATE=$(cd "$SRC" && ls RISA_template_*.xlsx 2>/dev/null | sort | tail -n 1)
[ -n "$TEMPLATE" ] || { echo "No RISA_template_*.xlsx in $SRC" >&2; exit 1; }
VERSION=$(echo "$TEMPLATE" | sed 's/^RISA_template_\(.*\)\.xlsx$/\1/')

mkdir -p "$OUT" "$(dirname "$YML")"
# Older templates go, so only one version is ever downloadable.
rm -f "$OUT"/RISA_template_*.xlsx
for f in "$TEMPLATE" codebook.md legacy_codes.csv; do
  cp "$SRC/$f" "$OUT/$f"
done

size() { wc -c < "$OUT/$1" | tr -d ' '; }
cat > "$YML" <<EOF
# Written by scripts/sync-downloads.sh. Don't edit by hand; re-run the script.
version: '$VERSION'
synced: '$(date +%Y-%m-%d)'
files:
  template: { path: /files/$TEMPLATE, bytes: $(size "$TEMPLATE") }
  codebook: { path: /files/codebook.md, bytes: $(size codebook.md) }
  legacyCodes: { path: /files/legacy_codes.csv, bytes: $(size legacy_codes.csv) }
EOF
echo "Copied $TEMPLATE, codebook.md and legacy_codes.csv (version $VERSION) to public/files/."
