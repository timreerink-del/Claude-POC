#!/bin/bash
echo "🔍 Running Guardian Health Check..."
echo "=================================="
ERRORS=0
WARNINGS=0

# 1 — Check all critical files exist
echo ""
echo "📁 Checking critical files..."
CRITICAL_FILES=(
  "src/screens/DiscoveryScreen.tsx"
  "src/screens/ShiftDetailScreen.tsx"
  "src/screens/OnboardingScreen.tsx"
  "src/screens/MapViewScreen.tsx"
  "src/screens/FilterSheet.tsx"
  "src/components/features/JobCard.tsx"
  "src/components/features/EngagementCard.tsx"
  "src/components/features/DateSelectorFilter.tsx"
  "src/components/navigation/BottomNavBar.tsx"
  "src/components/ui/MeshGradient.tsx"
  "src/components/ui/CollapsibleSection.tsx"
  "src/navigation/index.tsx"
  "src/tokens/index.ts"
  "CLAUDE.md"
)

for file in "${CRITICAL_FILES[@]}"; do
  if [ ! -f "$file" ]; then
    echo "  ❌ MISSING: $file"
    ERRORS=$((ERRORS + 1))
  else
    echo "  ✅ OK: $file"
  fi
done

# 2 — Check banned files are not referenced
echo ""
echo "🚫 Checking for banned files..."
BANNED=(
  "Video_20260304_125735"
  "sort.*icon"
)

for pattern in "${BANNED[@]}"; do
  FOUND=$(grep -r "$pattern" src/ 2>/dev/null)
  if [ ! -z "$FOUND" ]; then
    echo "  ❌ BANNED PATTERN FOUND: $pattern"
    echo "$FOUND"
    ERRORS=$((ERRORS + 1))
  else
    echo "  ✅ Clean: $pattern"
  fi
done

# 3 — Check for hardcoded values
echo ""
echo "🎨 Checking for hardcoded design values..."
HARDCODED=$(grep -r "\"#[0-9A-Fa-f]\{6\}\"" src/ \
  --include="*.tsx" --include="*.ts" \
  | grep -v "tokens/index" \
  | grep -v ".test." \
  | wc -l | tr -d ' ')

if [ "$HARDCODED" -gt "10" ]; then
  echo "  ⚠️  WARNING: $HARDCODED hardcoded hex values found"
  echo "  Run: grep -r '#[0-9A-Fa-f]{6}' src/ to see them"
  WARNINGS=$((WARNINGS + 1))
else
  echo "  ✅ Hardcoded values: $HARDCODED (acceptable)"
fi

# 4 — Check navigation structure
echo ""
echo "🧭 Checking navigation..."
if grep -q "OnboardingScreen" src/navigation/index.tsx; then
  echo "  ✅ Onboarding screen registered"
else
  echo "  ❌ Onboarding screen missing from navigation"
  ERRORS=$((ERRORS + 1))
fi

if grep -q "ONBOARDING_KEY\|dmp_onboarding_complete" src/navigation/index.tsx; then
  echo "  ✅ First-launch logic present"
else
  echo "  ❌ First-launch logic missing"
  ERRORS=$((ERRORS + 1))
fi

# 5 — Check assets exist
echo ""
echo "🖼️  Checking assets..."
ASSET_DIRS=(
  "assets/images/jobs"
  "assets/videos/jobs"
  "assets/illustrations"
)

for dir in "${ASSET_DIRS[@]}"; do
  if [ -d "$dir" ]; then
    COUNT=$(ls "$dir" | wc -l | tr -d ' ')
    echo "  ✅ $dir ($COUNT files)"
  else
    echo "  ❌ MISSING DIR: $dir"
    ERRORS=$((ERRORS + 1))
  fi
done

# 6 — Summary
echo ""
echo "=================================="
echo "Guardian Report:"
echo "  ❌ Errors:   $ERRORS"
echo "  ⚠️  Warnings: $WARNINGS"
echo ""

if [ "$ERRORS" -eq "0" ] && [ "$WARNINGS" -eq "0" ]; then
  echo "✅ ALL CLEAR — project is healthy"
  exit 0
elif [ "$ERRORS" -eq "0" ]; then
  echo "⚠️  WARNINGS FOUND — review before continuing"
  exit 1
else
  echo "❌ ERRORS FOUND — fix before continuing"
  exit 2
fi
