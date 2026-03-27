#!/bin/bash
echo "Available restore points:"
git tag | grep "restore/" | sort -r

echo ""
echo "To restore to a point, run:"
echo "  git checkout [tag-name]"
echo ""
echo "To see what changed since a restore point:"
echo "  git diff [tag-name] HEAD"
