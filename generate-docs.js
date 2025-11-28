#!/usr/bin/env node

/**
 * CoderQuest Component Documentation Generator
 * Converts all React components and SCSS files to organized Markdown
 * Usage: node generate-docs.js
 */

const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  outputDir: './docs',
  outputFile: 'CODERQUEST_COMPONENTS.md',
  srcDirs: {
    components: './src/components',
    hooks: './src/hooks',
    styles: './src/styles'
  }
};

// Ensure output directory exists
if (!fs.existsSync(config.outputDir)) {
  fs.mkdirSync(config.outputDir, { recursive: true });
}

// Helper functions
const readFile = (filePath) => {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err.message);
    return '';
  }
};

const getFiles = (dir, ext) => {
  try {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir)
      .filter(file => file.endsWith(ext))
      .map(file => path.join(dir, file));
  } catch (err) {
    console.error(`Error reading directory ${dir}:`, err.message);
    return [];
  }
};

const formatFileName = (filePath) => {
  return path.basename(filePath);
};

const generateComponentDocs = () => {
  let markdown = `# CoderQuest - React Components & SCSS Documentation\n\n`;
  markdown += `**Generated:** ${new Date().toLocaleString()}\n\n`;
  markdown += `## Table of Contents\n\n`;
  markdown += `- [React Components](#react-components)\n`;
  markdown += `- [Custom Hooks](#custom-hooks)\n`;
  markdown += `- [SCSS Styles](#scss-styles)\n\n`;

  // ===== REACT COMPONENTS =====
  markdown += `---\n\n## React Components\n\n`;
  markdown += `React components for the CoderQuest learning system.\n\n`;

  const componentFiles = getFiles(config.srcDirs.components, '.jsx');
  componentFiles.forEach((filePath, index) => {
    const fileName = formatFileName(filePath);
    const content = readFile(filePath);
    
    markdown += `### ${index + 1}. ${fileName}\n\n`;
    markdown += `\`\`\`jsx\n`;
    markdown += content;
    markdown += `\n\`\`\`\n\n`;
  });

  // ===== CUSTOM HOOKS =====
  markdown += `---\n\n## Custom Hooks\n\n`;
  markdown += `Custom React hooks for game integration and event handling.\n\n`;

  const hookFiles = getFiles(config.srcDirs.hooks, '.js');
  hookFiles.forEach((filePath, index) => {
    const fileName = formatFileName(filePath);
    const content = readFile(filePath);
    
    markdown += `### ${index + 1}. ${fileName}\n\n`;
    markdown += `\`\`\`javascript\n`;
    markdown += content;
    markdown += `\n\`\`\`\n\n`;
  });

  // ===== SCSS STYLES =====
  markdown += `---\n\n## SCSS Styles\n\n`;
  markdown += `SCSS stylesheets organized by component.\n\n`;

  const scssFiles = getFiles(config.srcDirs.styles, '.scss');
  scssFiles.forEach((filePath, index) => {
    const fileName = formatFileName(filePath);
    const content = readFile(filePath);
    
    markdown += `### ${index + 1}. ${fileName}\n\n`;
    markdown += `\`\`\`scss\n`;
    markdown += content;
    markdown += `\n\`\`\`\n\n`;
  });

  // ===== FOOTER =====
  markdown += `---\n\n## Summary\n\n`;
  markdown += `**Total Components:** ${componentFiles.length}\n\n`;
  markdown += `**Total Hooks:** ${hookFiles.length}\n\n`;
  markdown += `**Total Stylesheets:** ${scssFiles.length}\n\n`;
  markdown += `**Generated on:** ${new Date().toLocaleString()}\n`;

  return markdown;
};

// Generate and save documentation
console.log('🚀 Generating CoderQuest Component Documentation...\n');

const markdown = generateComponentDocs();
const outputPath = path.join(config.outputDir, config.outputFile);

fs.writeFileSync(outputPath, markdown, 'utf-8');

console.log(`✅ Documentation generated successfully!\n`);
console.log(`📄 Output file: ${outputPath}\n`);
console.log(`📊 Summary:`);
console.log(`   - React Components: ${getFiles(config.srcDirs.components, '.jsx').length}`);
console.log(`   - Custom Hooks: ${getFiles(config.srcDirs.hooks, '.js').length}`);
console.log(`   - SCSS Files: ${getFiles(config.srcDirs.styles, '.scss').length}`);
console.log(`\n💡 Next steps:`);
console.log(`   1. View the markdown: cat ${outputPath}`);
console.log(`   2. Convert to PDF using pandoc:`);
console.log(`      pandoc ${outputPath} -o ${path.join(config.outputDir, 'CODERQUEST_COMPONENTS.pdf')}`);
console.log(`   3. Or use VS Code's markdown preview extension\n`);
