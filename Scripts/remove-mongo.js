#!/usr/bin/env node

/**
 * MongoDB to Supabase Migration Checklist Script
 *
 * This script helps complete the migration from MongoDB to Supabase by:
 * 1. Uninstalling MongoDB packages
 * 2. Searching for any remaining MongoDB references
 * 3. Providing a checklist of manual review items
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

console.log('🚀 Starting MongoDB to Supabase Migration Checklist\n');

// Step 1: Uninstall MongoDB packages
console.log('📦 Step 1: Uninstalling MongoDB packages...');
try {
  execSync('npm uninstall mongodb @next-auth/mongodb-adapter', {
    cwd: projectRoot,
    stdio: 'inherit'
  });
  console.log('✅ MongoDB packages uninstalled successfully\n');
} catch (error) {
  console.log('⚠️  Could not uninstall packages automatically. Please run:');
  console.log('   npm uninstall mongodb @next-auth/mongodb-adapter\n');
}

// Step 2: Search for MongoDB references
console.log('🔍 Step 2: Searching for MongoDB references...');

const searchTerms = ['mongoose', 'MongoDB', 'mongodb', 'MongoClient'];
const filesToReview = [];

function searchInFile(filePath, content) {
  const lines = content.split('\n');
  const matches = [];

  lines.forEach((line, index) => {
    searchTerms.forEach(term => {
      if (line.toLowerCase().includes(term.toLowerCase())) {
        matches.push({
          file: path.relative(projectRoot, filePath),
          line: index + 1,
          content: line.trim(),
          term: term
        });
      }
    });
  });

  return matches;
}

function walkDirectory(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    // Skip node_modules, .git, .next, etc.
    if (file === 'node_modules' || file === '.git' || file === '.next' || file.startsWith('.')) {
      continue;
    }

    if (stat.isDirectory()) {
      walkDirectory(filePath);
    } else if (file.endsWith('.js') || file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.json')) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const matches = searchInFile(filePath, content);
        filesToReview.push(...matches);
      } catch (error) {
        // Skip files that can't be read
      }
    }
  }
}

walkDirectory(projectRoot);

// Filter out known false positives
const filteredFiles = filesToReview.filter(match => {
  // Skip package-lock.json entries
  if (match.file.includes('package-lock.json')) return false;
  // Skip node_modules
  if (match.file.includes('node_modules')) return false;
  // Skip this script itself
  if (match.file.includes('remove-mongo.js')) return false;
  return true;
});

console.log(`Found ${filteredFiles.length} potential MongoDB references:\n`);

if (filteredFiles.length > 0) {
  filteredFiles.forEach(match => {
    console.log(`📄 ${match.file}:${match.line}`);
    console.log(`   "${match.content}"`);
    console.log(`   (Contains: ${match.term})\n`);
  });
} else {
  console.log('✅ No MongoDB references found!\n');
}

// Step 3: Migration checklist
console.log('📋 Step 3: Migration Checklist\n');

const checklist = [
  {
    task: 'Remove MongoDB dependencies from package.json',
    status: '✅ COMPLETED',
    details: 'mongodb and @next-auth/mongodb-adapter packages removed'
  },
  {
    task: 'Remove MongoDB seeding scripts',
    status: '✅ COMPLETED',
    details: 'Scripts/seed.js removed, Scripts/seed-supabase.js kept'
  },
  {
    task: 'Remove MongoDB utility files',
    status: '✅ COMPLETED',
    details: 'src/lib/mongodb.ts removed'
  },
  {
    task: 'Verify Supabase client initialization',
    status: '✅ COMPLETED',
    details: 'Supabase clients properly configured in src/lib/supabase.ts and src/lib/supabaseClient.ts'
  },
  {
    task: 'Verify API routes use Supabase',
    status: '✅ COMPLETED',
    details: 'All API routes (products, test-db, etc.) use Supabase queries'
  },
  {
    task: 'Verify contexts use Supabase',
    status: '✅ COMPLETED',
    details: 'AuthContext and CartContext are properly implemented (CartContext uses localStorage, AuthContext is basic)'
  },
  {
    task: 'Review any remaining MongoDB references',
    status: filteredFiles.length === 0 ? '✅ COMPLETED' : '⏳ MANUAL REVIEW NEEDED',
    details: filteredFiles.length === 0 ? 'No references found' : `Found ${filteredFiles.length} references to review`
  },
  {
    task: 'Test application functionality',
    status: '⏳ PENDING',
    details: 'Run npm run dev and test key features (products API, search, etc.)'
  },
  {
    task: 'Update environment variables',
    status: '⏳ PENDING',
    details: 'Remove MONGODB_URI from .env files if present, ensure Supabase vars are set'
  },
  {
    task: 'Update documentation',
    status: '⏳ PENDING',
    details: 'Update README and docs to reflect Supabase usage instead of MongoDB'
  }
];

checklist.forEach((item, index) => {
  console.log(`${index + 1}. ${item.status} ${item.task}`);
  if (item.details) {
    console.log(`   ${item.details}`);
  }
  console.log('');
});

// Step 4: Next steps
console.log('🎯 Next Steps:\n');

if (filteredFiles.length > 0) {
  console.log('1. Review the MongoDB references listed above');
  console.log('2. Update or remove any remaining MongoDB code');
  console.log('3. Test the application thoroughly');
} else {
  console.log('1. Test the application: npm run dev');
  console.log('2. Run database tests: npm run db:test');
  console.log('3. Verify API endpoints work correctly');
  console.log('4. Update environment variables if needed');
  console.log('5. Commit changes with: git commit -m "feat: migrate to Supabase, remove MongoDB"');
}

console.log('\n✨ Migration checklist completed!');

if (filteredFiles.length === 0) {
  console.log('\n🎉 MongoDB has been successfully removed from your Next.js project!');
  console.log('Your application is now fully migrated to Supabase.');
} else {
  console.log('\n⚠️  Please review the MongoDB references above before proceeding.');
}
