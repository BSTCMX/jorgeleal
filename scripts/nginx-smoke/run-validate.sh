#!/usr/bin/env bash
# Validate live smoke + backup integrity (pre-G1 or post-G1 from Dockerfile).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
REPORT_DIR="$ROOT/scripts/nginx-smoke/03-reportes"
ORIG="$ROOT/scripts/nginx-smoke/00-originales"
MANIFEST="$ROOT/scripts/nginx-smoke/MANIFEST.sha256"
DOCKERFILE="$ROOT/Dockerfile"

mkdir -p "$REPORT_DIR"
TMP_LOG="$(mktemp)"
trap 'rm -f "$TMP_LOG"' EXIT

status="PASS"
declare -a errors=()

fail() {
  status="FAIL"
  errors+=("$1")
}

post_g1=0
if grep -q 'location = /sitemap.xml' "$DOCKERFILE" \
  && grep -q 'try_files $uri $uri/ =404;' "$DOCKERFILE"; then
  post_g1=1
  OUT="$REPORT_DIR/validate-post-g1.json"
else
  OUT="$REPORT_DIR/validate.json"
fi

if [[ ! -f "$MANIFEST" ]]; then
  fail "MANIFEST missing"
elif ! (cd "$ORIG" && shasum -a 256 -c "$MANIFEST" >/dev/null 2>&1); then
  fail "00-originales hash mismatch"
fi

if [[ "$post_g1" -eq 0 ]]; then
  if ! grep -q 'try_files $uri $uri/ /index.html;' "$DOCKERFILE"; then
    fail "Dockerfile try_files changed unexpectedly (pre-G1)"
  fi
else
  if grep -q 'try_files $uri $uri/ /index.html;' "$DOCKERFILE"; then
    fail "Dockerfile still has SPA fallback (post-G1 expected =404)"
  fi
fi

set +e
bash "$ROOT/scripts/test-nginx-smoke.sh" >"$TMP_LOG" 2>&1
smoke_exit=$?
set -e
smoke_out="$(cat "$TMP_LOG")"

if [[ "$post_g1" -eq 0 ]]; then
  if echo "$smoke_out" | grep -q 'G1 not met yet; regressions OK'; then
    if [[ "$smoke_exit" -ne 1 ]]; then
      fail "expected smoke exit 1 for pre-G1"
    fi
  elif echo "$smoke_out" | grep -q 'all checks passed'; then
    fail "G1 already passing on live but Dockerfile is pre-G1"
  else
    fail "smoke did not match pre-G1 pattern (exit=$smoke_exit)"
  fi
else
  if echo "$smoke_out" | grep -q 'all checks passed'; then
    if [[ "$smoke_exit" -ne 0 ]]; then
      fail "expected smoke exit 0 for post-G1"
    fi
  elif echo "$smoke_out" | grep -q 'G1 not met yet; regressions OK'; then
    fail "live still pre-G1 — deploy nginx fix before post-G1 validate"
  else
    fail "smoke did not match post-G1 pattern (exit=$smoke_exit)"
  fi
fi

if ((${#errors[@]} == 0)); then
  ERR_JSON='[]'
else
  ERR_JSON="$(python3 -c 'import json,sys; print(json.dumps(sys.argv[1:]))' "${errors[@]}")"
fi

python3 <<PY
import json
from pathlib import Path

status = "$status"
smoke_exit = int("$smoke_exit")
post_g1 = int("$post_g1")
out_path = "$OUT"
log = Path("$TMP_LOG").read_text(errors="replace")
lines = [ln for ln in log.strip().splitlines() if ln]
err_list = json.loads('''$ERR_JSON''')
out = {
    "status": status,
    "smoke_exit": smoke_exit,
    "post_g1": bool(post_g1),
    "g1_not_met_expected": not bool(post_g1),
    "errors": err_list,
    "smoke_tail": lines[-12:] if lines else [],
}
Path(out_path).write_text(json.dumps(out, indent=2))
print(json.dumps(out, indent=2))
PY

[[ "$status" == "PASS" ]]
