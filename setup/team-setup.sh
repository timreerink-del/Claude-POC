#!/bin/bash
echo "🚀 DMP WorkNow — Team Setup"
echo "==========================="
echo ""

# Check prerequisites
echo "Checking prerequisites..."

if ! command -v node &> /dev/null; then
  echo "❌ Node.js not found. Install from: https://nodejs.org"
  exit 1
fi

if ! command -v git &> /dev/null; then
  echo "❌ Git not found. Install Git first."
  exit 1
fi

echo "✅ Prerequisites OK"
echo ""

# Install dependencies
echo "Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Check Expo CLI
if ! command -v expo &> /dev/null; then
  echo "Installing Expo CLI..."
  npm install -g expo-cli
fi
echo "✅ Expo CLI ready"

# Check Claude Code
if ! command -v claude &> /dev/null; then
  echo "Installing Claude Code..."
  npm install -g @anthropic-ai/claude-code
fi
echo "✅ Claude Code ready"

# Run guardian check
echo ""
echo "Running health check..."
./scripts/guardian.sh

echo ""
echo "==========================="
echo "✅ Setup complete!"
echo ""
echo "To start the app:"
echo "  npx expo start"
echo ""
echo "To run on web:"
echo "  npx expo start --web"
echo ""
echo "Before every session:"
echo "  ./scripts/guardian.sh"
echo ""
echo "After every approved feature:"
echo "  ./scripts/restore-point.sh 'feature-name'"
