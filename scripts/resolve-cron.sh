#!/bin/bash
# Local cron script for resolving predictions
# Scheduled: April 17, 2026 at 15:00 EDT (19:00 UTC)
# Fires ~89 min after the demo batch (createdAt 2026-04-10T17:31:47Z, horizon 1w) is due.
# Output: /tmp/scenius-resolve.log

cd /Users/oakgroup/scenius
export PATH="/opt/homebrew/bin:$PATH"
pnpm cli resolve >> /tmp/scenius-resolve.log 2>&1
