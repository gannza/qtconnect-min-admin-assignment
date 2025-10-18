#!/bin/bash

# Admin Panel Setup Script
echo "🚀 Setting up Admin Panel..."

# Check if Node.js version is correct
NODE_VERSION=$(node -v)
echo "📦 Node.js version: $NODE_VERSION"

# Install dependencies
echo "📥 Installing dependencies..."
npm install

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p src/components/ui
mkdir -p src/store/slices
mkdir -p src/store/api
mkdir -p src/utils
mkdir -p src/hooks
mkdir -p src/pages
mkdir -p src/proto

echo "✅ Setup complete!"
echo ""
echo "To start development:"
echo "  npm run dev"
echo ""
echo "To build for production:"
echo "  npm run build"
