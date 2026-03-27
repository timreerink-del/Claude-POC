#!/bin/bash
# Usage: ./scripts/restore-point.sh "description of what works"
DESCRIPTION=${1:-"checkpoint"}
DATE=$(date +%Y-%m-%d-%H%M)
TAG="restore/$DATE-$DESCRIPTION"

git add .
git commit -m "restore-point: $DESCRIPTION"
git tag "$TAG"

echo "✅ Restore point created: $TAG"
echo "To restore later, run: git checkout $TAG"
