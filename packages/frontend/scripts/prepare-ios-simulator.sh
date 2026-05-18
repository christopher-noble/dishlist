#!/usr/bin/env bash
# Boot Simulator.app before Expo tries to activate it (avoids osascript -609 on some Macs).
set -euo pipefail

if ! command -v xcrun >/dev/null 2>&1; then
  echo "Xcode command-line tools are required for the iOS Simulator."
  exit 1
fi

if ! pgrep -x Simulator >/dev/null 2>&1; then
  echo "Opening Simulator…"
  open -a Simulator
  sleep 4
fi

BOOTED_COUNT="$(xcrun simctl list devices booted 2>/dev/null | grep -c Booted || true)"
if [ "${BOOTED_COUNT:-0}" -eq 0 ]; then
  DEVICE_UDID="$(xcrun simctl list devices available -j 2>/dev/null | python3 -c "
import json, sys
data = json.load(sys.stdin)
for devices in data.get('devices', {}).values():
    for d in devices:
        if d.get('isAvailable') and 'iPhone' in d.get('name', ''):
            print(d['udid'])
            sys.exit(0)
" 2>/dev/null || true)"

  if [ -n "${DEVICE_UDID:-}" ]; then
    echo "Booting simulator ${DEVICE_UDID}…"
    xcrun simctl boot "${DEVICE_UDID}" 2>/dev/null || true
    sleep 3
  fi
fi

echo "Simulator ready."
