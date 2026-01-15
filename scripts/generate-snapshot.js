#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Recursively get all files in a directory, excluding specified patterns
 */
function getAllFiles(dirPath, excludePatterns = []) {
  const files = [];

  function traverse(currentPath) {
    const items = fs.readdirSync(currentPath);

    for (const item of items) {
      const fullPath = path.join(currentPath, item);
      const stat = fs.statSync(fullPath);

      // Check if path matches exclude patterns
      const shouldExclude = excludePatterns.some(pattern => fullPath.includes(pattern));
      if (shouldExclude) continue;

      if (stat.isDirectory()) {
        traverse(fullPath);
      } else {
        files.push(fullPath);
      }
    }
  }

  traverse(dirPath);
  return files;
}

/**
 * Generate file tree structure
 */
function generateFileTree(dirPath, excludePatterns = []) {
  const tree = [];

  function traverse(currentPath, prefix = '') {
    const items = fs.readdirSync(currentPath).sort();
    const filteredItems = items.filter(item => {
      const fullPath = path.join(currentPath, item);
      return !excludePatterns.some(pattern => fullPath.includes(pattern));
    });

    filteredItems.forEach((item, index) => {
      const fullPath = path.join(currentPath, item);
      const isLast = index === filteredItems.length - 1;
      const connector = isLast ? '└── ' : '├── ';
      const nextPrefix = prefix + (isLast ? '    ' : '│   ');

      tree.push(prefix + connector + item);

      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        traverse(fullPath, nextPrefix);
      }
    });
  }

  traverse(dirPath);
  return tree.join('\n');
}

/**
 * Main function to generate code snapshot
 */
function generateSnapshot() {
  const sourceDirs = ['backend', 'frontend'];
  const excludePatterns = ['node_modules', '.git', 'dist', '.next', 'build', '.venv', 'venv', '__pycache__'];
  const outputPath = 'docs/projCodes.md';

  let content = '# Project Code Snapshot\n\n';
  content += 'Generated on: ' + new Date().toISOString() + '\n\n';

  for (const dir of sourceDirs) {
    if (!fs.existsSync(dir)) {
      console.log(`Directory ${dir} does not exist, skipping...`);
      continue;
    }

    content += `## Directory: ${dir}/\n\n`;
    content += '### File Tree\n\n```\n';
    content += generateFileTree(dir, excludePatterns);
    content += '\n```\n\n';

    const files = getAllFiles(dir, excludePatterns);

    for (const file of files) {
      const relativePath = path.relative('.', file);
      const ext = path.extname(file).toLowerCase();

      // Skip binary files and common non-code files
      if (['.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg', '.woff', '.woff2'].includes(ext)) {
        continue;
      }

      content += `### ${relativePath}\n\n`;
      content += '```' + (ext.slice(1) || 'text') + '\n';

      // Skip content for binary files and large lock files
      if (path.basename(file) === 'sql_app.db' || path.basename(file) === 'pnpm-lock.yaml') {
        content += '> (Content skipped for readability)';
      } else {
        try {
          const fileContent = fs.readFileSync(file, 'utf8');
          content += fileContent;
        } catch (error) {
          content += `Error reading file: ${error.message}`;
        }
      }

      content += '\n```\n\n';
    }
  }

  fs.writeFileSync(outputPath, content, 'utf8');
  console.log(`Code snapshot generated at ${outputPath}`);
}

// Run the script
if (require.main === module) {
  generateSnapshot();
}

module.exports = { generateSnapshot };