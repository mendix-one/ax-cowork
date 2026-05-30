#!/bin/bash
# AX Kit Setup Script
# Initializes the AX Kit for a new product project

echo "========================================"
echo "  AX Kit — Amoza Transformation Kit"
echo "  Setup Script v2.0.0"
echo "========================================"
echo ""

# Step 1: Get product info
read -p "Product name (e.g., aPlanner): " PRODUCT
read -p "Pillar (PLAN/MAKE/MOVE/SELL/CARE/SEE/THINK): " PILLAR
read -p "Team size (default: 7): " TEAM_SIZE
TEAM_SIZE=${TEAM_SIZE:-7}

# Step 2: Replace placeholders in all files
echo ""
echo "Customizing files for $PRODUCT ($PILLAR pillar)..."
find . -name "*.md" -exec sed -i "s/{{PRODUCT}}/$PRODUCT/g" {} +
find . -name "*.md" -exec sed -i "s/{{PILLAR}}/$PILLAR/g" {} +
find . -name "*.md" -exec sed -i "s/{{TEAM_SIZE}}/$TEAM_SIZE/g" {} +
find . -name "*.md" -exec sed -i "s/{{PRODUCT_EXTERNAL}}/$PRODUCT by Amoza/g" {} +

# Step 3: Initialize git
echo "Initializing git repository..."
git init
git add -A
git commit -m "Initialize $PRODUCT project from AX Kit v2.0.0"

echo ""
echo "✓ AX Kit initialized for $PRODUCT!"
echo ""
echo "Next steps:"
echo "  1. Edit CLAUDE.md to add project-specific context"
echo "  2. Fill in .claude/memory/ files with team and milestone details"
echo "  3. Open 00_INTRO/README.md to complete project setup"
echo "  4. Start with 01_DISCOVER/ when ready"
echo ""
