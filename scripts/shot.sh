#!/bin/sh
# Usage: scripts/shot.sh <path> <out.png> [width] [height]
# Renders a page from a local server: `npm run preview` (port 4173) by default,
# or set BASE, e.g. BASE=http://localhost:5173 for the dev server.
# Chrome won't make a window narrower than about 500px, so phone widths are
# rendered in an iframe of exactly that width, centred in a 600px window,
# and cropped out.
W=${3:-1440}; H=${4:-4200}; BASE=${BASE:-http://localhost:4173}
URL="$BASE/$1"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
if [ "$W" -lt 500 ]; then
  FRAME=$(mktemp -t risa-shot).html
  printf '<body style="margin:0;display:flex;justify-content:center"><iframe src="%s" style="border:0;width:%spx;height:%spx"></iframe></body>' "$URL" "$W" "$H" > "$FRAME"
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --window-size=600,$H --virtual-time-budget=5000 --screenshot="$2.full.png" "file://$FRAME" 2>/dev/null
  sips -c "$H" "$W" "$2.full.png" --out "$2" >/dev/null 2>&1 && rm -f "$2.full.png" "$FRAME"
else
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --window-size=$W,$H --virtual-time-budget=5000 --screenshot="$2" "$URL" 2>/dev/null
fi
