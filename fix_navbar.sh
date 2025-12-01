#!/bin/bash
# Fix the NavBar.tsx file by replacing the malformed first line
sed -i '' '1s/use client'\'';/use client'\'';/' src/components/NavBar.tsx
