#!/bin/bash
set -euo pipefail

# This script updates the Jekyll-based website by:
# 1. Optionally running LLT improvements if LLT=1 is set
# 2. Building the Jekyll site
# 3. Committing and pushing changes to git

readonly PROJECT_DIR="$HOME/llorella.github.io"
readonly HTML_FILE="$PROJECT_DIR/index.html"

# Check if required files exist
if [[ ! -f "$HTML_FILE" ]]; then
    echo "Error: $HTML_FILE not found"
    exit 1
fi

# Run LLT improvements if enabled
if [[ "${LLT:-0}" == "1" ]]; then
    echo "Running LLT improvements..."
    if ! command -v llt &> /dev/null; then
        echo "Error: llt command not found"
        exit 1
    fi
    
    if ! llt --non_interactive -l improve_homepage.ll -f "$HTML_FILE" \
        -p "Add syntax highlighting to the bash script in the last updated section." | \
        md > "$HTML_FILE.new"; then
        echo "Error: LLT processing failed"
        rm -f "$HTML_FILE.new"
        exit 1
    fi
    mv "$HTML_FILE.new" "$HTML_FILE"
fi

# Build Jekyll site
echo "Building Jekyll site..."
if ! bundle exec jekyll build; then
    echo "Error: Jekyll build failed"
    exit 1
fi

# Add and commit changes
echo "Committing changes..."
git add .
git commit -m "Update site: $(date '+%Y-%m-%d %H:%M:%S')"
git push
