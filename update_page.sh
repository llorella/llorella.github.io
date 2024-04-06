#!/bin/bash
PROJECT_DIR="$HOME/llorella.github.io"
HTML_FILE="$PROJECT_DIR/index.html"
TEMP_FILE="$PROJECT_DIR/index.html.tmp"

# user runs LLT=1 ./update_page.sh
if [ "$LLT" = "1" ]; then
    llt --non_interactive -l improve_homepage.ll -f $HTML_FILE -p "Add syntax highlighting for content of bash-script-content component." | md > $HTML_FILE
fi
# Load the current state of the page and running ll context with specific system instructions non-interactively. 
# Pipe output to md,  extract the first code block with heading index.html, and write output to index.html.

CURRENT_DATE=$(date '+%Y-%m-%d %H:%M:%S')
sed "s/Last updated on: .*/Last updated on: $CURRENT_DATE<\/p>/" $HTML_FILE > $TEMP_FILE
mv $TEMP_FILE $HTML_FILE

git add .
git commit -m "Site Updated on $CURRENT_DATE"
git push
