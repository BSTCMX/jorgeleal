#!/usr/bin/env bash
# Gate D: validate live smoke + backup integrity (pre-G1: expect G1 fail, regression pass).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
REPORT_DIR="$ROOT/scripts/nginx-smoke/03-reportes"
ORIG="$ROOT/scripts/nginx-smoke/00-originales"
MANIFEST="$ROOT/scripts/nginx-smoke/MANIFEST.sha256"
OUT="$REPORT_DIR/validate.json"

mkdir -p "$REPORT_DIR"
TMP_LOG="$(mktemp)"
trap 'rm -f "$TMP_LOG"' EXIT

status="PASS"
declare -a errors=()

fail() {
  status="FAIL"
  errors+=("$1")
}

if [[ ! -f "$MANIFEST" ]]; then
  fail "MANIFEST missing"
elif ! (cd "$ORIG" && shasum -a 256 -c "$MANIFEST" >/dev/null 2>&1); then
  fail "00-originales hash mismatch"
fi

if ! grep -q 'try_files $uri $uri/ /index.html;' "$ROOT/Dockerfile"; then
  fail "Dockerfile try_files changed unexpectedly"
fi

set +e
bash "$ROOT/scripts/test-nginx-smoke.sh" >"$TMP_LOG" 2>&1
smoke_exit=$?
set -e
smoke_out="$(cat "$TMP_LOG")"

if echo "$smoke_out" | grep -q 'G1 not met yet; regressions OK'; then
  if [[ "$smoke_exit" -ne 1 ]]; then
    fail "expected smoke exit 1 for pre-G1"
  fi
elif echo "$smoke_out" | grep -q 'all checks passed'; then
  fail "G1 already passing — pre-G1 validate expects failure until nginx fix"
else
  fail "smoke did not match pre-G1 pattern (exit=$smoke_exit)"
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
out_path = "$OUT"
log = Path("$TMP_LOG").read_text(errors="replace")
lines = [ln for ln in log.strip().splitlines() if ln]
err_list = json.loads('''$ERR_JSON''')
out = {
    "status": status,
    "smoke_exit": smoke_exit,
    "g1_not_met_expected": True,
    "errors": err_list,
    "smoke_tail": lines[-8:] if lines else [],
}
Path(out_path).write_text(json.dumps(out, indent=2))
print(json.dumps(out, indent=2))
PY

[[ "$status" == "PASS" ]]
