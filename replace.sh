#!/bin/bash
find . -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.html" -o -name "*.js" -o -name "*.json" -o -name "*.md" -o -name "*.yaml" \) -exec sed -i '' 's/Nexus Tech Hub/Midas Technical Solutions/g' {} \;
