#!/bin/bash
set -e

echo "Building web export..."
npx expo export --platform web

# Inject Google Fonts if Expo dropped them from dist/index.html
if ! grep -q 'fonts.googleapis.com' dist/index.html; then
  echo "Injecting Google Fonts links into dist/index.html..."
  sed -i '' 's|</head>|<link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin /><link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700\&display=swap" rel="stylesheet" /></head>|' dist/index.html
fi

echo "Build complete. Deploy with: vercel deploy --prod --yes dist"
