#!/bin/bash
PROJECT_DIR="$HOME/llorella.github.io"

# user runs LLT=1 ./update_page.sh
if [ "$LLT" -eq 1 ]; then
    llt --non_interactive -l improve_homepage_demo.ll -f $PROJECT_DIR/index.html -p "Change the main colors to black and white" | md -n 1 -f "index.html" > $PROJECT_DIR/index.html
fi
# Load the current state of the page and running ll context with specific system instructions non-interactively. 
# Pipe output to md,  extract the first code block with heading index.html, and write output to index.html.

HTML_FILE="$PROJECT_DIR/index.html"
TEMP_FILE="$PROJECT_DIR/index.html.tmp"

CURRENT_DATE=$(date '+%Y-%m-%d %H:%M:%S')

sed "s/Last updated on: .*/Last updated on: $CURRENT_DATE<\/p>/" $HTML_FILE > $TEMP_FILE
mv $TEMP_FILE $HTML_FILE

git add .
git commit -m "Site Updated on $CURRENT_DATE"
git push
