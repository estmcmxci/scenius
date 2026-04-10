#!/bin/bash
# Local cron script for resolving predictions
# Scheduled: April 17, 2026 at 12:00 UTC
# Output: /tmp/scenius-resolve.log

cd /Users/oakgroup/scenius
export PATH="/opt/homebrew/bin:$PATH"
pnpm cli resolve >> /tmp/scenius-resolve.log 2>&1
