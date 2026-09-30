#!/usr/bin/env bash
# Live nginx smoke for G1 acceptance (default: https://jorgelealdev.com).
# Exit 0 when G1 desired behavior + regressions pass. Exit 1 otherwise.
set -euo pipefail

BASE="${BASE:-https://jorgelealdev.com}"
JUNK_PATH="${JUNK_PATH:-/this-path-should-not-exist-g1}"
MAX_ATTEMPTS="${MAX_ATTEMPTS:-4}"
SLEEP_SEC="${SLEEP_SEC:-5}"
ROBOTS_SITEMAP_LINE="Sitemap: https://jorgelealdev.com/sitemap-index.xml"

TMP_DIR="${TMPDIR:-/tmp}/jorgeleal-nginx-smoke-$$"
mkdir -p "$TMP_DIR"
trap 'rm -rf "$TMP_DIR"' EXIT

g1_fail=0
reg_fail=0

log() { printf '%s\n' "$*"; }
pass() { log "PASS: $*"; }
fail_g1() { log "FAIL (G1): $*"; g1_fail=1; }
fail_reg() { log "FAIL (regression): $*"; reg_fail=1; }

fetch() {
  local path="$1"
  local url="${BASE}${path}"
  local attempt=1
  local code hdr body
  while [[ "$attempt" -le "$MAX_ATTEMPTS" ]]; do
    code="$(curl -sS -o "$TMP_DIR/body" -D "$TMP_DIR/hdr" -w '%{http_code}' \
      --max-time 25 --connect-timeout 10 "$url" 2>/dev/null || echo "000")"
    if [[ "$code" != "000" && -n "$code" ]]; then
      hdr="$(cat "$TMP_DIR/hdr")"
      body="$(cat "$TMP_DIR/body")"
      printf '%s' "$code"
      return 0
    fi
    sleep "$SLEEP_SEC"
    attempt=$((attempt + 1))
  done
  printf '000'
}

content_type() {
  awk 'BEGIN{IGNORECASE=1} /^content-type:/ {print $2; exit}' "$TMP_DIR/hdr" | tr -d '\r'
}

body_bytes() {
  wc -c < "$TMP_DIR/body" | tr -d ' '
}

body_sha() {
  shasum -a 256 "$TMP_DIR/body" | awk '{print $1}'
}

is_home_html() {
  local home_sha="$1"
  local ct size sha
  ct="$(content_type)"
  size="$(body_bytes)"
  sha="$(body_sha)"
  [[ "$ct" == *html* ]] && [[ "$sha" == "$home_sha" ]] && [[ "$size" -gt 10000 ]]
}

# --- Regression: home ---
code="$(fetch /)"
if [[ "$code" == "200" ]]; then
  ct="$(content_type)"
  if [[ "$ct" == *html* ]] && [[ "$(body_bytes)" -gt 10000 ]]; then
    pass "/ -> 200 HTML"
    HOME_SHA="$(body_sha)"
  else
    fail_reg "/ unexpected body type or size (ct=$ct)"
    HOME_SHA="$(body_sha)"
  fi
else
  fail_reg "/ status=$code"
  HOME_SHA=""
fi

# --- G1: sitemap.xml ---
code="$(fetch /sitemap.xml)"
if [[ "$code" == "301" || "$code" == "302" || "$code" == "308" ]]; then
  loc="$(awk 'BEGIN{IGNORECASE=1} /^location:/ {print $2; exit}' "$TMP_DIR/hdr" | tr -d '\r')"
  if [[ "$loc" == *sitemap-index.xml* ]]; then
    pass "/sitemap.xml -> redirect to sitemap-index"
  else
    fail_g1 "/sitemap.xml redirect wrong Location: $loc"
  fi
elif [[ "$code" == "200" ]] && [[ -n "$HOME_SHA" ]] && is_home_html "$HOME_SHA"; then
  fail_g1 "/sitemap.xml still soft-200 homepage HTML"
elif [[ "$code" == "200" ]]; then
  ct="$(content_type)"
  if [[ "$ct" == *xml* ]]; then
    pass "/sitemap.xml -> 200 XML (acceptable)"
  else
    fail_g1 "/sitemap.xml -> 200 but not XML and not redirect (ct=$ct)"
  fi
else
  fail_g1 "/sitemap.xml unexpected status=$code"
fi

# --- G1: junk path ---
code="$(fetch "$JUNK_PATH")"
if [[ "$code" == "404" ]]; then
  pass "$JUNK_PATH -> 404"
elif [[ "$code" == "200" ]] && [[ -n "$HOME_SHA" ]] && is_home_html "$HOME_SHA"; then
  fail_g1 "$JUNK_PATH still soft-200 homepage HTML"
else
  fail_g1 "$JUNK_PATH expected 404, got status=$code"
fi

# --- Regression: robots ---
code="$(fetch /robots.txt)"
if [[ "$code" == "200" ]]; then
  ct="$(content_type)"
  body="$(cat "$TMP_DIR/body")"
  if [[ "$ct" == *plain* ]] && echo "$body" | grep -Fq "$ROBOTS_SITEMAP_LINE"; then
    pass "/robots.txt OK"
  else
    fail_reg "/robots.txt missing Sitemap line or wrong type"
  fi
else
  fail_reg "/robots.txt status=$code"
fi

# --- Regression: sitemaps ---
for p in /sitemap-index.xml /sitemap-0.xml; do
  code="$(fetch "$p")"
  if [[ "$code" == "200" ]] && [[ "$(content_type)" == *xml* ]]; then
    pass "$p -> 200 XML"
  else
    fail_reg "$p status=$code ct=$(content_type)"
  fi
done

# --- Regression: health ---
code="$(fetch /health)"
body="$(cat "$TMP_DIR/body")"
if [[ "$code" == "200" ]] && echo "$body" | grep -q 'OK'; then
  pass "/health OK"
else
  fail_reg "/health status=$code body=$body"
fi

# --- Regression: favicon white ---
code="$(fetch /faviconwhite32.ico)"
if [[ "$code" == "200" ]]; then
  pass "/faviconwhite32.ico -> 200"
else
  fail_reg "/faviconwhite32.ico status=$code"
fi

log "---"
if [[ "$g1_fail" -eq 0 && "$reg_fail" -eq 0 ]]; then
  log "RESULT: all checks passed (G1 + regression)"
  exit 0
fi
if [[ "$g1_fail" -eq 1 && "$reg_fail" -eq 0 ]]; then
  log "RESULT: G1 not met yet; regressions OK (expected before nginx fix)"
  exit 1
fi
log "RESULT: regression failure (investigate)"
exit 1
