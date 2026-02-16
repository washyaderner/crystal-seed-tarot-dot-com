#!/bin/bash
# Crystal Seed Tarot — Automated email list scan
# Runs via cron at 6am and 6pm PST

TOOLS_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$TOOLS_DIR")"
LOG_FILE="$TOOLS_DIR/data/scan.log"

# Activate venv and run scan
source "$PROJECT_DIR/venv/bin/activate"
cd "$TOOLS_DIR"

echo "=== Scan started: $(date) ===" >> "$LOG_FILE"
python3 run_scan.py >> "$LOG_FILE" 2>&1
echo "=== Scan finished: $(date) ===" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"
